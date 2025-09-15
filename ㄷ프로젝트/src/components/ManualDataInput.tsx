import React, { useState } from 'react';
import { Course } from '../types';
import { Plus, Trash2, Save, Upload } from 'lucide-react';

interface ManualDataInputProps {
  onCoursesUpdate: (courses: Course[]) => void;
  initialCourses?: Course[];
}

const ManualDataInput: React.FC<ManualDataInputProps> = ({
  onCoursesUpdate,
  initialCourses = []
}) => {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    name: '',
    code: '',
    professor: '',
    credit: 3,
    priority: 5,
    isRequired: false,
    timeSlots: []
  });
  const [newTimeSlot, setNewTimeSlot] = useState({
    day: '월' as '월' | '화' | '수' | '목' | '금',
    startTime: '09:00',
    endTime: '10:30',
    room: ''
  });

  const days = ['월', '화', '수', '목', '금'];
  const timeOptions = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00'
  ];

  const addTimeSlot = () => {
    if (newTimeSlot.room.trim()) {
      setNewCourse(prev => ({
        ...prev,
        timeSlots: [...(prev.timeSlots || []), { ...newTimeSlot }]
      }));
      setNewTimeSlot({
        day: '월',
        startTime: '09:00',
        endTime: '10:30',
        room: ''
      });
    }
  };

  const removeTimeSlot = (index: number) => {
    setNewCourse(prev => ({
      ...prev,
      timeSlots: prev.timeSlots?.filter((_, i) => i !== index) || []
    }));
  };

  const addCourse = () => {
    if (newCourse.name && newCourse.code && newCourse.professor && newCourse.timeSlots?.length) {
      const course: Course = {
        id: newCourse.code,
        name: newCourse.name,
        code: newCourse.code,
        professor: newCourse.professor,
        credit: newCourse.credit || 3,
        priority: newCourse.priority || 5,
        isRequired: newCourse.isRequired || false,
        timeSlots: newCourse.timeSlots
      };

      const updatedCourses = [...courses, course];
      setCourses(updatedCourses);
      onCoursesUpdate(updatedCourses);

      // 폼 초기화
      setNewCourse({
        name: '',
        code: '',
        professor: '',
        credit: 3,
        priority: 5,
        isRequired: false,
        timeSlots: []
      });
    }
  };

  const removeCourse = (index: number) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
    onCoursesUpdate(updatedCourses);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(courses, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mju-courses.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedCourses = JSON.parse(e.target?.result as string);
          setCourses(importedCourses);
          onCoursesUpdate(importedCourses);
        } catch (error) {
          alert('파일 형식이 올바르지 않습니다.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          📝 명지대학교 과목 데이터 입력
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={exportData}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="mr-1" size={16} />
            내보내기
          </button>
          <label className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <Upload className="mr-1" size={16} />
            가져오기
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 새 과목 입력 폼 */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-gray-800 dark:text-white mb-4">새 과목 추가</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              과목명 *
            </label>
            <input
              type="text"
              value={newCourse.name || ''}
              onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="예: 자료구조"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              과목코드 *
            </label>
            <input
              type="text"
              value={newCourse.code || ''}
              onChange={(e) => setNewCourse(prev => ({ ...prev, code: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="예: CS101"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              교수명 *
            </label>
            <input
              type="text"
              value={newCourse.professor || ''}
              onChange={(e) => setNewCourse(prev => ({ ...prev, professor: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="예: 김교수"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              학점
            </label>
            <select
              value={newCourse.credit || 3}
              onChange={(e) => setNewCourse(prev => ({ ...prev, credit: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value={1}>1학점</option>
              <option value={2}>2학점</option>
              <option value={3}>3학점</option>
              <option value={4}>4학점</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              우선순위
            </label>
            <select
              value={newCourse.priority || 5}
              onChange={(e) => setNewCourse(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {[1,2,3,4,5,6,7,8,9,10].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center pt-6">
            <input
              type="checkbox"
              id="isRequired"
              checked={newCourse.isRequired || false}
              onChange={(e) => setNewCourse(prev => ({ ...prev, isRequired: e.target.checked }))}
              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isRequired" className="text-sm text-gray-700 dark:text-gray-300">
              전공필수 과목
            </label>
          </div>
        </div>

        {/* 시간 정보 추가 */}
        <div className="mb-4">
          <h5 className="font-medium text-gray-800 dark:text-white mb-2">수업 시간</h5>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
            <select
              value={newTimeSlot.day}
              onChange={(e) => setNewTimeSlot(prev => ({ ...prev, day: e.target.value as any }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {days.map(day => (
                <option key={day} value={day}>{day}요일</option>
              ))}
            </select>
            
            <select
              value={newTimeSlot.startTime}
              onChange={(e) => setNewTimeSlot(prev => ({ ...prev, startTime: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            
            <select
              value={newTimeSlot.endTime}
              onChange={(e) => setNewTimeSlot(prev => ({ ...prev, endTime: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            
            <input
              type="text"
              value={newTimeSlot.room}
              onChange={(e) => setNewTimeSlot(prev => ({ ...prev, room: e.target.value }))}
              placeholder="강의실"
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <button
            onClick={addTimeSlot}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="mr-1" size={16} />
            시간 추가
          </button>
        </div>

        {/* 추가된 시간 목록 */}
        {newCourse.timeSlots && newCourse.timeSlots.length > 0 && (
          <div className="mb-4">
            <h5 className="font-medium text-gray-800 dark:text-white mb-2">추가된 시간</h5>
            <div className="space-y-1">
              {newCourse.timeSlots.map((slot, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {slot.day} {slot.startTime}-{slot.endTime} ({slot.room})
                  </span>
                  <button
                    onClick={() => removeTimeSlot(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={addCourse}
          disabled={!newCourse.name || !newCourse.code || !newCourse.professor || !newCourse.timeSlots?.length}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          과목 추가
        </button>
      </div>

      {/* 등록된 과목 목록 */}
      <div>
        <h4 className="font-medium text-gray-800 dark:text-white mb-4">
          등록된 과목 ({courses.length}개)
        </h4>
        {courses.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            등록된 과목이 없습니다.
          </p>
        ) : (
          <div className="space-y-2">
            {courses.map((course, index) => (
              <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800 dark:text-white">
                      {course.name}
                    </span>
                    {course.isRequired && (
                      <span className="ml-2 px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full">
                        필수
                      </span>
                    )}
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      ({course.code}) - {course.professor} - {course.credit}학점
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {course.timeSlots.map((slot, i) => (
                      <span key={i} className="mr-3">
                        {slot.day} {slot.startTime}-{slot.endTime} ({slot.room})
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => removeCourse(index)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManualDataInput;
