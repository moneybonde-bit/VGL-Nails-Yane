'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Clock, Tag } from 'lucide-react';
import type { GalleryItem } from '@/types/database';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useBooking } from '@/store/booking';
import { formatIDR, formatDuration } from '@/utils/format';

const FILTERS = [
  'Semua',
  'Simple',
  'Luxury',
  'Wedding',
  'Character',
  'Gel',
  'Extension',
  'Short Nails',
  'Long Nails',
] as const;

function matchesFilter(item: GalleryItem, filter: string): boolean {
  if (filter === 'Semua') return true;
  const haystack = [item.category, ...(item.tags ?? [])].map((s) => s.toLowerCase());
  const f = filter.toLowerCase();
  if (f === 'gel') return haystack.some((h) => h.includes('gel'));
  if (f === 'extension') return haystack.some((h) => h.includes('extension'));
  return haystack.includes(f);
}

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<string>('Semua');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const filtered = useMemo(() => items.filter((i) => matchesFilter(i, filter)), [items, filter]);

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i + 1) % filtered.length)),
    [filtered.length],
  );
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length)),
    [filtered.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [activeIndex, close, next, prev]);

  const active = activeIndex === null ? null : filtered[activeIndex];

  return (
    <section id="gallery" className="section-y bg-cream">
      <div className="container-px">
        <SectionHeading
          eyebrow="Portfolio"
          title="Galeri Desain"
          subtitle="Pilih inspirasi favoritmu. Ketuk foto untuk melihat detail, durasi, dan harga mulai."
        />

        {/* Filters — horizontal scroll on mobile, no page reload */}
        <div className="mt-8 -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-2 sm:w-full sm:flex-wrap sm:justify-center">
            {FILTERS.map((f) => {
              const activeF = filter === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  aria-pressed={activeF}
                  className={
                    'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ' +
                    (activeF
                      ? 'bg-rose-gold text-white shadow-glow'
                      : 'border border-nude-200 bg-white text-ink-muted hover:border-rose-gold hover:text-rose-gold')
                  }
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* Masonry via CSS columns */}
        <motion.div layout className="mt-8 columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, idx) => (
              <motion.button
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setActiveIndex(idx)}
                className="group relative mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl sm:mb-4"
                aria-label={`Lihat ${item.title}`}
              >
                <Image
                  src={item.image_url}
                  alt={item.alt_text ?? item.title}
                  width={500}
                  height={650}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="h-auto w-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-105"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 via-ink/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="p-3 text-left text-white">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-rose-softgold">
                      {item.category}
                    </p>
                    <p className="text-sm font-semibold">{item.title}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 ? (
          <p className="mt-10 text-center text-ink-muted">
            Belum ada desain untuk kategori ini. Coba filter lain ya.
          </p>
        ) : null}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active ? (
          <Lightbox
            item={active}
            onClose={close}
            onNext={next}
            onPrev={prev}
            hasNav={filtered.length > 1}
          />
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function Lightbox({
  item,
  onClose,
  onNext,
  onPrev,
  hasNav,
}: {
  item: GalleryItem;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNav: boolean;
}) {
  const { open } = useBooking();

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      <button type="button" className="absolute inset-0 bg-ink/85 backdrop-blur" onClick={onClose} aria-label="Tutup" />

      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"
        aria-label="Tutup galeri"
      >
        <X size={20} />
      </button>

      {hasNav ? (
        <>
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 sm:left-6"
            aria-label="Sebelumnya"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="absolute right-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25 sm:right-6"
            aria-label="Berikutnya"
          >
            <ChevronRight size={22} />
          </button>
        </>
      ) : null}

      <motion.div
        key={item.id}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white"
      >
        <div className="relative aspect-[4/5] w-full bg-ash-100">
          <Image
            src={item.image_url}
            alt={item.alt_text ?? item.title}
            fill
            sizes="(max-width: 640px) 100vw, 28rem"
            className="object-cover"
          />
        </div>
        <div className="p-5">
          <p className="eyebrow">{item.category}</p>
          <h3 className="mt-1 text-xl text-ink">{item.title}</h3>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={15} /> {formatDuration(item.duration_minutes)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Tag size={15} /> Mulai {formatIDR(item.starting_price)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              open(item.title);
            }}
            className="btn-primary mt-5 w-full"
          >
            Book desain ini
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
