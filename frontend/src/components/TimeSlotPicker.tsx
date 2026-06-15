import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface TimeSlotPickerProps {
  timeSlots: string[];
  selectedSlot: string | null;
  onSlotSelect: (slot: string) => void;
  bookedSlots?: string[];
}

export function TimeSlotPicker({ timeSlots, selectedSlot, onSlotSelect, bookedSlots = [] }: TimeSlotPickerProps) {
  const isBooked = (slot: string) => bookedSlots.includes(slot);

  return (
    <div className="rounded-2xl border border-cosmos-800/50 bg-slate-800/40 backdrop-blur-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-cosmos-400" />
        <h3 className="font-display text-lg font-semibold text-white">
          选择时段
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {timeSlots.map((slot) => {
          const booked = isBooked(slot);
          const selected = selectedSlot === slot;

          return (
            <button
              key={slot}
              disabled={booked}
              onClick={() => !booked && onSlotSelect(slot)}
              className={`relative p-4 rounded-xl border transition-all duration-200 ${
                booked
                  ? 'bg-slate-800/30 border-slate-700/50 cursor-not-allowed opacity-60'
                  : selected
                  ? 'bg-cosmos-600/30 border-cosmos-500/50 ring-2 ring-cosmos-400/50'
                  : 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50 hover:border-cosmos-600/50 cursor-pointer'
              }`}
            >
              <div className={`text-lg font-display font-semibold mb-1 ${
                booked ? 'text-slate-500' : selected ? 'text-white' : 'text-slate-200'
              }`}>
                {slot}
              </div>
              <div className={`text-xs flex items-center gap-1 ${
                booked ? 'text-red-400' : selected ? 'text-cosmos-300' : 'text-slate-400'
              }`}>
                {booked ? (
                  <>
                    <XCircle className="w-3 h-3" />
                    已约满
                  </>
                ) : selected ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    已选择
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    可预约
                  </>
                )}
              </div>

              {selected && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cosmos-400/10 to-transparent pointer-events-none"></div>
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        * 每个时段时长 2 小时，请提前 15 分钟到场准备
      </p>
    </div>
  );
}
