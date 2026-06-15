import { useState } from 'react';
import { Calendar, Edit2, Check, X } from 'lucide-react';
import type { SeasonPrice } from '@/types';
import { formatPrice } from '@/utils/date';

interface SeasonPriceManagerProps {
  seasonPrices: SeasonPrice[];
  onUpdate: (id: string, data: Partial<SeasonPrice>) => void;
}

export function SeasonPriceManager({ seasonPrices, onUpdate }: SeasonPriceManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    basePrice: 0,
    pointMultiplier: 1,
  });

  const handleEdit = (sp: SeasonPrice) => {
    setEditData({
      basePrice: sp.basePrice,
      pointMultiplier: sp.pointMultiplier,
    });
    setEditingId(sp.id);
  };

  const handleSave = (id: string) => {
    onUpdate(id, {
      basePrice: editData.basePrice,
      pointMultiplier: editData.pointMultiplier,
    });
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const getSeasonColor = (index: number) => {
    const colors = [
      'from-green-500 to-emerald-600',
      'from-starlight-500 to-orange-500',
      'from-cosmos-500 to-purple-600',
      'from-blue-500 to-slate-600',
    ];
    return colors[index % colors.length];
  };

  const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  return (
    <div className="rounded-2xl border border-cosmos-800/50 bg-slate-800/40 backdrop-blur-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-cosmos-400" />
        <h3 className="font-display text-lg font-semibold text-white">
          季节定价
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {seasonPrices.map((sp, index) => (
          <div
            key={sp.id}
            className={`relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-700/20 p-4 transition-all hover:border-cosmos-600/50`}
          >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getSeasonColor(index)}`}></div>
            
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-medium text-white">{sp.name}</h4>
              {editingId !== sp.id && (
                <button
                  onClick={() => handleEdit(sp)}
                  className="p-1 rounded hover:bg-slate-600/50 text-slate-400 hover:text-cosmos-400 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="text-xs text-slate-400 mb-3">
              {sp.months.map(m => monthNames[m - 1]).join('、')}
            </div>

            {editingId === sp.id ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500">基础价格</label>
                  <input
                    type="number"
                    value={editData.basePrice}
                    onChange={(e) => setEditData(prev => ({ ...prev, basePrice: parseInt(e.target.value) || 0 }))}
                    className="w-full mt-1 px-3 py-1.5 bg-slate-600/50 border border-slate-500/50 rounded-lg text-white text-sm focus:outline-none focus:border-cosmos-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500">望远镜倍率</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editData.pointMultiplier}
                    onChange={(e) => setEditData(prev => ({ ...prev, pointMultiplier: parseFloat(e.target.value) || 1 }))}
                    className="w-full mt-1 px-3 py-1.5 bg-slate-600/50 border border-slate-500/50 rounded-lg text-white text-sm focus:outline-none focus:border-cosmos-500/50"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(sp.id)}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    保存
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-slate-600 hover:bg-slate-500 text-white text-sm transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    取消
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-display font-bold text-starlight-400">
                    {formatPrice(sp.basePrice)}
                  </span>
                  <span className="text-xs text-slate-500">/ 次</span>
                </div>
                <div className="text-xs text-slate-400">
                  望远镜点位: <span className="text-cosmos-400">{sp.pointMultiplier}x</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
