'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { PricingTier, PricingAddon } from '@/types/database';
import { formatIDR } from '@/utils/format';
import { AdminHeader, Modal, Row, Field, TextArea, Toggle, SaveButton, Loading, EmptyState } from '@/components/admin/ui';

export default function AdminPricingPage() {
  const supabase = createClient();
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [addons, setAddons] = useState<PricingAddon[]>([]);
  const [loading, setLoading] = useState(true);
  const [tierForm, setTierForm] = useState<{ open: boolean; initial: PricingTier | null }>({ open: false, initial: null });
  const [addonForm, setAddonForm] = useState<{ open: boolean; initial: PricingAddon | null }>({ open: false, initial: null });

  const load = useCallback(async () => {
    setLoading(true);
    const [t, a] = await Promise.all([
      supabase.from('pricing_tiers').select('*').order('sort_order', { ascending: true }),
      supabase.from('pricing_addons').select('*').order('sort_order', { ascending: true }),
    ]);
    setTiers(t.data ?? []);
    setAddons(a.data ?? []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const removeTier = async (id: string) => {
    if (!confirm('Hapus paket ini?')) return;
    await supabase.from('pricing_tiers').delete().eq('id', id);
    load();
  };
  const removeAddon = async (id: string) => {
    if (!confirm('Hapus add-on ini?')) return;
    await supabase.from('pricing_addons').delete().eq('id', id);
    load();
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-10">
      <section>
        <AdminHeader
          title="Paket Harga"
          subtitle="Basic / Premium / Luxury yang tampil di bagian Pricing."
          action={
            <button type="button" onClick={() => setTierForm({ open: true, initial: null })} className="btn-primary h-11 px-5 text-sm">
              <Plus size={18} /> Tambah paket
            </button>
          }
        />
        {tiers.length === 0 ? (
          <EmptyState>Belum ada paket harga.</EmptyState>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {tiers.map((t) => (
              <div key={t.id} className="rounded-2xl border border-nude-100 bg-white p-4">
                <div className="flex items-center justify-between">
                  <p className="font-display text-lg font-bold text-ink">{t.name}</p>
                  {t.highlight ? <Star size={16} className="fill-rose-gold text-rose-gold" /> : null}
                </div>
                <p className="mt-1 text-rose-gold">{formatIDR(t.price)}</p>
                <ul className="mt-2 space-y-1 text-xs text-ink-muted">
                  {t.features.map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                </ul>
                <div className="mt-3 flex gap-1.5">
                  <SmallBtn onClick={() => setTierForm({ open: true, initial: t })}>
                    <Pencil size={14} className="mx-auto" />
                  </SmallBtn>
                  <SmallBtn danger onClick={() => removeTier(t.id)}>
                    <Trash2 size={14} className="mx-auto" />
                  </SmallBtn>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <AdminHeader
          title="Add-on"
          subtitle="Tambahan seperti nail art, extension, repair."
          action={
            <button type="button" onClick={() => setAddonForm({ open: true, initial: null })} className="btn-primary h-11 px-5 text-sm">
              <Plus size={18} /> Tambah add-on
            </button>
          }
        />
        {addons.length === 0 ? (
          <EmptyState>Belum ada add-on.</EmptyState>
        ) : (
          <div className="mt-6 space-y-3">
            {addons.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 rounded-2xl border border-nude-100 bg-white p-4">
                <div>
                  <p className="font-semibold text-ink">{a.name}</p>
                  <p className="text-xs text-ink-muted">Mulai {formatIDR(a.price_from)}</p>
                </div>
                <div className="flex gap-1.5">
                  <SmallBtn onClick={() => setAddonForm({ open: true, initial: a })}>
                    <Pencil size={14} className="mx-auto" />
                  </SmallBtn>
                  <SmallBtn danger onClick={() => removeAddon(a.id)}>
                    <Trash2 size={14} className="mx-auto" />
                  </SmallBtn>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {tierForm.open ? (
        <TierForm
          initial={tierForm.initial}
          onClose={() => setTierForm({ open: false, initial: null })}
          onSaved={() => {
            setTierForm({ open: false, initial: null });
            load();
          }}
        />
      ) : null}

      {addonForm.open ? (
        <AddonForm
          initial={addonForm.initial}
          onClose={() => setAddonForm({ open: false, initial: null })}
          onSaved={() => {
            setAddonForm({ open: false, initial: null });
            load();
          }}
        />
      ) : null}
    </div>
  );
}

function SmallBtn({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'flex-1 rounded-lg border border-nude-200 py-2 text-xs ' +
        (danger ? 'text-rose-gold hover:bg-rose-softgold/20' : 'text-ink-muted hover:text-ink')
      }
    >
      {children}
    </button>
  );
}

function TierForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: PricingTier | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    price: initial?.price?.toString() ?? '',
    features: initial?.features?.join('\n') ?? '',
    highlight: initial?.highlight ?? false,
    sort_order: initial?.sort_order?.toString() ?? '0',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const save = async () => {
    if (!form.name || !form.price) {
      setErr('Nama dan harga wajib diisi.');
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      price: Number(form.price),
      features: form.features.split('\n').map((s) => s.trim()).filter(Boolean),
      highlight: form.highlight,
      sort_order: Number(form.sort_order) || 0,
    };
    const res = initial
      ? await supabase.from('pricing_tiers').update(payload).eq('id', initial.id)
      : await supabase.from('pricing_tiers').insert(payload);
    setSaving(false);
    if (res.error) {
      setErr('Gagal menyimpan. Cek izin (RLS).');
      return;
    }
    onSaved();
  };

  return (
    <Modal title={initial ? 'Edit Paket' : 'Tambah Paket'} onClose={onClose}>
      <Row>
        <Field label="Nama *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Premium" />
        <Field label="Harga (Rp) *" type="number" value={form.price} onChange={(v) => setForm((f) => ({ ...f, price: v }))} />
      </Row>
      <TextArea
        label="Fitur (satu per baris)"
        value={form.features}
        onChange={(v) => setForm((f) => ({ ...f, features: v }))}
        rows={4}
        placeholder={'Soft gel extension\n2–3 aksen nail art'}
      />
      <Row>
        <div className="flex items-end pb-2">
          <Toggle label="Tandai populer" checked={form.highlight} onChange={(v) => setForm((f) => ({ ...f, highlight: v }))} />
        </div>
        <Field label="Urutan" type="number" value={form.sort_order} onChange={(v) => setForm((f) => ({ ...f, sort_order: v }))} />
      </Row>
      {err ? <p className="text-sm text-rose-gold">{err}</p> : null}
      <SaveButton saving={saving} onClick={save} />
    </Modal>
  );
}

function AddonForm({
  initial,
  onClose,
  onSaved,
}: {
  initial: PricingAddon | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    price_from: initial?.price_from?.toString() ?? '',
    sort_order: initial?.sort_order?.toString() ?? '0',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const save = async () => {
    if (!form.name || !form.price_from) {
      setErr('Nama dan harga wajib diisi.');
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      price_from: Number(form.price_from),
      sort_order: Number(form.sort_order) || 0,
    };
    const res = initial
      ? await supabase.from('pricing_addons').update(payload).eq('id', initial.id)
      : await supabase.from('pricing_addons').insert(payload);
    setSaving(false);
    if (res.error) {
      setErr('Gagal menyimpan. Cek izin (RLS).');
      return;
    }
    onSaved();
  };

  return (
    <Modal title={initial ? 'Edit Add-on' : 'Tambah Add-on'} onClose={onClose}>
      <Field label="Nama *" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="Tambahan nail art (per kuku)" />
      <Row>
        <Field label="Harga mulai (Rp) *" type="number" value={form.price_from} onChange={(v) => setForm((f) => ({ ...f, price_from: v }))} />
        <Field label="Urutan" type="number" value={form.sort_order} onChange={(v) => setForm((f) => ({ ...f, sort_order: v }))} />
      </Row>
      {err ? <p className="text-sm text-rose-gold">{err}</p> : null}
      <SaveButton saving={saving} onClick={save} />
    </Modal>
  );
}
