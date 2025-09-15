import { Course, TimeSlot, GeneratedTimetable, Conflict, UserPreferences, TimetableCell, DayOfWeek } from '../types';

// 시간을 분 단위로 변환
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// 시간 겹침 확인
const isTimeOverlap = (slot1: TimeSlot, slot2: TimeSlot): boolean => {
  if (slot1.day !== slot2.day) return false;
  
  const start1 = timeToMinutes(slot1.startTime);
  const end1 = timeToMinutes(slot1.endTime);
  const start2 = timeToMinutes(slot2.startTime);
  const end2 = timeToMinutes(slot2.endTime);
  
  return !(end1 <= start2 || end2 <= start1);
};

// 시간표 충돌 검사
const checkConflicts = (courses: Course[]): Conflict[] => {
  const conflicts: Conflict[] = [];
  
  for (let i = 0; i < courses.length; i++) {
    for (let j = i + 1; j < courses.length; j++) {
      const course1 = courses[i];
      const course2 = courses[j];
      
      for (const slot1 of course1.timeSlots) {
        for (const slot2 of course2.timeSlots) {
          if (isTimeOverlap(slot1, slot2)) {
            conflicts.push({
              type: 'time',
              courses: [course1, course2],
              timeSlot: slot1
            });
          }
          
          // 같은 시간대에 같은 강의실 사용
          if (slot1.day === slot2.day && 
              slot1.startTime === slot2.startTime && 
              slot1.endTime === slot2.endTime && 
              slot1.room === slot2.room) {
            conflicts.push({
              type: 'room',
              courses: [course1, course2],
              timeSlot: slot1
            });
          }
        }
      }
    }
  }
  
  return conflicts;
};

// 시간표 점수 계산
const calculateTimetableScore = (
  courses: Course[], 
  preferences: UserPreferences
): number => {
  let score = 0;
  const conflicts = checkConflicts(courses);
  
  // 기본 점수 (충돌이 없으면 높은 점수)
  score += 1000 - (conflicts.length * 100);
  
  // 필수 과목 포함 보너스
  const requiredCourses = courses.filter(course => course.isRequired);
  score += requiredCourses.length * 50;
  
  // 우선순위 점수
  score += courses.reduce((sum, course) => sum + course.priority * 10, 0);
  
  // 선호 시간대 점수
  courses.forEach(course => {
    course.timeSlots.forEach(slot => {
      const startMinutes = timeToMinutes(slot.startTime);
      const endMinutes = timeToMinutes(slot.endTime);
      
      if (preferences.preferMorningClasses && startMinutes < 720) { // 12:00 이전
        score += 20;
      }
      
      if (preferences.preferAfternoonClasses && startMinutes >= 720) {
        score += 20;
      }
      
      // 점심시간 피하기 (12:00-13:00)
      if (preferences.avoidLunchTime && 
          !(startMinutes >= 720 && endMinutes <= 780)) {
        score += 15;
      }
    });
  });
  
  // 하루 최대 수업 시간 체크
  const dailyHours = getDailyHours(courses);
  const maxHoursExceeded = Object.values(dailyHours).some(hours => hours > preferences.maxDailyHours);
  if (maxHoursExceeded) {
    score -= 200;
  }
  
  return Math.max(0, score);
};

// 하루별 수업 시간 계산
const getDailyHours = (courses: Course[]): Record<DayOfWeek, number> => {
  const dailyHours: Record<DayOfWeek, number> = {
    '월': 0, '화': 0, '수': 0, '목': 0, '금': 0
  };
  
  courses.forEach(course => {
    course.timeSlots.forEach(slot => {
      const duration = (timeToMinutes(slot.endTime) - timeToMinutes(slot.startTime)) / 60;
      dailyHours[slot.day] += duration;
    });
  });
  
  return dailyHours;
};

// 조합 생성 (백트래킹)
const generateCombinations = (
  allCourses: Course[],
  selectedCourses: Course[],
  remainingCredits: number,
  maxCourses: number,
  preferences: UserPreferences
): Course[][] => {
  const combinations: Course[][] = [];
  
  if (selectedCourses.length >= maxCourses || remainingCredits <= 0) {
    if (selectedCourses.length > 0) {
      combinations.push([...selectedCourses]);
    }
    return combinations;
  }
  
  const remainingCourses = allCourses.filter(
    course => !selectedCourses.some(selected => selected.id === course.id)
  );
  
  for (const course of remainingCourses) {
    if (course.credit <= remainingCredits) {
      const newSelected = [...selectedCourses, course];
      combinations.push(...generateCombinations(
        allCourses,
        newSelected,
        remainingCredits - course.credit,
        maxCourses,
        preferences
      ));
    }
  }
  
  return combinations;
};

// 최적 시간표 생성
export const generateOptimalTimetable = (
  allCourses: Course[],
  preferences: UserPreferences,
  targetCredits: number = 15,
  maxCourses: number = 6
): GeneratedTimetable[] => {
  console.log('시간표 생성 시작...');
  
  // 가능한 모든 조합 생성
  const combinations = generateCombinations(
    allCourses,
    [],
    targetCredits,
    maxCourses,
    preferences
  );
  
  console.log(`총 ${combinations.length}개의 조합 생성됨`);
  
  // 각 조합에 대해 점수 계산
  const scoredTimetables: GeneratedTimetable[] = combinations.map((courses, index) => {
    const conflicts = checkConflicts(courses);
    const score = calculateTimetableScore(courses, preferences);
    
    return {
      id: `timetable_${index}`,
      courses,
      score,
      conflicts
    };
  });
  
  // 충돌이 없는 시간표만 필터링
  const validTimetables = scoredTimetables.filter(t => t.conflicts.length === 0);
  
  // 점수순으로 정렬
  validTimetables.sort((a, b) => b.score - a.score);
  
  console.log(`유효한 시간표 ${validTimetables.length}개 생성됨`);
  
  return validTimetables.slice(0, 10); // 상위 10개만 반환
};

// 시간표를 테이블 형태로 변환
export const convertToTimetableGrid = (courses: Course[]): TimetableCell[][] => {
  const days: DayOfWeek[] = ['월', '화', '수', '목', '금'];
  const timeSlots = [
    '09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00'
  ];
  
  const grid: TimetableCell[][] = [];
  
  // 7x5 그리드 초기화 (7개 시간대 x 5개 요일)
  for (let i = 0; i < timeSlots.length; i++) {
    grid[i] = [];
    for (let j = 0; j < days.length; j++) {
      grid[i][j] = null as any;
    }
  }
  
  // 각 과목의 시간 정보를 그리드에 배치
  courses.forEach(course => {
    course.timeSlots.forEach(slot => {
      const dayIndex = days.indexOf(slot.day);
      const startTimeIndex = timeSlots.indexOf(slot.startTime);
      
      if (dayIndex !== -1 && startTimeIndex !== -1) {
        grid[startTimeIndex][dayIndex] = {
          course,
          timeSlot: slot
        };
      }
    });
  });
  
  return grid;
};


