import axios from 'axios';
import * as cheerio from 'cheerio';
import { Course } from '../types';

// 명지대학교 수강신청 시스템 설정
const MJU_LOGIN_URL = 'https://portal.mju.ac.kr/';
const MJU_COURSE_URL = 'https://portal.mju.ac.kr/sugang/';

interface LoginCredentials {
  studentId: string;
  password: string;
}

interface ScrapingOptions {
  semester: string; // 예: '2024-1'
  department: string; // 예: '컴퓨터공학과'
}

export class MJUScraper {
  private session: any;
  private isLoggedIn: boolean = false;

  constructor() {
    this.session = axios.create({
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
  }

  // 로그인
  async login(credentials: LoginCredentials): Promise<boolean> {
    try {
      // 1단계: 로그인 페이지 접속
      const loginPage = await this.session.get(MJU_LOGIN_URL);
      
      // 2단계: 로그인 폼 제출
      const loginData = {
        userId: credentials.studentId,
        password: credentials.password,
        // 기타 필요한 폼 데이터들
      };

      const loginResponse = await this.session.post(MJU_LOGIN_URL, loginData);
      
      // 로그인 성공 여부 확인
      if (loginResponse.data.includes('로그인 성공') || loginResponse.headers['set-cookie']) {
        this.isLoggedIn = true;
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('로그인 실패:', error);
      return false;
    }
  }

  // 수강신청 과목 목록 스크래핑
  async scrapeCourses(options: ScrapingOptions): Promise<Course[]> {
    if (!this.isLoggedIn) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      // 수강신청 페이지 접속
      const coursePage = await this.session.get(MJU_COURSE_URL, {
        params: {
          semester: options.semester,
          dept: options.department
        }
      });

      const $ = cheerio.load(coursePage.data);
      const courses: Course[] = [];

      // 과목 목록 파싱
      $('.course-row').each((index, element) => {
        const course = this.parseCourseElement($, element);
        if (course) {
          courses.push(course);
        }
      });

      return courses;
    } catch (error) {
      console.error('과목 목록 스크래핑 실패:', error);
      throw error;
    }
  }

  // 개별 과목 요소 파싱
  private parseCourseElement($: any, element: any): Course | null {
    try {
      const code = $(element).find('.course-code').text().trim();
      const name = $(element).find('.course-name').text().trim();
      const professor = $(element).find('.professor').text().trim();
      const credit = parseInt($(element).find('.credit').text().trim());
      const isRequired = $(element).find('.required').text().trim() === '전필';

      // 시간 정보 파싱
      const timeSlots = this.parseTimeSlots($, element);

      return {
        id: code,
        name,
        code,
        professor,
        credit,
        priority: isRequired ? 8 : 5, // 전필이면 높은 우선순위
        isRequired,
        timeSlots
      };
    } catch (error) {
      console.error('과목 파싱 실패:', error);
      return null;
    }
  }

  // 시간 정보 파싱
  private parseTimeSlots($: any, element: any): any[] {
    const timeSlots: any[] = [];
    const timeText = $(element).find('.time').text().trim();

    // 시간 문자열 파싱 예: "월1,2 수3,4"
    const timeRegex = /([월화수목금])(\d+),?(\d*)/g;
    let match;

    while ((match = timeRegex.exec(timeText)) !== null) {
      const day = match[1];
      const startPeriod = parseInt(match[2]);
      const endPeriod = match[3] ? parseInt(match[3]) : startPeriod;

      // 교시를 시간으로 변환
      const startTime = this.periodToTime(startPeriod);
      const endTime = this.periodToTime(endPeriod + 1);
      const room = $(element).find('.room').text().trim();

      timeSlots.push({
        day,
        startTime,
        endTime,
        room
      });
    }

    return timeSlots;
  }

  // 교시를 시간으로 변환
  private periodToTime(period: number): string {
    const timeMap: { [key: number]: string } = {
      1: '09:00',
      2: '10:30',
      3: '12:00',
      4: '13:30',
      5: '15:00',
      6: '16:30',
      7: '18:00'
    };
    return timeMap[period] || '09:00';
  }

  // 로그아웃
  async logout(): Promise<void> {
    try {
      await this.session.post(MJU_LOGIN_URL + '/logout');
      this.isLoggedIn = false;
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  }
}

// 사용 예시
export const mjuScraper = new MJUScraper();

// API 함수들
export const loginToMJU = async (studentId: string, password: string): Promise<boolean> => {
  return await mjuScraper.login({ studentId, password });
};

export const fetchMJUCourses = async (semester: string = '2024-1'): Promise<Course[]> => {
  return await mjuScraper.scrapeCourses({
    semester,
    department: '컴퓨터공학과'
  });
};

export const logoutFromMJU = async (): Promise<void> => {
  await mjuScraper.logout();
};
