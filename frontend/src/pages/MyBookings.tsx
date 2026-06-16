import { useState } from 'react';
import { Phone, Search, Calendar, Clock, MapPin, Package, XCircle, Sparkles, User } from 'lucide-react';
import { api } from '@/services/api';
import type { Booking, ObservationPoint, Equipment } from '@/types';
import { formatDate, formatPrice } from '@/utils/date';

export default function MyBookings() {
  const [phone, setPhone] = useState('');
  const [searchedPhone, setSearchedPhone] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [points, setPoints] = useState<ObservationPoint[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            已确认
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
            已取消
          </span>
        );
      default:
        return null;
    }
  };

  const getPointName = (pointId: string) => {
    const point = points.find(p => p.id === pointId);
    return point ? point.name : pointId;
  };

  const getEquipmentName = (eqId: string) => {
    const eq = equipmentList.find(e => e.id === eqId);
    return eq ? eq.name : eqId;
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phone.trim()) return;

    setLoading(true);
    setSearched(true);
    setSearchedPhone(phone.trim());
    try {
      const [bookingData, pointData, eqData] = await Promise.all([
        api.getBookings({ phone: phone.trim() }),
        api.getObservationPoints(),
        api.getEquipment(),
      ]);
      setBookings(bookingData);
      setPoints(pointData);
      setEquipmentList(eqData);
    } catch (error) {
      console.error('查询预约失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    try {
      await api.cancelBooking(id);
      const updated = await api.getBookings({ phone: searchedPhone });
      setBookings(updated);
    } catch (error) {
      console.error('取消预约失败:', error);
    }
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-7 h-7 text-starlight-400" />
          <h1 className="font-display text-3xl font-bold text-white">
            我的预约
          </h1>
        </div>
        <p className="text-slate-400">
          输入预约时使用的手机号，查询您的观测预约记录
        </p>
      </div>

      <form
        onSubmit={handleSearch}
        className="mb-8 rounded-2xl border border-cosmos-800/50 bg-slate-800/40 backdrop-blur-sm p-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入预约手机号"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-700/50 bg-slate-900/60 text-white placeholder-slate-500 focus:outline-none focus:border-cosmos-500 focus:ring-1 focus:ring-cosmos-500/50 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!phone.trim() || loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cosmos-600 to-starlight-600 text-white font-medium flex items-center justify-center gap-2 hover:from-cosmos-500 hover:to-starlight-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? '查询中...' : '查询预约'}
          </button>
        </div>
      </form>

      {searched && (
        <div className="rounded-2xl border border-cosmos-800/50 bg-slate-800/40 backdrop-blur-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cosmos-400" />
              <h3 className="font-display text-lg font-semibold text-white">
                预约记录
              </h3>
              <span className="text-xs text-slate-500">
                手机号 {searchedPhone} · 共 {bookings.length} 条
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="py-12 text-center text-slate-500">加载中...</div>
            ) : bookings.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-800/60 flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-400">未找到该手机号的预约记录</p>
                <p className="text-xs text-slate-600 mt-1">请确认手机号是否正确，或前往首页提交新预约</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-5 rounded-xl border border-slate-700/50 bg-slate-700/20 hover:bg-slate-700/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-white font-medium">{booking.userName}</span>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="text-xs text-slate-500">
                        预约编号：{booking.id}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-display font-bold text-starlight-400">
                        {formatPrice(booking.totalPrice)}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(booking.createdAt).toLocaleString('zh-CN')}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-cosmos-500/15 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-cosmos-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">观测日期</div>
                        <div className="text-slate-200 font-medium">{formatDate(booking.date)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-cosmos-500/15 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-cosmos-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">观测时段</div>
                        <div className="text-slate-200 font-medium">{booking.timeSlot}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-cosmos-500/15 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-cosmos-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">观测点位</div>
                        <div className="text-slate-200 font-medium">{getPointName(booking.pointId)}</div>
                      </div>
                    </div>
                  </div>

                  {booking.equipment.length > 0 && (
                    <div className="pt-4 border-t border-slate-700/50 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                        <Package className="w-4 h-4 text-cosmos-400" />
                        <span>租赁设备</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {booking.equipment.map((eq, idx) => (
                          <span
                            key={idx}
                            className="text-sm px-3 py-1 rounded-lg bg-slate-600/40 text-slate-300 border border-slate-600/50"
                          >
                            {getEquipmentName(eq.id)} × {eq.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {booking.status === 'confirmed' && (
                    <div className="pt-4 border-t border-slate-700/50">
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-500/10"
                      >
                        <XCircle className="w-4 h-4" />
                        取消预约
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
