import { useState } from 'react';
import { Plus, Minus, Package, Camera, Layers, Wrench } from 'lucide-react';
import type { Equipment, EquipmentCategory } from '@/types';
import { categoryLabels } from '@/types';
import { formatPrice } from '@/utils/date';

interface EquipmentListProps {
  equipment: Equipment[];
  selectedItems: { equipment: Equipment; quantity: number }[];
  onAdd: (equipment: Equipment) => void;
  onRemove: (equipmentId: string) => void;
  onUpdateQuantity: (equipmentId: string, quantity: number) => void;
}

const categoryIcons: Record<EquipmentCategory, React.ReactNode> = {
  all: <Package className="w-4 h-4" />,
  telescope: <Camera className="w-4 h-4" />,
  filter: <Layers className="w-4 h-4" />,
  binocular: <Wrench className="w-4 h-4" />,
  accessory: <Package className="w-4 h-4" />,
};

export function EquipmentList({ equipment, selectedItems, onAdd, onRemove, onUpdateQuantity }: EquipmentListProps) {
  const [activeCategory, setActiveCategory] = useState<EquipmentCategory>('all');

  const categories: EquipmentCategory[] = ['all', 'telescope', 'filter', 'binocular', 'accessory'];

  const filteredEquipment = equipment.filter(eq => 
    activeCategory === 'all' || eq.category === activeCategory
  );

  const getSelectedQuantity = (eqId: string) => {
    const item = selectedItems.find(i => i.equipment.id === eqId);
    return item?.quantity || 0;
  };

  return (
    <div className="rounded-2xl border border-cosmos-800/50 bg-slate-800/40 backdrop-blur-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Package className="w-5 h-5 text-cosmos-400" />
        <h3 className="font-display text-lg font-semibold text-white">
          设备租赁
        </h3>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCategory === cat
                ? 'bg-cosmos-600/40 text-cosmos-300 border border-cosmos-500/50'
                : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
            }`}
          >
            {categoryIcons[cat]}
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {filteredEquipment.map((eq) => {
          const selectedQty = getSelectedQuantity(eq.id);
          const isSelected = selectedQty > 0;
          const available = eq.available ?? eq.total;

          return (
            <div
              key={eq.id}
              className={`p-3 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-cosmos-600/20 border-cosmos-500/40'
                  : 'bg-slate-700/20 border-slate-600/30'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-medium text-white">{eq.name}</h4>
                  <p className="text-xs text-slate-400">{categoryLabels[eq.category as EquipmentCategory]}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-starlight-400">
                    {formatPrice(eq.price)}
                    <span className="text-xs text-slate-500 font-normal">/次</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-400">库存: </span>
                  <span className={available > 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {available}件
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onUpdateQuantity(eq.id, selectedQty - 1)}
                        className="w-6 h-6 rounded-full bg-slate-600 hover:bg-slate-500 text-white flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm text-white font-medium">
                        {selectedQty}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(eq.id, selectedQty + 1)}
                        disabled={selectedQty >= available}
                        className="w-6 h-6 rounded-full bg-cosmos-600 hover:bg-cosmos-500 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onAdd(eq)}
                      disabled={available === 0}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-cosmos-600/30 text-cosmos-300 border border-cosmos-500/30 hover:bg-cosmos-600/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      添加
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    available / eq.total > 0.5 ? 'bg-emerald-500' :
                    available / eq.total > 0.2 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(available / eq.total) * 100}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedItems.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">已选设备费用</span>
            <span className="text-starlight-400 font-semibold">
              {formatPrice(
                selectedItems.reduce((sum, item) => sum + item.equipment.price * item.quantity, 0)
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
