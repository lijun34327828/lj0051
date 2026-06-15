import { Users, MapPin, DollarSign, Package, TrendingUp } from 'lucide-react';
import type { DashboardStats } from '@/types';
import { formatPrice } from '@/utils/date';

interface DashboardCardsProps {
  stats: DashboardStats | null;
  loading?: boolean;
}

export function DashboardCards({ stats, loading = false }: DashboardCardsProps) {
  const cards = [
    {
      title: '今日预约人数',
      value: stats?.today.bookingCount ?? 0,
      suffix: '人',
      icon: Users,
      color: 'from-cosmos-500 to-cosmos-700',
      bgColor: 'bg-cosmos-500/10',
      borderColor: 'border-cosmos-500/30',
    },
    {
      title: '空置观测位',
      value: stats?.today.vacantPoints ?? 0,
      suffix: `/${stats?.today.totalPoints ?? 0}`,
      icon: MapPin,
      color: 'from-emerald-500 to-emerald-700',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
    },
    {
      title: '累计预约数',
      value: stats?.overall.totalBookings ?? 0,
      suffix: '单',
      icon: TrendingUp,
      color: 'from-starlight-500 to-amber-600',
      bgColor: 'bg-starlight-500/10',
      borderColor: 'border-starlight-500/30',
    },
    {
      title: '累计营收',
      value: formatPrice(stats?.overall.totalRevenue ?? 0),
      suffix: '',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-2xl border ${card.borderColor} ${card.bgColor} backdrop-blur-sm p-5 transition-all hover:scale-[1.02] hover:shadow-xl`}
        >
          <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full bg-gradient-to-br ${card.color} opacity-20 blur-xl`}></div>
          
          <div className="relative z-10">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
            
            <p className="text-sm text-slate-400 mb-1">{card.title}</p>
            
            {loading ? (
              <div className="h-8 w-24 bg-slate-700/50 rounded animate-pulse"></div>
            ) : (
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-display font-bold text-white">
                  {card.value}
                </span>
                <span className="text-sm text-slate-400">{card.suffix}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
