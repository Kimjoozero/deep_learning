import React from 'react';
import { UserPreferences } from '../types';
import { Clock, Sun, Moon, Coffee, AlertTriangle } from 'lucide-react';

interface PreferencesPanelProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
}

const PreferencesPanel: React.FC<PreferencesPanelProps> = ({
  preferences,
  onPreferencesChange
}) => {
  const updatePreference = (key: keyof UserPreferences, value: any) => {
    onPreferencesChange({
      ...preferences,
      [key]: value
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          <Clock className="inline-block mr-2" size={24} />
          시간표 설정
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          원하는 시간표 조건을 설정하세요
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* 선호 시간대 */}
        <div>
          <h4 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center">
            <Sun className="mr-2 text-yellow-500" size={18} />
            선호 시간대
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="preferMorning"
                checked={preferences.preferMorningClasses}
                onChange={(e) => updatePreference('preferMorningClasses', e.target.checked)}
                className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="preferMorning" className="text-sm text-gray-600 dark:text-gray-400">
                아침 수업 선호 (09:00-12:00)
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="preferAfternoon"
                checked={preferences.preferAfternoonClasses}
                onChange={(e) => updatePreference('preferAfternoonClasses', e.target.checked)}
                className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="preferAfternoon" className="text-sm text-gray-600 dark:text-gray-400">
                오후 수업 선호 (13:00-18:00)
              </label>
            </div>
          </div>
        </div>

        {/* 점심시간 회피 */}
        <div>
          <h4 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center">
            <Coffee className="mr-2 text-orange-500" size={18} />
            점심시간 설정
          </h4>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="avoidLunch"
              checked={preferences.avoidLunchTime}
              onChange={(e) => updatePreference('avoidLunchTime', e.target.checked)}
              className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="avoidLunch" className="text-sm text-gray-600 dark:text-gray-400">
              점심시간(12:00-13:00) 수업 피하기
            </label>
          </div>
        </div>

        {/* 하루 최대 수업시간 */}
        <div>
          <h4 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center">
            <AlertTriangle className="mr-2 text-red-500" size={18} />
            수업 시간 제한
          </h4>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              하루 최대 수업 시간
            </label>
            <select
              value={preferences.maxDailyHours}
              onChange={(e) => updatePreference('maxDailyHours', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value={6}>6시간</option>
              <option value={7}>7시간</option>
              <option value={8}>8시간</option>
              <option value={9}>9시간</option>
              <option value={10}>10시간</option>
            </select>
          </div>
        </div>

        {/* 시간 범위 */}
        <div>
          <h4 className="font-medium text-gray-800 dark:text-white mb-3 flex items-center">
            <Clock className="mr-2 text-blue-500" size={18} />
            시간 범위
          </h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                시작 시간
              </label>
              <select
                value={preferences.preferredStartTime}
                onChange={(e) => updatePreference('preferredStartTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="08:00">08:00</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                종료 시간
              </label>
              <select
                value={preferences.preferredEndTime}
                onChange={(e) => updatePreference('preferredEndTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="17:00">17:00</option>
                <option value="18:00">18:00</option>
                <option value="19:00">19:00</option>
                <option value="20:00">20:00</option>
              </select>
            </div>
          </div>
        </div>

        {/* 설정 요약 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
            현재 설정 요약
          </h5>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• 하루 최대 {preferences.maxDailyHours}시간 수업</li>
            <li>• {preferences.preferMorningClasses ? '아침 수업' : '오후 수업'} 선호</li>
            <li>• {preferences.avoidLunchTime ? '점심시간 회피' : '점심시간 허용'}</li>
            <li>• 수업 시간: {preferences.preferredStartTime} ~ {preferences.preferredEndTime}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PreferencesPanel;


