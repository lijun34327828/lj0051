import { create } from 'zustand';
import type { ObservationPoint, Equipment, BookingFormData } from '@/types';

interface BookingState {
  selectedDate: string;
  selectedTimeSlot: string | null;
  selectedPoint: ObservationPoint | null;
  selectedEquipment: { equipment: Equipment; quantity: number }[];
  formData: BookingFormData;
  step: number;

  setSelectedDate: (date: string) => void;
  setSelectedTimeSlot: (slot: string | null) => void;
  setSelectedPoint: (point: ObservationPoint | null) => void;
  addEquipment: (equipment: Equipment) => void;
  removeEquipment: (equipmentId: string) => void;
  updateEquipmentQuantity: (equipmentId: string, quantity: number) => void;
  setFormData: (data: Partial<BookingFormData>) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetBooking: () => void;
  getTotalEquipmentPrice: () => number;
}

function getDefaultDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

export const useBookingStore = create<BookingState>((set, get) => ({
  selectedDate: getDefaultDate(),
  selectedTimeSlot: null,
  selectedPoint: null,
  selectedEquipment: [],
  formData: {
    userName: '',
    phone: '',
  },
  step: 1,

  setSelectedDate: (date) => {
    set({ selectedDate: date, selectedTimeSlot: null, selectedPoint: null, step: 1 });
  },

  setSelectedTimeSlot: (slot) => {
    set({ selectedTimeSlot: slot, selectedPoint: null, step: slot ? 2 : 1 });
  },

  setSelectedPoint: (point) => {
    set({ selectedPoint: point, step: point ? 3 : 2 });
  },

  addEquipment: (equipment) => {
    const { selectedEquipment } = get();
    const existing = selectedEquipment.find(e => e.equipment.id === equipment.id);
    if (existing) {
      return;
    }
    set({
      selectedEquipment: [...selectedEquipment, { equipment, quantity: 1 }]
    });
  },

  removeEquipment: (equipmentId) => {
    set(state => ({
      selectedEquipment: state.selectedEquipment.filter(e => e.equipment.id !== equipmentId)
    }));
  },

  updateEquipmentQuantity: (equipmentId, quantity) => {
    if (quantity <= 0) {
      get().removeEquipment(equipmentId);
      return;
    }
    set(state => ({
      selectedEquipment: state.selectedEquipment.map(e =>
        e.equipment.id === equipmentId
          ? { ...e, quantity: Math.min(quantity, e.equipment.available || e.equipment.total) }
          : e
      )
    }));
  },

  setFormData: (data) => {
    set(state => ({
      formData: { ...state.formData, ...data }
    }));
  },

  setStep: (step) => set({ step }),

  nextStep: () => set(state => ({ step: Math.min(state.step + 1, 5) })),
  prevStep: () => set(state => ({ step: Math.max(state.step - 1, 1) })),

  resetBooking: () => {
    set({
      selectedTimeSlot: null,
      selectedPoint: null,
      selectedEquipment: [],
      formData: { userName: '', phone: '' },
      step: 1,
    });
  },

  getTotalEquipmentPrice: () => {
    const { selectedEquipment } = get();
    return selectedEquipment.reduce((sum, item) => {
      return sum + item.equipment.price * item.quantity;
    }, 0);
  },
}));
