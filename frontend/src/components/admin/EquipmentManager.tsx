import { useState } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Package, Camera, Layers, Wrench } from 'lucide-react';
import type { Equipment, EquipmentCategory } from '@/types';
import { categoryLabels } from '@/types';
import { formatPrice } from '@/utils/date';

interface EquipmentManagerProps {
  equipment: Equipment[];
  onAdd: (data: { name: string; category: string; total: number; price: number }) => void;
  onUpdate: (id: string, data: Partial<Equipment>) => void;
  loading?: boolean;
}

export function EquipmentManager({ equipment, onAdd, onUpdate, loading = false }: EquipmentManagerProps) {
  const [activeCategory, setActiveCategory] = useState<EquipmentCategory>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'telescope' as 'telescope' | 'filter' | 'binocular' | 'accessory',
    total: 0,
    price: 0,
  });

  const categories: EquipmentCategory[] = ['all', 'telescope', 'filter', 'binocular', 'accessory'];

  const filteredEquipment = equipment.filter(eq => 
    activeCategory === 'all' || eq.category === activeCategory
  );

  const handleAdd = () => {
    setFormData({ name: '', category: 'telescope', total: 0, price: 0 });
    setEditingId(null);
    setShowAddModal(true);
  };

  const handleEdit = (eq: Equipment) => {
    setFormData({
      name: eq.name,
      category: eq.category as EquipmentCategory,
      total: eq.total,
      price: eq.price,
    });
    setEditingId(eq.id);
    setShowAddModal(true);
  };

  const handleSubmit = () => {
    if (!formData.name || formData.total <= 0) return;
    
    if (editingId) {
      onUpdate(editingId, {
        name: formData.name,
        category: formData.category,
        total: formData.total,
        price: formData.price,
      });
    } else {
      onAdd({
        name: formData.name,
        category: formData.category,
        total: formData.total,
        price: formData.price,
      });
    }
    setShowAddModal(false);
  };

  const toggleStatus = (eq: Equipment) => {
    onUpdate(eq.id, { status: eq.status === 'active' ? 'inactive' : 'active' });
  };

  const categoryIcons: Record<EquipmentCategory, React.ReactNode> = {
    all: <Package className="w-4 h-4" />,
    telescope: <Camera className="w-4 h-4" />,
    filter: <Layers className="w-4 h-4" />,
    binocular: <Wrench className="w-4 h-4" />,
    accessory: <Package className="w-4 h-4" />,
  };

  return (
    <div className="rounded-2xl border border-cosmos-800/50 bg-slate-800/40 backdrop-blur-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-cosmos-400" />
          <h3 className="font-display text-lg font-semibold text-white">
            设备管理
          </h3>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cosmos-600 hover:bg-cosmos-500 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加设备
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeCategory === cat
                ? 'bg-cosmos-600/40 text-cosmos-300 border border-cosmos-500/50'
                : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50'
            }`}
          >
            {categoryIcons[cat]}
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-slate-400 border-b border-slate-700/50">
              <th className="pb-3 font-medium">设备名称</th>
              <th className="pb-3 font-medium">分类</th>
              <th className="pb-3 font-medium">库存</th>
              <th className="pb-3 font-medium">价格</th>
              <th className="pb-3 font-medium">状态</th>
              <th className="pb-3 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  加载中...
                </td>
              </tr>
            ) : filteredEquipment.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  暂无设备
                </td>
              </tr>
            ) : (
              filteredEquipment.map((eq) => (
                <tr key={eq.id} className="text-sm hover:bg-slate-700/20">
                  <td className="py-3 text-white font-medium">{eq.name}</td>
                  <td className="py-3">
                    <span className="text-xs px-2 py-1 rounded-md bg-slate-700/50 text-slate-300">
                      {categoryLabels[eq.category as EquipmentCategory]}
                    </span>
                  </td>
                  <td className="py-3 text-slate-300">{eq.total} 件</td>
                  <td className="py-3 text-starlight-400 font-medium">{formatPrice(eq.price)}</td>
                  <td className="py-3">
                    <button
                      onClick={() => toggleStatus(eq)}
                      className="flex items-center gap-1 text-xs"
                    >
                      {eq.status === 'active' ? (
                        <>
                          <ToggleRight className="w-5 h-5 text-emerald-400" />
                          <span className="text-emerald-400">启用</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-5 h-5 text-slate-500" />
                          <span className="text-slate-500">停用</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleEdit(eq)}
                      className="p-1.5 rounded-lg hover:bg-slate-600/50 text-slate-400 hover:text-cosmos-400 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 rounded-2xl border border-cosmos-700/50 bg-slate-800 p-6">
            <h3 className="font-display text-lg font-semibold text-white mb-4">
              {editingId ? '编辑设备' : '添加设备'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1.5">设备名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cosmos-500/50"
                  placeholder="请输入设备名称"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1.5">分类</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as EquipmentCategory }))}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-cosmos-500/50"
                >
                  <option value="telescope">望远镜</option>
                  <option value="filter">滤镜</option>
                  <option value="binocular">双筒镜</option>
                  <option value="accessory">配件</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">库存数量</label>
                  <input
                    type="number"
                    value={formData.total}
                    onChange={(e) => setFormData(prev => ({ ...prev, total: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-cosmos-500/50"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1.5">价格 (元)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-cosmos-500/50"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 rounded-xl bg-cosmos-600 hover:bg-cosmos-500 text-white font-medium transition-colors"
              >
                {editingId ? '保存' : '添加'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
