import { useState, useEffect } from 'react';
import { ObservatoryMap } from '@/components/ObservatoryMap';
import { WeatherCalendar } from '@/components/WeatherCalendar';
import { TimeSlotPicker } from '@/components/TimeSlotPicker';
import { EquipmentList } from '@/components/EquipmentList';
import { BookingForm } from '@/components/BookingForm';
import { useBookingStore } from '@/stores/bookingStore';
import { api } from '@/services/api';
import type { ObservationPoint, Equipment, WeatherData } from '@/types';
import { formatDate } from '@/utils/date';
import { Sparkles, Info } from 'lucide-react';

export default function Home() {
  const {
    selectedDate,
    selectedTimeSlot,
    selectedPoint,
    selectedEquipment,
    setSelectedDate,
    setSelectedTimeSlot,
    setSelectedPoint,
    addEquipment,
    removeEquipment,
    updateEquipmentQuantity,
    resetBooking,
  } = useBookingStore();

  const [observationPoints, setObservationPoints] = useState<ObservationPoint[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [weatherData, setWeatherData] = useState<Record<string, WeatherData>>({});
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [points, eq, weather, slots] = await Promise.all([
          api.getObservationPoints(),
          api.getEquipment(),
          api.getWeatherCalendar(),
          api.getTimeSlots(),
        ]);
        setObservationPoints(points);
        setEquipment(eq);
        setWeatherData(weather);
        setTimeSlots(slots);
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (weatherData[selectedDate]) {
      setCurrentWeather(weatherData[selectedDate]);
    }
  }, [selectedDate, weatherData]);

  useEffect(() => {
    if (selectedDate && selectedTimeSlot) {
      const loadAvailability = async () => {
        try {
          const [points, eq] = await Promise.all([
            api.getObservationPoints(selectedDate, selectedTimeSlot),
            api.getEquipment(selectedDate, selectedTimeSlot),
          ]);
          setObservationPoints(points);
          setEquipment(eq);
        } catch (error) {
          console.error('加载可用数据失败:', error);
        }
      };
      loadAvailability();
    }
  }, [selectedDate, selectedTimeSlot]);

  const handlePointSelect = (point: ObservationPoint) => {
    if (point.status === 'maintenance' || point.isBooked) return;
    setSelectedPoint(point);
  };

  const handleBookingSuccess = () => {
    if (selectedDate && selectedTimeSlot) {
      api.getObservationPoints(selectedDate, selectedTimeSlot).then(setObservationPoints);
      api.getEquipment(selectedDate, selectedTimeSlot).then(setEquipment);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cosmos-500/30 border-t-cosmos-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">加载中...</p>
        </div>
      </div>
    );
  }

  const getSuitabilityStyle = (suitability?: string) => {
    switch (suitability) {
      case 'excellent':
        return 'text-starlight-400 bg-starlight-500/10 border-starlight-500/30';
      case 'good':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'fair':
        return 'text-cosmos-400 bg-cosmos-500/10 border-cosmos-500/30';
      case 'poor':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-slate-400';
    }
  };

  const getSuitabilityLabel = (suitability?: string) => {
    switch (suitability) {
      case 'excellent': return '观星极佳';
      case 'good': return '观星良好';
      case 'fair': return '观星一般';
      case 'poor': return '观星较差';
      default: return '未知';
    }
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cosmos-500/10 border border-cosmos-500/30 text-cosmos-300 text-sm mb-4">
          <Sparkles className="w-4 h-4" />
          探索星空的奥秘
        </div>
        <h1 className="font-display text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cosmos-200 via-starlight-200 to-cosmos-200 bg-clip-text text-transparent mb-3">
          星空天文台预约
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          选择您心仪的观测点位和时段，开启一场难忘的星空之旅
        </p>
      </div>

      {currentWeather && (
        <div className={`mb-6 p-4 rounded-2xl border ${getSuitabilityStyle(currentWeather.suitability)} flex items-center justify-between flex-wrap gap-4`}>
          <div className="flex items-center gap-4">
            <Info className="w-5 h-5" />
            <div>
              <span className="font-medium">{formatDate(selectedDate)}</span>
              <span className="mx-2 opacity-50">·</span>
              <span className="font-semibold">{getSuitabilityLabel(currentWeather.suitability)}</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="opacity-60">天气：</span>
              <span className="font-medium">{currentWeather.condition}</span>
            </div>
            <div>
              <span className="opacity-60">能见度：</span>
              <span className="font-medium">{currentWeather.visibility}</span>
            </div>
            <div>
              <span className="opacity-60">气温：</span>
              <span className="font-medium">{currentWeather.temperature}°C</span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ObservatoryMap
            points={observationPoints}
            selectedPointId={selectedPoint?.id}
            onPointSelect={handlePointSelect}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WeatherCalendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              weatherData={weatherData}
            />
            <TimeSlotPicker
              timeSlots={timeSlots}
              selectedSlot={selectedTimeSlot}
              onSlotSelect={setSelectedTimeSlot}
            />
          </div>
        </div>

        <div className="space-y-6">
          <EquipmentList
            equipment={equipment}
            selectedItems={selectedEquipment}
            onAdd={addEquipment}
            onRemove={removeEquipment}
            onUpdateQuantity={updateEquipmentQuantity}
          />
          <BookingForm onSuccess={handleBookingSuccess} />
        </div>
      </div>
    </div>
  );
}
