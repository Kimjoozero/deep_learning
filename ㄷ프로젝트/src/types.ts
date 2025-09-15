// 수강 과목 정보 타입
export interface Course {
  id: string;
  name: string;
  code: string;
  professor: string;
  credit: number;
  timeSlots: TimeSlot[];
  priority: number; // 우선순위 (1-10)
  isRequired: boolean; // 필수 과목 여부
}

// 시간 정보 타입
export interface TimeSlot {
  day: DayOfWeek;
  startTime: string; // "09:00" 형태
  endTime: string;   // "10:30" 형태
  room: string;
}

// 요일 타입
export type DayOfWeek = '월' | '화' | '수' | '목' | '금';

// 시간표 셀 타입
export interface TimetableCell {
  course: Course;
  timeSlot: TimeSlot;
}

// 생성된 시간표 타입
export interface GeneratedTimetable {
  id: string;
  courses: Course[];
  score: number; // 최적화 점수
  conflicts: Conflict[];
}

// 시간 충돌 타입
export interface Conflict {
  type: 'time' | 'room';
  courses: Course[];
  timeSlot: TimeSlot;
}

// 사용자 설정 타입
export interface UserPreferences {
  preferredStartTime: string; // 선호하는 시작 시간
  preferredEndTime: string;   // 선호하는 종료 시간
  maxDailyHours: number;      // 하루 최대 수업 시간
  preferMorningClasses: boolean;
  preferAfternoonClasses: boolean;
  avoidLunchTime: boolean;    // 점심시간 피하기
}


