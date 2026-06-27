'use client';

import { MessageCircle, CalendarHeart, MapPin } from 'lucide-react';
import { siteConfig, waLink, mapsLink } from '@/lib/site-config';
import { useBooking } from '@/store/booking';

/** Floating bottom action bar, mobile only. Sits above the iOS home indicator. */
export function MobileStickyCTA() {
  const { open } = useBooking();

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="container-px pb-3">
        <div className="grid grid-cols-3 gap-2 rounded-2xl border border-nude-100 bg-white/90 p-2 shadow-soft-lg backdrop-blur-md">
          <a
            href={waLink(`Halo ${siteConfig.name}, saya mau tanya nail art`)}
            className="flex flex-col items-center justify-center gap-1 rounded-xl py-2.5 text-ink-muted active:scale-95"
            aria-label="Hubungi via WhatsApp"
          >
            <MessageCircle size={20} />
            <span className="text-[11px] font-medium">WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => open()}
            className="flex flex-col items-center justify-center gap-1 rounded-xl bg-rose-gold py-2.5 text-white shadow-glow active:scale-95"
            aria-label="Booking sekarang"
          >
            <CalendarHeart size={20} />
            <span className="text-[11px] font-semibold">Book Now</span>
          </button>
          <a
            href={mapsLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1 rounded-xl py-2.5 text-ink-muted active:scale-95"
            aria-label="Lihat lokasi di Google Maps"
          >
            <MapPin size={20} />
            <span className="text-[11px] font-medium">Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
}
