import React, { useState } from 'react';
import { Course } from '../types';
import { Search, BookOpen, Clock, MapPin, Star } from 'lucide-react';

interface CourseListProps {
  courses: Course[];
  selectedCourses: Course[];
  onCourseSelection: (course: Course, isSelected: boolean) => void;
}

const CourseList: React.FC<CourseListProps> = ({
  courses,
  selectedCourses,
  onCourseSelection
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRequired, setFilterRequired] = useState(false);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.professor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = !filterRequired || course.isRequired;
    
    return matchesSearch && matchesFilter;
  });

  const isSelected = (course: Course) => {
    return selectedCourses.some(selected => selected.id === course.id);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          <BookOpen className="inline-block mr-2" size={24} />
          수강 가능 과목
        </h3>
        
        {/* 검색 및 필터 */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="과목명, 코드, 교수명으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filterRequired}
              onChange={(e) => setFilterRequired(e.target.checked)}
              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              필수 과목만 보기
            </span>
          </label>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {filteredCourses.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            검색 결과가 없습니다.
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCourses.map(course => (
              <div
                key={course.id}
                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                  isSelected(course) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => onCourseSelection(course, !isSelected(course))}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <h4 className="font-medium text-gray-800 dark:text-white">
                        {course.name}
                      </h4>
                      {course.isRequired && (
                        <span className="ml-2 px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full">
                          필수
                        </span>
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {course.code} • {course.professor} • {course.credit}학점
                    </div>
                    
                    <div className="space-y-1">
                      {course.timeSlots.map((slot, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="mr-1" size={12} />
                          <span>{slot.day} {slot.startTime}-{slot.endTime}</span>
                          <MapPin className="ml-2 mr-1" size={12} />
                          <span>{slot.room}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="ml-4 flex flex-col items-end">
                    <div className="flex items-center mb-2">
                      <Star className="mr-1 text-yellow-500" size={14} />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {course.priority}
                      </span>
                    </div>
                    
                    <div className={`w-4 h-4 rounded border-2 ${
                      isSelected(course)
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {isSelected(course) && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          총 {selectedCourses.length}개 과목 선택됨
          <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
            ({selectedCourses.reduce((sum, course) => sum + course.credit, 0)}학점)
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseList;


