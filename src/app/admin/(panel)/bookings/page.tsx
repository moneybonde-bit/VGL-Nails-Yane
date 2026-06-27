'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2, Trash2, ExternalLink, Phone } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Booking } from '@/types/database';
import { AdminHeader, Loading, EmptyState } from '@/components/admin/ui';

const STATUS: Booking['status'][] = ['new', 'confirmed', 'done', 'cancelled'];

const STATUS_STYLE: Record<Booking['status'], string> = {
  new: 'bg-rose-softgold/30 text-rose-gold',
  confirmed: 'bg-emerald-100 text-emerald-700',
  done: 'bg-ash-200 text-ink',
  cancelled: 'bg-ink/10 text-ink-muted line-through',
};

export default function AdminBookingsPage() {
  const supabase = createClient();
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Booking['status']>('all');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id: string, status: Booking['status']) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    setRows((r) => r.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const remove = async (id: string) => {
    if (!confirm('Hapus booking ini?')) return;
    await supabase.from('bookings').delete().eq('id', id);
    setRows((r) => r.filter((b) => b.id !== id));
  };

  const shown = filter === 'all' ? rows : rows.filter((b) => b.status === filter);

  return (
    <div>
      <AdminHeader title="Booking" subtitle="Permintaan booking yang masuk dari website." />

      <div className="mt-5 flex flex-wrap gap-2">
        {(['all', ...STATUS] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={
              'rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ' +
              (filter === s ? 'bg-rose-gold text-white' : 'border border-nude-200 text-ink-muted hover:text-ink')
            }
          >
            {s === 'all' ? 'Semua' : s}
            {s !== 'all' ? ` (${rows.filter((b) => b.status === s).length})` : ` (${rows.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <Loading />
      ) : shown.length === 0 ? (
        <EmptyState>Belum ada booking pada filter ini.</EmptyState>
      ) : (
        <div className="mt-6 space-y-3">
          {shown.map((b) => (
            <div key={b.id} className="rounded-2xl border border-nude-100 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-ink">{b.name}</p>
                    <span className={'rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ' + STATUS_STYLE[b.status]}>
                      {b.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-ink-muted">
                    {b.service || 'Layanan belum dipilih'} · {b.preferred_date}
                    {b.preferred_time ? ` ${b.preferred_time}` : ''}
                  </p>
                  {b.notes ? <p className="mt-1 text-sm text-ink-muted">“{b.notes}”</p> : null}
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                    <a
                      href={`https://wa.me/${b.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-rose-gold hover:underline"
                    >
                      <Phone size={14} /> {b.whatsapp}
                    </a>
                    {b.reference_url ? (
                      <a
                        href={b.reference_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-ink-muted hover:text-ink"
                      >
                        <ExternalLink size={14} /> Referensi
                      </a>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={b.status}
                    onChange={(e) => setStatus(b.id, e.target.value as Booking['status'])}
                    className="rounded-xl border border-nude-200 bg-white px-2.5 py-2 text-sm capitalize text-ink"
                    aria-label="Ubah status booking"
                  >
                    {STATUS.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => remove(b.id)}
                    aria-label="Hapus booking"
                    className="grid h-10 w-10 place-items-center rounded-xl border border-nude-200 text-rose-gold hover:bg-rose-softgold/20"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
