'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Plus, Trash2, Pencil, Loader2, Upload, X, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { GalleryItem } from '@/types/database';
import { formatIDR } from '@/utils/format';

const EMPTY = {
  title: '',
  category: '',
  image_url: '',
  alt_text: '',
  duration_minutes: '',
  starting_price: '',
  tags: '',
  status: 'published' as 'published' | 'draft',
};

export default function AdminGalleryPage() {
  const supabase = createClient();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('gallery_items')
      .select('*')
      .order('sort_order', { ascending: true });
    setItems(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm('Hapus desain ini?')) return;
    await supabase.from('gallery_items').delete().eq('id', id);
    load();
  };

  const toggleStatus = async (item: GalleryItem) => {
    await supabase
      .from('gallery_items')
      .update({ status: item.status === 'published' ? 'draft' : 'published' })
      .eq('id', item.id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-ink">Gallery</h1>
          <p className="mt-1 text-sm text-ink-muted">Kelola desain yang tampil di website.</p>
        </div>
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
      </div>

      {loading ? (
        <div className="mt-10 grid place-items-center text-ink-muted">
          <Loader2 className="animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <p className="mt-10 text-sm text-ink-muted">Belum ada desain. Klik “Tambah” untuk mulai.</p>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-nude-100 bg-white">
              <div className="relative aspect-[4/3] bg-ash-100">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.alt_text ?? item.title} fill className="object-cover" sizes="33vw" />
                ) : null}
                <span
                  className={
                    'absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-medium ' +
                    (item.status === 'published' ? 'bg-white/90 text-rose-gold' : 'bg-ink/70 text-white')
                  }
                >
                  {item.status}
                </span>
              </div>
              <div className="p-3">
                <p className="text-[11px] uppercase tracking-wide text-rose-gold">{item.category}</p>
                <p className="truncate text-sm font-semibold text-ink">{item.title}</p>
                <p className="mt-0.5 text-xs text-ink-muted">Mulai {formatIDR(item.starting_price)}</p>
                <div className="mt-3 flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleStatus(item)}
                    className="flex-1 rounded-lg border border-nude-200 py-2 text-xs text-ink-muted hover:text-ink"
                    aria-label="Ubah status publish"
                  >
                    {item.status === 'published' ? <EyeOff size={14} className="mx-auto" /> : <Eye size={14} className="mx-auto" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(item);
                      setShowForm(true);
                    }}
                    className="flex-1 rounded-lg border border-nude-200 py-2 text-xs text-ink-muted hover:text-ink"
                    aria-label="Edit"
                  >
                    <Pencil size={14} className="mx-auto" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="flex-1 rounded-lg border border-nude-200 py-2 text-xs text-rose-gold hover:bg-rose-softgold/20"
                    aria-label="Hapus"
                  >
                    <Trash2 size={14} className="mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <GalleryForm
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

function GalleryForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: GalleryItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState({
    title: initial?.title ?? EMPTY.title,
    category: initial?.category ?? EMPTY.category,
    image_url: initial?.image_url ?? EMPTY.image_url,
    alt_text: initial?.alt_text ?? EMPTY.alt_text,
    duration_minutes: initial?.duration_minutes?.toString() ?? EMPTY.duration_minutes,
    starting_price: initial?.starting_price?.toString() ?? EMPTY.starting_price,
    tags: initial?.tags?.join(', ') ?? EMPTY.tags,
    status: initial?.status ?? EMPTY.status,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleUpload = async (file: File) => {
    setUploading(true);
    setErr(null);
    try {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('gallery').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from('gallery').getPublicUrl(path);
      set('image_url', data.publicUrl);
    } catch {
      setErr('Upload gagal. Pastikan bucket "gallery" sudah dibuat & public.');
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!form.title || !form.category || !form.image_url) {
      setErr('Judul, kategori, dan gambar wajib diisi.');
      return;
    }
    setSaving(true);
    const payload = {
      title: form.title,
      category: form.category,
      image_url: form.image_url,
      alt_text: form.alt_text || null,
      duration_minutes: form.duration_minutes ? Number(form.duration_minutes) : null,
      starting_price: form.starting_price ? Number(form.starting_price) : null,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : null,
      status: form.status,
    };
    const res = initial
      ? await supabase.from('gallery_items').update(payload).eq('id', initial.id)
      : await supabase.from('gallery_items').insert(payload);
    setSaving(false);
    if (res.error) {
      setErr('Gagal menyimpan. Cek koneksi & izin (RLS).');
      return;
    }
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-ink/50" onClick={onClose} aria-label="Tutup" />
      <div className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-soft-lg sm:max-w-lg sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl text-ink">{initial ? 'Edit Desain' : 'Tambah Desain'}</h3>
          <button type="button" onClick={onClose} aria-label="Tutup" className="grid h-9 w-9 place-items-center rounded-xl border border-nude-200 text-ink-muted">
            <X size={16} />
          </button>
        </div>

        <div className="grid gap-3">
          {/* Image */}
          <div>
            <span className="mb-1.5 block text-sm font-medium text-ink">Gambar *</span>
            {form.image_url ? (
              <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-xl bg-ash-100">
                <Image src={form.image_url} alt="Preview" fill className="object-cover" sizes="32rem" />
              </div>
            ) : null}
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-nude-300 bg-nude-50 py-4 text-sm text-ink-muted hover:border-rose-gold">
              {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
              {uploading ? 'Mengunggah…' : 'Upload gambar'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              />
            </label>
            <input
              className="input mt-2"
              placeholder="atau tempel URL gambar"
              value={form.image_url}
              onChange={(e) => set('image_url', e.target.value)}
            />
          </div>

          <Row>
            <Input label="Judul *" value={form.title} onChange={(v) => set('title', v)} />
            <Input label="Kategori *" value={form.category} onChange={(v) => set('category', v)} placeholder="Korean Style" />
          </Row>
          <Row>
            <Input label="Durasi (menit)" value={form.duration_minutes} onChange={(v) => set('duration_minutes', v)} type="number" />
            <Input label="Harga mulai (Rp)" value={form.starting_price} onChange={(v) => set('starting_price', v)} type="number" />
          </Row>
          <Input label="Tags (pisah koma)" value={form.tags} onChange={(v) => set('tags', v)} placeholder="Luxury, Long Nails" />
          <Input label="Alt text (SEO/aksesibilitas)" value={form.alt_text} onChange={(v) => set('alt_text', v)} />

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink">Status</span>
            <select className="input" value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>

          {err ? <p className="text-sm text-rose-gold">{err}</p> : null}

          <button type="button" onClick={save} disabled={saving} className="btn-primary mt-1 w-full">
            {saving ? <Loader2 className="animate-spin" size={18} /> : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      <input className="input" type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
