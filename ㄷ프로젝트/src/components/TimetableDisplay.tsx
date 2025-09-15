import React from 'react';
import { GeneratedTimetable } from '../types';
import { convertToTimetableGrid, TimetableCell } from '../services/timetableOptimizer';
import { Clock, MapPin, BookOpen, AlertCircle } from 'lucide-react';

interface TimetableDisplayProps {
  timetable: GeneratedTimetable;
}

const TimetableDisplay: React.FC<TimetableDisplayProps> = ({ timetable }) => {
  const days = ['월', '화', '수', '목', '금'];
  const timeSlots = [
    { time: '09:00', label: '1교시' },
    { time: '10:30', label: '2교시' },
    { time: '12:00', label: '3교시' },
    { time: '13:30', label: '4교시' },
    { time: '15:00', label: '5교시' },
    { time: '16:30', label: '6교시' },
    { time: '18:00', label: '7교시' }
  ];

  const grid = convertToTimetableGrid(timetable.courses);

  const getCourseColor = (courseId: string) => {
    const colors = [
      'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700',
      'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700',
      'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-700',
      'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-700',
      'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 border-pink-200 dark:border-pink-700',
      'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-700'
    ];
    
    const index = timetable.courses.findIndex(course => course.id === courseId);
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            시간표 상세 보기
          </h3>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {timetable.score}점
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              최적화 점수
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <BookOpen className="mr-1" size={16} />
            {timetable.courses.length}개 과목
          </div>
          <div className="flex items-center">
            <Clock className="mr-1" size={16} />
            {timetable.courses.reduce((sum, course) => sum + course.credit, 0)}학점
          </div>
          {timetable.conflicts.length > 0 && (
            <div className="flex items-center text-red-600 dark:text-red-400">
              <AlertCircle className="mr-1" size={16} />
              {timetable.conflicts.length}개 충돌
            </div>
          )}
        </div>
      </div>

      {/* 시간표 그리드 */}
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-20 p-2 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  시간
                </th>
                {days.map(day => (
                  <th
                    key={day}
                    className="w-32 p-3 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700"
                  >
                    {day}요일
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot, rowIndex) => (
                <tr key={timeSlot.time}>
                  <td className="p-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <div>{timeSlot.time}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {timeSlot.label}
                    </div>
                  </td>
                  {days.map((day, colIndex) => {
                    const cell = grid[rowIndex]?.[colIndex];
                    return (
                      <td
                        key={`${timeSlot.time}-${day}`}
                        className="p-2 border border-gray-200 dark:border-gray-700 min-h-[80px]"
                      >
                        {cell ? (
                          <div className={`p-2 rounded border ${getCourseColor(cell.course.id)}`}>
                            <div className="font-medium text-sm mb-1">
                              {cell.course.name}
                            </div>
                            <div className="text-xs opacity-75 mb-1">
                              {cell.course.professor}
                            </div>
                            <div className="flex items-center text-xs opacity-75">
                              <MapPin className="mr-1" size={10} />
                              {cell.timeSlot.room}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                            <div className="text-gray-300 dark:text-gray-600 text-xs">
                              -
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 과목 목록 */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="font-medium text-gray-800 dark:text-white mb-4">
          수강 과목 목록
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {timetable.courses.map(course => (
            <div
              key={course.id}
              className={`p-4 rounded-lg border ${getCourseColor(course.id)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="font-medium mb-1">{course.name}</h5>
                  <div className="text-sm opacity-75 mb-2">
                    {course.code} • {course.professor} • {course.credit}학점
                  </div>
                  <div className="space-y-1">
                    {course.timeSlots.map((slot, index) => (
                      <div key={index} className="text-xs opacity-75 flex items-center">
                        <Clock className="mr-1" size={10} />
                        {slot.day} {slot.startTime}-{slot.endTime}
                        <MapPin className="ml-2 mr-1" size={10} />
                        {slot.room}
                      </div>
                    ))}
                  </div>
                </div>
                {course.isRequired && (
                  <span className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full">
                    필수
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 충돌 정보 */}
      {timetable.conflicts.length > 0 && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-red-50 dark:bg-red-900/20">
          <h4 className="font-medium text-red-800 dark:text-red-200 mb-4 flex items-center">
            <AlertCircle className="mr-2" size={18} />
            시간 충돌 정보
          </h4>
          <div className="space-y-2">
            {timetable.conflicts.map((conflict, index) => (
              <div key={index} className="text-sm text-red-700 dark:text-red-300">
                <strong>{conflict.type === 'time' ? '시간 충돌' : '강의실 충돌'}:</strong>
                {' '}
                {conflict.courses.map(course => course.name).join(', ')}
                {' '}
                ({conflict.timeSlot.day} {conflict.timeSlot.startTime}-{conflict.timeSlot.endTime})
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimetableDisplay;


