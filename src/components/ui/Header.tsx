'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { siteConfig, waLink } from '@/lib/site-config';
import { cn } from '@/utils/cn';

const links = [
  { href: '#gallery', label: 'Gallery' },
  { href: '#services', label: 'Layanan' },
  { href: '#pricing', label: 'Harga' },
  { href: '#testimonials', label: 'Testimoni' },
  { href: '#faq', label: 'FAQ' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container-px">
        <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 px-4 py-2.5 shadow-soft backdrop-blur-md">
          <a href="#top" className="font-display text-lg font-extrabold tracking-tight text-ink">
            VGL<span className="text-rose-gold"> Nails</span>
          </a>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Navigasi utama">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-ink-muted transition-colors hover:text-rose-gold"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href={waLink(`Halo ${siteConfig.name}, saya mau booking nail art`)} className="btn-primary hidden h-10 px-5 text-sm md:inline-flex">
              Book Now
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={open}
              className="grid h-11 w-11 place-items-center rounded-xl border border-nude-200 bg-white text-ink md:hidden"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="container-px md:hidden"
            aria-label="Navigasi seluler"
          >
            <ul className="mt-2 grid gap-1 rounded-2xl border border-nude-100 bg-white p-2 shadow-soft-lg">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'block rounded-xl px-4 py-3 text-ink transition-colors hover:bg-nude-50',
                    )}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
