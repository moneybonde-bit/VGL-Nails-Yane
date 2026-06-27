'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Images,
  Sparkles,
  Tag,
  MessageSquareQuote,
  HelpCircle,
  CalendarHeart,
  LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/utils/cn';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/gallery', label: 'Gallery', icon: Images },
  { href: '/admin/bookings', label: 'Booking', icon: CalendarHeart },
  { href: '/admin/services', label: 'Layanan', icon: Sparkles },
  { href: '/admin/pricing', label: 'Harga', icon: Tag },
  { href: '/admin/testimonials', label: 'Testimoni', icon: MessageSquareQuote },
  { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
];

export function AdminNav({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    onClose?.();
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <nav className="flex h-full flex-col gap-1 p-3">
      <p className="px-3 py-3 font-display text-lg font-extrabold text-ink">
        VGL<span className="text-rose-gold"> Admin</span>
      </p>
      {NAV.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
              active ? 'bg-rose-gold text-white' : 'text-ink-muted hover:bg-nude-50 hover:text-ink',
            )}
          >
            <Icon size={18} /> {label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={signOut}
        className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-muted transition-colors hover:bg-nude-50 hover:text-ink"
      >
        <LogOut size={18} /> Keluar
      </button>
    </nav>
  );
}
