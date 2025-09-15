# 명지대학교 자연캠퍼스 컴퓨터공학과 API 연동 가이드

## 🎯 목표
명지대학교의 실제 수강신청 데이터를 받아와서 스마트 시간표 생성기에 연동하는 방법을 안내합니다.

## 🔍 현재 상황 분석

### 명지대학교 시스템 현황
- **포털 시스템**: https://portal.mju.ac.kr/
- **수강신청 시스템**: 내부 시스템으로 운영
- **API 제공**: 공식 API 미제공
- **데이터 접근**: 로그인 후 웹 인터페이스 통해서만 가능

## 🛠 해결 방법

### 방법 1: 웹 스크래핑 (권장)
```typescript
// src/services/mjuScraper.ts 파일 사용
import { loginToMJU, fetchMJUCourses } from './services/mjuScraper';

// 로그인
const isLoggedIn = await loginToMJU('학번', '비밀번호');

// 과목 데이터 가져오기
const courses = await fetchMJUCourses('2024-1');
```

**장점:**
- 실제 데이터 사용 가능
- 자동화 가능
- 실시간 데이터 반영

**주의사항:**
- 학교 이용약관 준수 필요
- 로그인 정보 보안 중요
- 웹페이지 구조 변경 시 수정 필요

### 방법 2: 수동 데이터 입력
```typescript
// ManualDataInput 컴포넌트 사용
<ManualDataInput 
  onCoursesUpdate={setCourses}
  initialCourses={[]}
/>
```

**장점:**
- 안전하고 확실한 방법
- 학교 정책 위반 없음
- 데이터 검증 가능

**단점:**
- 수동 작업 필요
- 시간 소요

### 방법 3: 학교 API 요청
명지대학교 IT부서에 공식 API 개발 요청

**연락처:**
- IT부서: 031-330-6000
- 학사관리팀: 031-330-6100
- 이메일: help@mju.ac.kr

## 📋 실제 구현 단계

### 1단계: 환경 설정
```bash
# 필요한 패키지 설치
npm install cheerio @types/cheerio

# 또는 수동 입력 방식 사용
```

### 2단계: 데이터 수집
```typescript
// 웹 스크래핑 방식
const scraper = new MJUScraper();
await scraper.login({ studentId: '학번', password: '비밀번호' });
const courses = await scraper.scrapeCourses({
  semester: '2024-1',
  department: '컴퓨터공학과'
});

// 수동 입력 방식
// ManualDataInput 컴포넌트에서 과목 정보 입력
```

### 3단계: 데이터 검증
```typescript
// 과목 데이터 유효성 검사
const validateCourse = (course: Course): boolean => {
  return !!(course.name && course.code && course.professor && course.timeSlots.length);
};

// 시간 충돌 검사
const checkConflicts = (courses: Course[]): Conflict[] => {
  // 충돌 검사 로직
};
```

### 4단계: 시간표 생성
```typescript
// 기존 시간표 생성 로직 사용
const timetables = generateOptimalTimetable(courses, preferences);
```

## 🔐 보안 고려사항

### 로그인 정보 보호
```typescript
// 환경변수 사용
const MJU_USERNAME = process.env.MJU_USERNAME;
const MJU_PASSWORD = process.env.MJU_PASSWORD;

// 또는 사용자 입력 방식
const handleLogin = async (credentials: LoginCredentials) => {
  // 로그인 처리
};
```

### 데이터 암호화
```typescript
// 민감한 데이터 암호화
import CryptoJS from 'crypto-js';

const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, 'secret-key').toString();
};
```

## 📊 명지대학교 컴퓨터공학과 과목 정보

### 주요 전공과목 (예시)
- **전공필수**: 자료구조, 알고리즘, 컴퓨터구조, 운영체제, 컴퓨터네트워크
- **전공선택**: 데이터베이스, 웹프로그래밍, 인공지능, 소프트웨어공학, 컴퓨터그래픽스

### 시간표 구조
- **교시**: 1교시(09:00-10:30), 2교시(10:30-12:00), 3교시(12:00-13:30)...
- **요일**: 월, 화, 수, 목, 금
- **강의실**: A동, B동, C동 등

## 🚀 실제 사용 예시

### App.tsx 업데이트
```typescript
import ManualDataInput from './components/ManualDataInput';
import { fetchMJUCourses } from './services/mjuScraper';

function App() {
  const [dataSource, setDataSource] = useState<'manual' | 'scraper'>('manual');
  const [courses, setCourses] = useState<Course[]>([]);

  const handleDataSourceChange = (source: 'manual' | 'scraper') => {
    setDataSource(source);
  };

  return (
    <div>
      {/* 데이터 소스 선택 */}
      <div className="mb-4">
        <button 
          onClick={() => handleDataSourceChange('manual')}
          className={dataSource === 'manual' ? 'bg-blue-600' : 'bg-gray-300'}
        >
          수동 입력
        </button>
        <button 
          onClick={() => handleDataSourceChange('scraper')}
          className={dataSource === 'scraper' ? 'bg-blue-600' : 'bg-gray-300'}
        >
          자동 수집
        </button>
      </div>

      {/* 데이터 입력 방식에 따른 렌더링 */}
      {dataSource === 'manual' ? (
        <ManualDataInput onCoursesUpdate={setCourses} />
      ) : (
        <div>
          {/* 스크래핑 인터페이스 */}
        </div>
      )}
    </div>
  );
}
```

## ⚠️ 주의사항

1. **이용약관 준수**: 학교의 컴퓨터 사용 규정을 반드시 준수
2. **개인정보 보호**: 로그인 정보를 안전하게 관리
3. **데이터 정확성**: 수집된 데이터의 정확성 검증 필요
4. **업데이트**: 학교 시스템 변경 시 코드 업데이트 필요

## 📞 지원 및 문의

- **명지대학교 IT부서**: 031-330-6000
- **컴퓨터공학과 학과사무실**: 031-330-6200
- **프로그램 관련 문의**: GitHub Issues

## 🎯 추천 방법

**초기 단계**: 수동 데이터 입력 방식 사용
**숙련 후**: 웹 스크래핑 방식으로 자동화
**장기적**: 학교 측에 공식 API 개발 요청
