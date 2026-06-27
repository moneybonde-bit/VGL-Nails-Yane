'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Service } from '@/types/database';
import { formatIDR, formatDuration } from '@/utils/format';
import { AdminHeader, Modal, Row, Field, TextArea, SaveButton, Loading, EmptyState } from '@/components/admin/ui';

export default function AdminServicesPage() {
  const supabase = createClient();
  const [rows, setRows] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
    setRows(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm('Hapus layanan ini?')) return;
    await supabase.from('services').delete().eq('id', id);
    load();
  };

  const toggle = async (s: Service) => {
    await supabase.from('services').update({ is_active: !s.is_active }).eq('id', s.id);
    load();
  };

  return (
    <div>
      <AdminHeader
        title="Layanan"
        subtitle="Kelola daftar layanan yang tampil di website."
        action={
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setShowForm(true);
            }}
            className="btn-primary h-11 px-5 text-sm"
          >
            <Plus size={18} /> Tambah
          </button>
        }
      />

      {loading ? (
        <Loading />
      ) : rows.length === 0 ? (
        <EmptyState>Belum ada layanan. Klik “Tambah” untuk mulai.</EmptyState>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 rounded-2xl border border-nude-100 bg-white p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold text-ink">{s.name}</p>
                  {!s.is_active ? (
                    <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[11px] text-ink-muted">draft</span>
                  ) : null}
                </div>
                <p className="mt-0.5 line-clamp-1 text-sm text-ink-muted">{s.description}</p>
                <p className="mt-0.5 text-xs text-ink-muted">
                  {formatIDR(s.price)} · {formatDuration(s.duration_minutes)} · ikon: {s.icon ?? '—'}
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <IconBtn label="Aktif/Nonaktif" onClick={() => toggle(s)}>
                  {s.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                </IconBtn>
                <IconBtn
                  label="Edit"
                  onClick={() => {
                    setEditing(s);
                    setShowForm(true);
                  }}
                >
                  <Pencil size={14} />
                </IconBtn>
                <IconBtn label="Hapus" danger onClick={() => remove(s.id)}>
                  <Trash2 size={14} />
                </IconBtn>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <ServiceForm
          initial={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            load();
          }}
        />
      ) : null}
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  label,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={
        'grid h-10 w-10 place-items-center rounded-xl border border-nude-200 ' +
        (danger ? 'text-rose-gold hover:bg-rose-softgold/20' : 'text-ink-muted hover:text-ink')
      }
    >
      {children}
    </button>
  );
}

function ServiceForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: Service | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    duration_minutes: initial?.duration_minutes?.toString() ?? '',
    price: initial?.price?.toString() ?? '',
    icon: initial?.icon ?? 'Sparkles',
    sort_order: initial?.sort_order?.toString() ?? '0',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name) {
      setErr('Nama layanan wajib diisi.');
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description || null,
      duration_minutes: form.duration_minutes ? Number(form.duration_minutes) : null,
      price: form.price ? Number(form.price) : null,
      icon: form.icon || null,
      sort_order: Number(form.sort_order) || 0,
    };
    const res = initial
      ? await supabase.from('services').update(payload).eq('id', initial.id)
      : await supabase.from('services').insert(payload);
    setSaving(false);
    if (res.error) {
      setErr('Gagal menyimpan. Cek koneksi & izin (RLS).');
      return;
    }
    onSaved();
  };

  return (
    <Modal title={initial ? 'Edit Layanan' : 'Tambah Layanan'} onClose={onClose}>
      <Field label="Nama *" value={form.name} onChange={(v) => set('name', v)} />
      <TextArea label="Deskripsi" value={form.description} onChange={(v) => set('description', v)} />
      <Row>
        <Field label="Durasi (menit)" type="number" value={form.duration_minutes} onChange={(v) => set('duration_minutes', v)} />
        <Field label="Harga (Rp)" type="number" value={form.price} onChange={(v) => set('price', v)} />
      </Row>
      <Row>
        <Field label="Ikon (nama lucide)" value={form.icon} onChange={(v) => set('icon', v)} placeholder="Sparkles" />
        <Field label="Urutan" type="number" value={form.sort_order} onChange={(v) => set('sort_order', v)} />
      </Row>
      <p className="text-xs text-ink-muted">
        Nama ikon mengikuti lucide-react (mis. Sparkles, Hand, Palette, Gem, Flower2, Wrench).
      </p>
      {err ? <p className="text-sm text-rose-gold">{err}</p> : null}
      <SaveButton saving={saving} onClick={save} />
    </Modal>
  );
}
