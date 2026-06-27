'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { useBooking } from '@/store/booking';

export function Hero() {
  const { open } = useBooking();

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden">
      {/* Background photo */}
      <Image
        src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1600&q=70"
        alt="Hasil nail art premium VGL Nails"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Soft wash so text stays readable on any photo */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream/70 via-cream/55 to-cream" />
      <div className="absolute inset-0 bg-gradient-to-r from-cream/80 to-transparent" />

      <div className="container-px relative flex min-h-[100svh] flex-col justify-center pt-28 pb-40 sm:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-rose-softgold/60 bg-white/70 px-4 py-1.5 text-xs font-medium text-rose-gold backdrop-blur">
            <Star size={13} className="fill-rose-gold" /> Studio nail art premium · Bahodopi, Morowali
          </span>

          <h1 className="mt-5 text-4xl leading-[1.05] text-ink sm:text-6xl">
            Beautiful Nails,
            <br />
            <span className="text-rose-gold">Beautiful Confidence</span>
          </h1>

          <p className="mt-5 max-w-md text-base text-ink-muted sm:text-lg">
            Desain kuku rapi, tahan lama, dan elegan — dikerjakan dengan detail dan produk
            berkualitas. Wujudkan tampilan yang bikin kamu makin percaya diri.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => open()} className="btn-primary px-7 text-base">
              Book Appointment <ArrowRight size={18} />
            </button>
            <a href="#gallery" className="btn-secondary px-7 text-base">
              Lihat Gallery
            </a>
          </div>

          <p className="mt-6 text-sm text-ink-muted">
            ⭐ 4,9/5 dari pelanggan · {siteConfig.socials.instagramHandle}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
