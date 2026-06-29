import { create } from 'zustand'

interface DateState {
  selectedMonth: Date
  changeMonth: (offset: number) => void
}

export const useDateStore = create<DateState>((set) => ({
  selectedMonth: new Date(), // Comienza con el mes actual de hoy
  changeMonth: (offset) =>
    set((state) => {
      const newDate = new Date(state.selectedMonth)
      newDate.setMonth(newDate.getMonth() + offset) // Suma o resta meses
      return { selectedMonth: newDate }
    }),
}))
