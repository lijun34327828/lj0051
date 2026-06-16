const API_BASE_URL = 'http://localhost:8811/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: '请求失败' }));
    throw new Error(error.error || '请求失败');
  }

  return response.json();
}

import type {
  ObservationPoint,
  Equipment,
  WeatherData,
  Booking,
  SeasonPrice,
  DashboardStats
} from '@/types';

export const api = {
  getObservationPoints: (date?: string, timeSlot?: string): Promise<ObservationPoint[]> => {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    if (timeSlot) params.set('timeSlot', timeSlot);
    const query = params.toString() ? `?${params.toString()}` : '';
    return request<ObservationPoint[]>(`/observation-points${query}`);
  },

  updateObservationPoint: (id: string, data: Partial<ObservationPoint>): Promise<{ message: string; point: ObservationPoint }> => {
    return request(`/observation-points/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getEquipment: (date?: string, timeSlot?: string): Promise<Equipment[]> => {
    const params = new URLSearchParams();
    if (date) params.set('date', date);
    if (timeSlot) params.set('timeSlot', timeSlot);
    const query = params.toString() ? `?${params.toString()}` : '';
    return request<Equipment[]>(`/equipment${query}`);
  },

  addEquipment: (data: { name: string; category: string; total: number; price: number }) => {
    return request('/equipment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateEquipment: (id: string, data: Partial<Equipment>) => {
    return request(`/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getWeather: (date?: string): Promise<WeatherData | Record<string, WeatherData>> => {
    const query = date ? `?date=${date}` : '';
    return request(`/weather${query}`);
  },

  getWeatherCalendar: (month?: string): Promise<Record<string, WeatherData>> => {
    const query = month ? `?month=${month}` : '';
    return request<Record<string, WeatherData>>(`/weather/calendar${query}`);
  },

  getTimeSlots: (): Promise<string[]> => {
    return request<string[]>('/time-slots');
  },

  getSeasonPrices: (): Promise<SeasonPrice[]> => {
    return request<SeasonPrice[]>('/season-prices');
  },

  updateSeasonPrice: (id: string, data: Partial<SeasonPrice>) => {
    return request(`/season-prices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getBookings: (params?: { date?: string; status?: string; phone?: string }): Promise<Booking[]> => {
    const searchParams = new URLSearchParams();
    if (params?.date) searchParams.set('date', params.date);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.phone) searchParams.set('phone', params.phone);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return request<Booking[]>(`/bookings${query}`);
  },

  getBooking: (id: string): Promise<Booking> => {
    return request<Booking>(`/bookings/${id}`);
  },

  createBooking: (data: {
    date: string;
    timeSlot: string;
    pointId: string;
    userName: string;
    phone: string;
    equipment: { id: string; quantity: number }[];
  }): Promise<{ message: string; booking: Booking }> => {
    return request('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  cancelBooking: (id: string): Promise<{ message: string; booking: Booking }> => {
    return request(`/bookings/${id}`, {
      method: 'DELETE',
    });
  },

  getDashboardStats: (): Promise<DashboardStats> => {
    return request<DashboardStats>('/stats/dashboard');
  },

  calculatePrice: (date: string, pointId: string): Promise<{
    date: string;
    pointId: string;
    season: string;
    basePrice: number;
    currency: string;
  }> => {
    return request(`/price/calculate?date=${date}&pointId=${pointId}`);
  },
};
