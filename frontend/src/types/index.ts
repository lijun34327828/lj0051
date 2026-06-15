export interface ObservationPoint {
  id: string;
  name: string;
  type: 'telescope' | 'indoor';
  x: number;
  y: number;
  status: 'available' | 'maintenance';
  isBooked?: boolean;
  isAvailable?: boolean;
}

export interface Equipment {
  id: string;
  name: string;
  category: 'telescope' | 'filter' | 'binocular' | 'accessory';
  total: number;
  available?: number;
  price: number;
  status: 'active' | 'inactive';
}

export interface WeatherData {
  date: string;
  condition: string;
  visibility: string;
  suitability: 'excellent' | 'good' | 'fair' | 'poor';
  temperature: number;
  humidity: number;
  windSpeed: number;
}

export interface Booking {
  id: string;
  date: string;
  timeSlot: string;
  pointId: string;
  userName: string;
  phone: string;
  equipment: { id: string; quantity: number }[];
  totalPrice: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface SeasonPrice {
  id: string;
  name: string;
  months: number[];
  basePrice: number;
  pointMultiplier: number;
}

export interface DashboardStats {
  today: {
    date: string;
    bookingCount: number;
    vacantPoints: number;
    totalPoints: number;
  };
  overall: {
    totalBookings: number;
    totalRevenue: number;
    totalEquipment: number;
    totalPoints: number;
  };
  recentBookings: Booking[];
}

export interface BookingFormData {
  userName: string;
  phone: string;
}

export type EquipmentCategory = 'all' | 'telescope' | 'filter' | 'binocular' | 'accessory';

export const categoryLabels: Record<EquipmentCategory, string> = {
  all: '全部',
  telescope: '望远镜',
  filter: '滤镜',
  binocular: '双筒镜',
  accessory: '配件'
};
