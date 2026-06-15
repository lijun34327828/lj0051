import { useState, useEffect } from 'react';
import { Telescope, Home, AlertCircle, CheckCircle } from 'lucide-react';
import type { ObservationPoint } from '@/types';

interface ObservatoryMapProps {
  points: ObservationPoint[];
  selectedPointId?: string;
  onPointSelect?: (point: ObservationPoint) => void;
  showStatus?: boolean;
}

export function ObservatoryMap({ points, selectedPointId, onPointSelect, showStatus = true }: ObservatoryMapProps) {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  const getPointColor = (point: ObservationPoint) => {
    if (showStatus && point.status === 'maintenance') {
      return 'bg-amber-500 border-amber-400';
    }
    if (showStatus && point.isBooked) {
      return 'bg-red-500/80 border-red-400';
    }
    if (selectedPointId === point.id) {
      return 'bg-starlight-400 border-starlight-300 scale-125';
    }
    if (point.type === 'telescope') {
      return 'bg-cosmos-500 border-cosmos-400 hover:bg-cosmos-400';
    }
    return 'bg-emerald-500 border-emerald-400';
  };

  const getPointStatus = (point: ObservationPoint) => {
    if (point.status === 'maintenance') return '维护中';
    if (point.isBooked) return '已预约';
    if (selectedPointId === point.id) return '已选择';
    return '可预约';
  };

  const canSelect = (point: ObservationPoint) => {
    return point.status !== 'maintenance' && !point.isBooked;
  };

  return (
    <div className="relative w-full h-80 lg:h-96 rounded-2xl overflow-hidden border border-cosmos-800/50 bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-sm">
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="absolute top-4 left-4 z-10">
        <div className="text-xs text-cosmos-400 font-medium mb-1">观测台区</div>
        <div className="w-32 h-20 border-2 border-dashed border-cosmos-600/30 rounded-lg"></div>
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-xs text-emerald-400 font-medium mb-1">室内观景区</div>
        <div className="h-16 border-2 border-dashed border-emerald-600/30 rounded-lg"></div>
      </div>

      <div className="absolute top-4 right-4 flex flex-col gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-cosmos-500 border border-cosmos-400"></span>
          <span className="text-slate-400">望远镜位</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-400"></span>
          <span className="text-slate-400">室内观景区</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500/80 border border-red-400"></span>
          <span className="text-slate-400">已预约</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-400"></span>
          <span className="text-slate-400">维护中</span>
        </div>
      </div>

      {points.map((point) => (
        <div
          key={point.id}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
            canSelect(point) ? 'hover:scale-110' : 'cursor-not-allowed opacity-60'
          }`}
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
          onMouseEnter={() => setHoveredPoint(point.id)}
          onMouseLeave={() => setHoveredPoint(null)}
          onClick={() => canSelect(point) && onPointSelect?.(point)}
        >
          <div
            className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${getPointColor(point)} ${
              selectedPointId === point.id ? 'animate-glow' : ''
            }`}
          >
            {point.type === 'telescope' ? (
              <Telescope className="w-4 h-4 text-white" />
            ) : (
              <Home className="w-4 h-4 text-white" />
            )}
            
            {selectedPointId === point.id && (
              <div className="absolute inset-0 rounded-full animate-ping bg-starlight-400/30"></div>
            )}
          </div>

          {hoveredPoint === point.id && (
            <div className="absolute left-1/2 -translate-x-1/2 -top-2 -translate-y-full z-20 w-40 bg-slate-800/95 backdrop-blur-xl border border-cosmos-600/50 rounded-lg p-3 shadow-xl">
              <div className="text-sm font-medium text-white mb-1">{point.name}</div>
              <div className="text-xs text-slate-400 mb-2">
                {point.type === 'telescope' ? '望远镜观测位' : '室内观景区'}
              </div>
              <div className={`text-xs flex items-center gap-1 ${
                point.status === 'maintenance' ? 'text-amber-400' :
                point.isBooked ? 'text-red-400' :
                selectedPointId === point.id ? 'text-starlight-400' :
                'text-emerald-400'
              }`}>
                {point.status === 'maintenance' ? (
                  <AlertCircle className="w-3 h-3" />
                ) : point.isBooked ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <CheckCircle className="w-3 h-3" />
                )}
                {getPointStatus(point)}
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-2 h-2 bg-slate-800/95 border-r border-b border-cosmos-600/50 rotate-45"></div>
            </div>
          )}
        </div>
      ))}

      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        <h3 className="font-display text-lg font-bold text-white/90">
          天文台平面图
        </h3>
      </div>
    </div>
  );
}
