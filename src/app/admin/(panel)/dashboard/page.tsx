import { CalendarHeart, Images, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { formatIDR } from '@/utils/format';

export const dynamic = 'force-dynamic';

async function getStats() {
  try {
    const db = await createClient();
    const [{ count: bookingCount }, { count: galleryCount }, { data: recent }] = await Promise.all([
      db.from('bookings').select('*', { count: 'exact', head: true }),
      db.from('gallery_items').select('*', { count: 'exact', head: true }),
      db.from('bookings').select('*').order('created_at', { ascending: false }).limit(6),
    ]);
    return { bookingCount: bookingCount ?? 0, galleryCount: galleryCount ?? 0, recent: recent ?? [] };
  } catch {
    return { bookingCount: 0, galleryCount: 0, recent: [] };
  }
}

export default async function DashboardPage() {
  const { bookingCount, galleryCount, recent } = await getStats();

  const stats = [
    { label: 'Total Booking', value: bookingCount, icon: CalendarHeart },
    { label: 'Desain Galeri', value: galleryCount, icon: Images },
    { label: 'Booking Baru', value: recent.filter((r) => r.status === 'new').length, icon: Clock },
  ];

  return (
    <div>
      <h1 className="text-2xl text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-muted">Ringkasan aktivitas VGL Nails.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-muted">{s.label}</span>
              <s.icon size={18} className="text-rose-gold" />
            </div>
            <p className="mt-3 text-3xl font-bold text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-lg text-ink">Booking Terbaru</h2>
      <div className="mt-3 overflow-hidden rounded-2xl border border-nude-100 bg-white">
        {recent.length === 0 ? (
          <p className="p-6 text-sm text-ink-muted">
            Belum ada booking. Booking dari website akan muncul di sini.
          </p>
        ) : (
          <ul className="divide-y divide-nude-100">
            {recent.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 p-4 text-sm">
                <span className="font-medium text-ink">{b.name}</span>
                <span className="text-ink-muted">{b.whatsapp}</span>
                <span className="text-ink-muted">{b.service}</span>
                <span className="text-ink-muted">
                  {b.preferred_date} {b.preferred_time}
                </span>
                <span
                  className={
                    'ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium ' +
                    (b.status === 'new'
                      ? 'bg-rose-softgold/40 text-rose-gold'
                      : 'bg-nude-100 text-ink-muted')
                  }
                >
                  {b.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-6 text-xs text-ink-muted">
        Catatan: nilai contoh harga gunakan format penuh seperti {formatIDR(150000)}.
      </p>
    </div>
  );
}
