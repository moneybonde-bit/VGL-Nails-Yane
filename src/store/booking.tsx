'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface BookingState {
  isOpen: boolean;
  open: (presetService?: string) => void;
  close: () => void;
  presetService?: string;
}

const BookingContext = createContext<BookingState | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [presetService, setPresetService] = useState<string | undefined>(undefined);

  const open = (preset?: string) => {
    setPresetService(preset);
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  return (
    <BookingContext.Provider value={{ isOpen, open, close, presetService }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within <BookingProvider>');
  return ctx;
}
