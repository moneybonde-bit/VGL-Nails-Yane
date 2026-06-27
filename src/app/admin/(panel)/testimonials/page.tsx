'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, Loader2, Upload } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Testimonial } from '@/types/database';
import { AdminHeader, Modal, Row, Field, TextArea, SaveButton, Loading, EmptyState } from '@/components/admin/ui';

export default function AdminTestimonialsPage() {
  const supabase = createClient();
  const [rows, setRows] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('testimonials').select('*').order('sort_order', { ascending: true });
    setRows(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm('Hapus testimoni ini?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    load();
  };
  const toggle = async (t: Testimonial) => {
    await supabase.from('testimonials').update({ is_published: !t.is_published }).eq('id', t.id);
    load();
  };

  return (
    <div>
      <AdminHeader
        title="Testimoni"
        subtitle="Ulasan pelanggan yang tampil di website."
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
        <EmptyState>Belum ada testimoni.</EmptyState>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((t) => (
            <div key={t.id} className="flex items-start justify-between gap-3 rounded-2xl border border-nude-100 bg-white p-4">
              <div className="flex min-w-0 gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-ash-100">
                  {t.avatar_url ? <Image src={t.avatar_url} alt={t.customer_name} fill className="object-cover" sizes="48px" /> : null}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-ink">{t.customer_name}</p>
                    {!t.is_published ? (
                      <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[11px] text-ink-muted">draft</span>
                    ) : null}
                  </div>
                  <div className="flex gap-0.5 text-rose-gold">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={12} className="fill-rose-gold" />
                    ))}
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{t.comment}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <IconBtn label="Publish/Draft" onClick={() => toggle(t)}>
                  {t.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                </IconBtn>
                <IconBtn
                  label="Edit"
                  onClick={() => {
                    setEditing(t);
                    setShowForm(true);
                  }}
                >
                  <Pencil size={14} />
                </IconBtn>
                <IconBtn label="Hapus" danger onClick={() => remove(t.id)}>
                  <Trash2 size={14} />
                </IconBtn>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <TestimonialForm
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

function TestimonialForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: Testimonial | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState({
    customer_name: initial?.customer_name ?? '',
    avatar_url: initial?.avatar_url ?? '',
    rating: initial?.rating?.toString() ?? '5',
    comment: initial?.comment ?? '',
    sort_order: initial?.sort_order?.toString() ?? '0',
    is_published: initial?.is_published ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const set = (k: keyof typeof form, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const handleUpload = async (file: File) => {
    setUploading(true);
    setErr(null);
    try {
      const ext = file.name.split('.').pop();
      const path = `testimonials/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('gallery').upload(path, file, { cacheControl: '3600', upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from('gallery').getPublicUrl(path);
      set('avatar_url', data.publicUrl);
    } catch {
      setErr('Upload gagal. Pastikan bucket "gallery" sudah dibuat & public.');
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.customer_name || !form.comment) {
      setErr('Nama dan komentar wajib diisi.');
      return;
    }
    setSaving(true);
    const payload = {
      customer_name: form.customer_name,
      avatar_url: form.avatar_url || null,
      rating: Math.min(5, Math.max(1, Number(form.rating) || 5)),
      comment: form.comment,
      sort_order: Number(form.sort_order) || 0,
      is_published: form.is_published,
    };
    const res = initial
      ? await supabase.from('testimonials').update(payload).eq('id', initial.id)
      : await supabase.from('testimonials').insert(payload);
    setSaving(false);
    if (res.error) {
      setErr('Gagal menyimpan. Cek izin (RLS).');
      return;
    }
    onSaved();
  };

  return (
    <Modal title={initial ? 'Edit Testimoni' : 'Tambah Testimoni'} onClose={onClose}>
      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink">Foto pelanggan</span>
        {form.avatar_url ? (
          <div className="relative mb-2 h-16 w-16 overflow-hidden rounded-full bg-ash-100">
            <Image src={form.avatar_url} alt="Preview" fill className="object-cover" sizes="64px" />
          </div>
        ) : null}
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-nude-300 bg-nude-50 py-3 text-sm text-ink-muted hover:border-rose-gold">
          {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
          {uploading ? 'Mengunggah…' : 'Upload foto'}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
        </label>
        <input className="input mt-2" placeholder="atau tempel URL foto" value={form.avatar_url} onChange={(e) => set('avatar_url', e.target.value)} />
      </div>
      <Row>
        <Field label="Nama *" value={form.customer_name} onChange={(v) => set('customer_name', v)} />
        <Field label="Rating (1–5)" type="number" value={form.rating} onChange={(v) => set('rating', v)} />
      </Row>
      <TextArea label="Komentar *" value={form.comment} onChange={(v) => set('comment', v)} />
      <Row>
        <label className="flex items-end pb-2 text-sm text-ink">
          <input type="checkbox" checked={form.is_published} onChange={(e) => set('is_published', e.target.checked)} className="mr-2 h-4 w-4 accent-rose-gold" />
          Tampilkan
        </label>
        <Field label="Urutan" type="number" value={form.sort_order} onChange={(v) => set('sort_order', v)} />
      </Row>
      {err ? <p className="text-sm text-rose-gold">{err}</p> : null}
      <SaveButton saving={saving} onClick={save} />
    </Modal>
  );
}
