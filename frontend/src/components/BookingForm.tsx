import { useState } from 'react';
import { User, Phone, Send, CheckCircle, Calendar, MapPin, Clock, Package } from 'lucide-react';
import { useBookingStore } from '@/stores/bookingStore';
import { formatDate, formatPrice } from '@/utils/date';
import { api } from '@/services/api';

interface BookingFormProps {
  onSuccess?: () => void;
}

export function BookingForm({ onSuccess }: BookingFormProps) {
  const {
    selectedDate,
    selectedTimeSlot,
    selectedPoint,
    selectedEquipment,
    formData,
    setFormData,
    getTotalEquipmentPrice,
    resetBooking,
  } = useBookingStore();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTimeSlot || !selectedPoint) {
      setError('请完成所有选择步骤');
      return;
    }

    if (!formData.userName || !formData.phone) {
      setError('请填写预约信息');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.createBooking({
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        pointId: selectedPoint.id,
        userName: formData.userName,
        phone: formData.phone,
        equipment: selectedEquipment.map(item => ({
          id: item.equipment.id,
          quantity: item.quantity,
        })),
      });

      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '预约失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const basePrice = selectedPoint ? 100 : 0;
  const equipmentPrice = getTotalEquipmentPrice();
  const totalPrice = basePrice + equipmentPrice;

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-500/50 bg-emerald-500/10 backdrop-blur-sm p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="font-display text-xl font-bold text-emerald-300 mb-2">
          预约成功！
        </h3>
        <p className="text-slate-400 mb-4">
          我们已收到您的预约请求，请注意查收确认短信
        </p>
        <div className="bg-slate-800/50 rounded-xl p-4 mb-4 text-left">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-500">观测点位</span>
              <p className="text-white font-medium">{selectedPoint?.name}</p>
            </div>
            <div>
              <span className="text-slate-500">日期</span>
              <p className="text-white font-medium">{formatDate(selectedDate)}</p>
            </div>
            <div>
              <span className="text-slate-500">时段</span>
              <p className="text-white font-medium">{selectedTimeSlot}</p>
            </div>
            <div>
              <span className="text-slate-500">总费用</span>
              <p className="text-starlight-400 font-semibold">{formatPrice(totalPrice)}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => {
            setSuccess(false);
            resetBooking();
          }}
          className="w-full py-3 rounded-xl bg-cosmos-600 hover:bg-cosmos-500 text-white font-medium transition-colors"
        >
          继续预约
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-cosmos-800/50 bg-slate-800/40 backdrop-blur-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Send className="w-5 h-5 text-cosmos-400" />
        <h3 className="font-display text-lg font-semibold text-white">
          预约信息
        </h3>
      </div>

      {selectedDate && selectedTimeSlot && selectedPoint && (
        <div className="bg-slate-700/30 rounded-xl p-4 mb-4">
          <h4 className="text-sm font-medium text-slate-300 mb-3">预约摘要</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="w-4 h-4 text-cosmos-400" />
              <span>{selectedPoint.name}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4 h-4 text-cosmos-400" />
              <span>{formatDate(selectedDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4 text-cosmos-400" />
              <span>{selectedTimeSlot}</span>
            </div>
            {selectedEquipment.length > 0 && (
              <div className="flex items-center gap-2 text-slate-400">
                <Package className="w-4 h-4 text-cosmos-400" />
                <span>{selectedEquipment.length} 件设备</span>
              </div>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-600/50 flex items-center justify-between">
            <span className="text-slate-400 text-sm">预计费用</span>
            <span className="text-xl font-display font-bold text-starlight-400">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">姓名</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={formData.userName}
              onChange={(e) => setFormData({ userName: e.target.value })}
              placeholder="请输入您的姓名"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cosmos-500/50 focus:ring-2 focus:ring-cosmos-500/20 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1.5">手机号</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ phone: e.target.value })}
              placeholder="请输入手机号码"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cosmos-500/50 focus:ring-2 focus:ring-cosmos-500/20 transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !selectedDate || !selectedTimeSlot || !selectedPoint}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cosmos-500 to-starlight-500 text-white font-medium hover:from-cosmos-400 hover:to-starlight-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              提交中...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              提交预约
            </>
          )}
        </button>
      </form>
    </div>
  );
}
