import { useState, useEffect } from 'react';
import { DashboardCards } from '@/components/admin/DashboardCards';
import { EquipmentManager } from '@/components/admin/EquipmentManager';
import { SeasonPriceManager } from '@/components/admin/SeasonPriceManager';
import { BookingList } from '@/components/admin/BookingList';
import { api } from '@/services/api';
import type { DashboardStats, Equipment, SeasonPrice, Booking } from '@/types';
import { Settings2 } from 'lucide-react';

export default function Admin() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [seasonPrices, setSeasonPrices] = useState<SeasonPrice[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, eqData, spData, bookingData] = await Promise.all([
        api.getDashboardStats(),
        api.getEquipment(),
        api.getSeasonPrices(),
        api.getBookings(),
      ]);
      setStats(statsData);
      setEquipment(eqData);
      setSeasonPrices(spData);
      setBookings(bookingData);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddEquipment = async (data: { name: string; category: string; total: number; price: number }) => {
    try {
      await api.addEquipment(data);
      const updated = await api.getEquipment();
      setEquipment(updated);
    } catch (error) {
      console.error('添加设备失败:', error);
    }
  };

  const handleUpdateEquipment = async (id: string, data: Partial<Equipment>) => {
    try {
      await api.updateEquipment(id, data);
      const updated = await api.getEquipment();
      setEquipment(updated);
    } catch (error) {
      console.error('更新设备失败:', error);
    }
  };

  const handleUpdateSeasonPrice = async (id: string, data: Partial<SeasonPrice>) => {
    try {
      await api.updateSeasonPrice(id, data);
      const updated = await api.getSeasonPrices();
      setSeasonPrices(updated);
    } catch (error) {
      console.error('更新季节价格失败:', error);
    }
  };

  const handleCancelBooking = async (id: string) => {
    try {
      await api.cancelBooking(id);
      const [updatedBookings, updatedStats] = await Promise.all([
        api.getBookings(),
        api.getDashboardStats(),
      ]);
      setBookings(updatedBookings);
      setStats(updatedStats);
    } catch (error) {
      console.error('取消预约失败:', error);
    }
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings2 className="w-7 h-7 text-cosmos-400" />
          <h1 className="font-display text-3xl font-bold text-white">
            管理中心
          </h1>
        </div>
        <p className="text-slate-400">
          实时监控天文台运营数据，管理设备与定价
        </p>
      </div>

      <div className="mb-8">
        <h2 className="font-display text-xl font-semibold text-white mb-4">数据概览</h2>
        <DashboardCards stats={stats} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="font-display text-xl font-semibold text-white mb-4">设备管理</h2>
          <EquipmentManager
            equipment={equipment}
            onAdd={handleAddEquipment}
            onUpdate={handleUpdateEquipment}
          />
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-white mb-4">季节定价</h2>
          <SeasonPriceManager
            seasonPrices={seasonPrices}
            onUpdate={handleUpdateSeasonPrice}
          />
        </div>
      </div>

      <div>
        <h2 className="font-display text-xl font-semibold text-white mb-4">预约管理</h2>
        <BookingList
          bookings={bookings}
          onCancel={handleCancelBooking}
          loading={loading}
          onRefresh={loadData}
        />
      </div>
    </div>
  );
}
