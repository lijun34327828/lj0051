import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Cloud, Sun, CloudRain, CloudSun } from 'lucide-react';
import { getMonthDays, isSameDay, getSuitabilityColor, getSuitabilityBg, getSuitabilityLabel } from '@/utils/date';
import type { WeatherData } from '@/types';

interface WeatherCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  weatherData: Record<string, WeatherData>;
}

export function WeatherCalendar({ selectedDate, onDateSelect, weatherData }: WeatherCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const date = new Date(selectedDate);
    return { year: date.getFullYear(), month: date.getMonth() };
  });

  const days = getMonthDays(currentMonth.year, currentMonth.month);
  const today = new Date();

  const prevMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = prev.month - 1;
      if (newMonth < 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { ...prev, month: newMonth };
    });
  };

  const nextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = prev.month + 1;
      if (newMonth > 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { ...prev, month: newMonth };
    });
  };

  const getWeatherIcon = (suitability: string) => {
    switch (suitability) {
      case 'excellent':
        return <Sun className="w-4 h-4 text-starlight-400" />;
      case 'good':
        return <CloudSun className="w-4 h-4 text-cosmos-300" />;
      case 'fair':
        return <Cloud className="w-4 h-4 text-slate-400" />;
      case 'poor':
        return <CloudRain className="w-4 h-4 text-slate-500" />;
      default:
        return null;
    }
  };

  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  return (
    <div className="rounded-2xl border border-cosmos-800/50 bg-slate-800/40 backdrop-blur-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-display text-lg font-semibold text-white">
          {currentMonth.year}年 {monthNames[currentMonth.month]}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((day, index) => (
          <div
            key={day}
            className={`text-center text-xs font-medium py-2 ${
              index === 0 || index === 6 ? 'text-red-400/70' : 'text-slate-400'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const dateStr = date.toISOString().split('T')[0];
          const weather = weatherData[dateStr];
          const isCurrentMonth = date.getMonth() === currentMonth.month;
          const isSelected = selectedDate === dateStr;
          const isToday = isSameDay(date, today);
          const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());

          return (
            <button
              key={index}
              disabled={!isCurrentMonth || isPast || !weather}
              onClick={() => isCurrentMonth && !isPast && weather && onDateSelect(dateStr)}
              className={`relative p-2 rounded-lg text-center transition-all duration-200 ${
                !isCurrentMonth
                  ? 'text-slate-600'
                  : isPast
                  ? 'text-slate-600 cursor-not-allowed'
                  : isSelected
                  ? `ring-2 ring-cosmos-400 bg-cosmos-600/30 ${getSuitabilityBg(weather?.suitability || '')}`
                  : weather
                  ? 'hover:bg-slate-700/50 cursor-pointer'
                  : 'text-slate-600'
              }`}
            >
              <div className={`text-sm font-medium ${
                isSelected ? 'text-white' :
                !isCurrentMonth || isPast ? 'text-slate-600' :
                'text-slate-300'
              }`}>
                {date.getDate()}
              </div>
              
              {weather && isCurrentMonth && !isPast && (
                <div className="mt-1">
                  {getWeatherIcon(weather.suitability)}
                </div>
              )}

              {isToday && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-starlight-400"></div>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-starlight-400/30 border border-starlight-400/50"></span>
          <span className="text-slate-400">极佳</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500/50"></span>
          <span className="text-slate-400">良好</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-cosmos-500/30 border border-cosmos-500/50"></span>
          <span className="text-slate-400">一般</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/50"></span>
          <span className="text-slate-400">较差</span>
        </div>
      </div>
    </div>
  );
}
