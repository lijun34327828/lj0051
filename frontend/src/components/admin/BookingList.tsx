import { Calendar, MapPin, Clock, User, Phone, Package, XCircle, RefreshCw } from 'lucide-react';
import type { Booking } from '@/types';
import { formatDate, formatPrice } from '@/utils/date';

interface BookingListProps {
  bookings: Booking[];
  onCancel?: (id: string) => void;
  loading?: boolean;
  onRefresh?: () => void;
}

export function BookingList({ bookings, onCancel, loading = false, onRefresh }: BookingListProps) {
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

  return (
    <div className="rounded-2xl border border-cosmos-800/50 bg-slate-800/40 backdrop-blur-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cosmos-400" />
          <h3 className="font-display text-lg font-semibold text-white">
            预约记录
          </h3>
          <span className="text-xs text-slate-500">共 {bookings.length} 条</span>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {loading ? (
          <div className="py-8 text-center text-slate-500">加载中...</div>
        ) : bookings.length === 0 ? (
          <div className="py-8 text-center text-slate-500">暂无预约记录</div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="p-4 rounded-xl border border-slate-700/50 bg-slate-700/20 hover:bg-slate-700/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-white font-medium">{booking.userName}</span>
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {booking.phone}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-display font-bold text-starlight-400">
                    {formatPrice(booking.totalPrice)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(booking.createdAt).toLocaleString('zh-CN')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-cosmos-400" />
                  <span className="text-xs">{formatDate(booking.date)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-cosmos-400" />
                  <span className="text-xs">{booking.timeSlot}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-cosmos-400" />
                  <span className="text-xs">{booking.pointId}</span>
                </div>
              </div>

              {booking.equipment.length > 0 && (
                <div className="pt-3 border-t border-slate-700/50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                    <Package className="w-3.5 h-3.5 text-cosmos-400" />
                    租赁设备
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {booking.equipment.map((eq, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-0.5 rounded-md bg-slate-600/50 text-slate-300"
                      >
                        {eq.id} × {eq.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {booking.status === 'confirmed' && onCancel && (
                <div className="mt-3 pt-3 border-t border-slate-700/50">
                  <button
                    onClick={() => onCancel(booking.id)}
                    className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    取消预约
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
