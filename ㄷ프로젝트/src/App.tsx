import React, { useState, useEffect } from 'react';
import { Course, GeneratedTimetable, UserPreferences } from './types';
import { getMockCourses } from './services/api';
import { generateOptimalTimetable } from './services/timetableOptimizer';
import CourseList from './components/CourseList';
import PreferencesPanel from './components/PreferencesPanel';
import TimetableDisplay from './components/TimetableDisplay';
import TimetableList from './components/TimetableList';
import { Calendar, Settings, BookOpen, Zap } from 'lucide-react';

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [generatedTimetables, setGeneratedTimetables] = useState<GeneratedTimetable[]>([]);
  const [selectedTimetable, setSelectedTimetable] = useState<GeneratedTimetable | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferredStartTime: '09:00',
    preferredEndTime: '18:00',
    maxDailyHours: 8,
    preferMorningClasses: true,
    preferAfternoonClasses: false,
    avoidLunchTime: true
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'courses' | 'preferences' | 'timetables'>('courses');

  // 초기 데이터 로드
  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      // 실제 API 호출 대신 목업 데이터 사용
      const mockCourses = getMockCourses();
      setCourses(mockCourses);
    } catch (error) {
      console.error('과목 로드 실패:', error);
    }
  };

  const handleCourseSelection = (course: Course, isSelected: boolean) => {
    if (isSelected) {
      setSelectedCourses(prev => [...prev, course]);
    } else {
      setSelectedCourses(prev => prev.filter(c => c.id !== course.id));
    }
  };

  const generateTimetables = async () => {
    if (selectedCourses.length === 0) {
      alert('최소 하나 이상의 과목을 선택해주세요.');
      return;
    }

    setLoading(true);
    try {
      // 백그라운드에서 시간표 생성
      setTimeout(() => {
        const timetables = generateOptimalTimetable(selectedCourses, preferences);
        setGeneratedTimetables(timetables);
        if (timetables.length > 0) {
          setSelectedTimetable(timetables[0]);
        }
        setLoading(false);
        setActiveTab('timetables');
      }, 1000);
    } catch (error) {
      console.error('시간표 생성 실패:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            <Zap className="inline-block mr-3 text-yellow-500" />
            스마트 시간표 생성기
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            수강신청 내역을 분석하여 최적의 시간표를 자동으로 생성합니다
          </p>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-6">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('courses')}
              className={`flex items-center px-6 py-3 font-medium transition-colors ${
                activeTab === 'courses'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <BookOpen className="mr-2" size={20} />
              과목 선택
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex items-center px-6 py-3 font-medium transition-colors ${
                activeTab === 'preferences'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Settings className="mr-2" size={20} />
              설정
            </button>
            <button
              onClick={() => setActiveTab('timetables')}
              className={`flex items-center px-6 py-3 font-medium transition-colors ${
                activeTab === 'timetables'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Calendar className="mr-2" size={20} />
              시간표 ({generatedTimetables.length})
            </button>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측 패널 */}
          <div className="lg:col-span-1">
            {activeTab === 'courses' && (
              <CourseList
                courses={courses}
                selectedCourses={selectedCourses}
                onCourseSelection={handleCourseSelection}
              />
            )}
            
            {activeTab === 'preferences' && (
              <PreferencesPanel
                preferences={preferences}
                onPreferencesChange={setPreferences}
              />
            )}
          </div>

          {/* 우측 패널 */}
          <div className="lg:col-span-2">
            {activeTab === 'courses' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  선택된 과목 ({selectedCourses.length}개)
                </h3>
                <div className="space-y-2 mb-6">
                  {selectedCourses.map(course => (
                    <div key={course.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {course.name}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                          ({course.code}) - {course.credit}학점
                        </span>
                      </div>
                      <span className="text-sm text-blue-600 dark:text-blue-400">
                        우선순위: {course.priority}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={generateTimetables}
                  disabled={selectedCourses.length === 0 || loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      시간표 생성 중...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2" size={20} />
                      최적 시간표 생성
                    </>
                  )}
                </button>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  시간표 생성 설정
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  원하는 시간표 조건을 설정하면 더욱 최적화된 시간표를 생성할 수 있습니다.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    💡 팁
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• 아침 수업을 선호하면 우선순위가 높아집니다</li>
                    <li>• 점심시간 회피 옵션으로 12-13시 수업을 피할 수 있습니다</li>
                    <li>• 하루 최대 수업시간을 설정하여 과부하를 방지할 수 있습니다</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'timetables' && (
              <div className="space-y-6">
                {generatedTimetables.length > 0 ? (
                  <>
                    <TimetableList
                      timetables={generatedTimetables}
                      selectedTimetable={selectedTimetable}
                      onTimetableSelect={setSelectedTimetable}
                    />
                    {selectedTimetable && (
                      <TimetableDisplay timetable={selectedTimetable} />
                    )}
                  </>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
                    <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
                      생성된 시간표가 없습니다
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500">
                      과목을 선택하고 시간표를 생성해보세요.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


