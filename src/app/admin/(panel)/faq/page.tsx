'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { FaqItem } from '@/types/database';
import { AdminHeader, Modal, Row, Field, TextArea, SaveButton, Loading, EmptyState } from '@/components/admin/ui';

export default function AdminFaqPage() {
  const supabase = createClient();
  const [rows, setRows] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('faq_items').select('*').order('sort_order', { ascending: true });
    setRows(data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm('Hapus pertanyaan ini?')) return;
    await supabase.from('faq_items').delete().eq('id', id);
    load();
  };
  const toggle = async (f: FaqItem) => {
    await supabase.from('faq_items').update({ is_published: !f.is_published }).eq('id', f.id);
    load();
  };

  return (
    <div>
      <AdminHeader
        title="FAQ"
        subtitle="Pertanyaan yang sering diajukan pelanggan."
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
        <EmptyState>Belum ada FAQ.</EmptyState>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((f) => (
            <div key={f.id} className="flex items-start justify-between gap-3 rounded-2xl border border-nude-100 bg-white p-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-ink">{f.question}</p>
                  {!f.is_published ? (
                    <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[11px] text-ink-muted">draft</span>
                  ) : null}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-ink-muted">{f.answer}</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <IconBtn label="Publish/Draft" onClick={() => toggle(f)}>
                  {f.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                </IconBtn>
                <IconBtn
                  label="Edit"
                  onClick={() => {
                    setEditing(f);
                    setShowForm(true);
                  }}
                >
                  <Pencil size={14} />
                </IconBtn>
                <IconBtn label="Hapus" danger onClick={() => remove(f.id)}>
                  <Trash2 size={14} />
                </IconBtn>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <FaqForm
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

function FaqForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: FaqItem | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState({
    question: initial?.question ?? '',
    answer: initial?.answer ?? '',
    sort_order: initial?.sort_order?.toString() ?? '0',
    is_published: initial?.is_published ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const save = async () => {
    if (!form.question || !form.answer) {
      setErr('Pertanyaan dan jawaban wajib diisi.');
      return;
    }
    setSaving(true);
    const payload = {
      question: form.question,
      answer: form.answer,
      sort_order: Number(form.sort_order) || 0,
      is_published: form.is_published,
    };
    const res = initial
      ? await supabase.from('faq_items').update(payload).eq('id', initial.id)
      : await supabase.from('faq_items').insert(payload);
    setSaving(false);
    if (res.error) {
      setErr('Gagal menyimpan. Cek izin (RLS).');
      return;
    }
    onSaved();
  };

  return (
    <Modal title={initial ? 'Edit FAQ' : 'Tambah FAQ'} onClose={onClose}>
      <Field label="Pertanyaan *" value={form.question} onChange={(v) => setForm((f) => ({ ...f, question: v }))} />
      <TextArea label="Jawaban *" value={form.answer} onChange={(v) => setForm((f) => ({ ...f, answer: v }))} rows={4} />
      <Row>
        <label className="flex items-end pb-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
            className="mr-2 h-4 w-4 accent-rose-gold"
          />
          Tampilkan
        </label>
        <Field label="Urutan" type="number" value={form.sort_order} onChange={(v) => setForm((f) => ({ ...f, sort_order: v }))} />
      </Row>
      {err ? <p className="text-sm text-rose-gold">{err}</p> : null}
      <SaveButton saving={saving} onClick={save} />
    </Modal>
  );
}
