import { Course, UserPreferences } from '../types';

// 테스트용 추가 과목 데이터
export const getAdditionalTestCourses = (): Course[] => {
  return [
    {
      id: '6',
      name: '운영체제',
      code: 'CS106',
      professor: '김운영',
      credit: 3,
      priority: 7,
      isRequired: true,
      timeSlots: [
        { day: '월', startTime: '11:00', endTime: '12:30', room: 'F601' },
        { day: '수', startTime: '11:00', endTime: '12:30', room: 'F601' }
      ]
    },
    {
      id: '7',
      name: '컴파일러',
      code: 'CS107',
      professor: '이컴파일',
      credit: 3,
      priority: 6,
      isRequired: false,
      timeSlots: [
        { day: '화', startTime: '14:00', endTime: '15:30', room: 'G701' },
        { day: '목', startTime: '14:00', endTime: '15:30', room: 'G701' }
      ]
    },
    {
      id: '8',
      name: '인공지능',
      code: 'CS108',
      professor: '박인공',
      credit: 3,
      priority: 8,
      isRequired: false,
      timeSlots: [
        { day: '금', startTime: '09:00', endTime: '10:30', room: 'H801' },
        { day: '금', startTime: '11:00', endTime: '12:30', room: 'H801' }
      ]
    }
  ];
};

// 다양한 테스트 설정
export const getTestPreferences = (): UserPreferences[] => {
  return [
    {
      preferredStartTime: '09:00',
      preferredEndTime: '18:00',
      maxDailyHours: 6,
      preferMorningClasses: true,
      preferAfternoonClasses: false,
      avoidLunchTime: true
    },
    {
      preferredStartTime: '10:00',
      preferredEndTime: '19:00',
      maxDailyHours: 8,
      preferMorningClasses: false,
      preferAfternoonClasses: true,
      avoidLunchTime: false
    },
    {
      preferredStartTime: '08:00',
      preferredEndTime: '17:00',
      maxDailyHours: 7,
      preferMorningClasses: true,
      preferAfternoonClasses: true,
      avoidLunchTime: true
    }
  ];
};

// 시간표 생성 성능 테스트
export const runPerformanceTest = () => {
  console.log('🚀 시간표 생성 성능 테스트 시작');
  
  const startTime = performance.now();
  
  // 테스트 실행 (실제 테스트는 App.tsx에서 실행)
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  console.log(`✅ 테스트 완료: ${duration.toFixed(2)}ms`);
  
  return duration;
};


