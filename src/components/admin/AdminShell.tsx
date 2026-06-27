'use client';

import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { AdminNav } from '@/components/ui/AdminNav';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  // Lock body scroll when drawer is open on mobile
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="min-h-[100svh] bg-cream">
      <div className="mx-auto flex max-w-7xl">
        {/* Desktop sidebar — static, unchanged */}
        <aside className="sticky top-0 hidden h-[100svh] w-60 shrink-0 border-r border-nude-100 bg-white md:block">
          <AdminNav />
        </aside>

        {/* Mobile drawer */}
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            {/* Sidebar panel */}
            <aside className="fixed inset-y-0 left-0 z-50 w-60 overflow-y-auto border-r border-nude-100 bg-white shadow-xl md:hidden">
              <AdminNav onClose={() => setOpen(false)} />
            </aside>
          </>
        )}

        <main className="min-w-0 flex-1 p-5 sm:p-8">
          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mb-4 -ml-1 flex items-center gap-2 rounded-lg p-1.5 text-ink-muted hover:bg-nude-50 hover:text-ink md:hidden"
            aria-label="Buka menu navigasi"
          >
            <Menu size={22} />
          </button>
          {children}
        </main>
      </div>
    </div>
  );
}
