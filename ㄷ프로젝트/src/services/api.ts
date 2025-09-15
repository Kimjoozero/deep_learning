import axios from 'axios';
import { Course } from '../types';

// API 기본 설정
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 수강신청 내역 조회 API
export const fetchEnrolledCourses = async (studentId: string): Promise<Course[]> => {
  try {
    const response = await api.get(`/courses/enrolled/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('수강신청 내역 조회 실패:', error);
    throw new Error('수강신청 내역을 불러올 수 없습니다.');
  }
};

// 전체 과목 목록 조회 API
export const fetchAllCourses = async (): Promise<Course[]> => {
  try {
    const response = await api.get('/courses');
    return response.data;
  } catch (error) {
    console.error('과목 목록 조회 실패:', error);
    throw new Error('과목 목록을 불러올 수 없습니다.');
  }
};

// 특정 과목 상세 정보 조회 API
export const fetchCourseDetails = async (courseId: string): Promise<Course> => {
  try {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('과목 상세 정보 조회 실패:', error);
    throw new Error('과목 상세 정보를 불러올 수 없습니다.');
  }
};

// 목업 데이터 (실제 API가 없을 때 사용)
export const getMockCourses = (): Course[] => {
  return [
    {
      id: '1',
      name: '자료구조',
      code: 'CS101',
      professor: '김교수',
      credit: 3,
      priority: 8,
      isRequired: true,
      timeSlots: [
        { day: '월', startTime: '09:00', endTime: '10:30', room: 'A101' },
        { day: '수', startTime: '09:00', endTime: '10:30', room: 'A101' }
      ]
    },
    {
      id: '2',
      name: '알고리즘',
      code: 'CS102',
      professor: '이교수',
      credit: 3,
      priority: 7,
      isRequired: true,
      timeSlots: [
        { day: '화', startTime: '11:00', endTime: '12:30', room: 'B201' },
        { day: '목', startTime: '11:00', endTime: '12:30', room: 'B201' }
      ]
    },
    {
      id: '3',
      name: '데이터베이스',
      code: 'CS103',
      professor: '박교수',
      credit: 3,
      priority: 6,
      isRequired: false,
      timeSlots: [
        { day: '월', startTime: '14:00', endTime: '15:30', room: 'C301' },
        { day: '수', startTime: '14:00', endTime: '15:30', room: 'C301' }
      ]
    },
    {
      id: '4',
      name: '웹프로그래밍',
      code: 'CS104',
      professor: '최교수',
      credit: 3,
      priority: 5,
      isRequired: false,
      timeSlots: [
        { day: '화', startTime: '16:00', endTime: '17:30', room: 'D401' },
        { day: '목', startTime: '16:00', endTime: '17:30', room: 'D401' }
      ]
    },
    {
      id: '5',
      name: '컴퓨터네트워크',
      code: 'CS105',
      professor: '정교수',
      credit: 3,
      priority: 4,
      isRequired: false,
      timeSlots: [
        { day: '금', startTime: '10:00', endTime: '11:30', room: 'E501' },
        { day: '금', startTime: '12:00', endTime: '13:30', room: 'E501' }
      ]
    }
  ];
};


