'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2 } from 'lucide-react';
import { useBooking } from '@/store/booking';
import { createClient } from '@/lib/supabase/client';
import { siteConfig, waLink } from '@/lib/site-config';

const SERVICES = [
  'Gel Polish',
  'Soft Gel Extension',
  'Nail Art Custom',
  'Korean Style Set',
  'Manicure & Care',
  'Nail Repair',
  'Lainnya',
];

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function BookingForm() {
  const { isOpen, close, presetService } = useBooking();
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({
    name: '',
    whatsapp: '',
    preferred_date: '',
    preferred_time: '',
    service: presetService ?? SERVICES[0] ?? '',
    notes: '',
    reference_url: '',
  });

  useEffect(() => {
    if (presetService) setForm((f) => ({ ...f, service: presetService }));
  }, [presetService]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape (a11y)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    if (isOpen) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, close]);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.whatsapp || !form.preferred_date) {
      setStatus('error');
      return;
    }
    setStatus('submitting');
    try {
      const supabase = createClient();
      const { error } = await supabase.from('bookings').insert({
        name: form.name,
        whatsapp: form.whatsapp,
        preferred_date: form.preferred_date,
        preferred_time: form.preferred_time || null,
        service: form.service || null,
        notes: form.notes || null,
        reference_url: form.reference_url || null,
      });
      if (error) throw error;
      setStatus('success');
    } catch {
      // If DB isn't configured yet, still let the user reach us via WhatsApp.
      setStatus('error');
    }
  };

  const waMessage = `Halo ${siteConfig.name}, saya mau booking.%0A%0ANama: ${form.name}%0ATanggal: ${form.preferred_date} ${form.preferred_time}%0ALayanan: ${form.service}%0ACatatan: ${form.notes}`;

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Form booking"
        >
          <button
            type="button"
            aria-label="Tutup"
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={close}
          />
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-soft-lg sm:max-w-lg sm:rounded-3xl"
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h3 className="text-2xl text-ink">Book Appointment</h3>
                <p className="mt-1 text-sm text-ink-muted">
                  Isi data, kami konfirmasi jadwal lewat WhatsApp.
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Tutup form"
                className="grid h-10 w-10 place-items-center rounded-xl border border-nude-200 text-ink-muted hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            {status === 'success' ? (
              <div className="py-8 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rose-softgold/40 text-rose-gold">
                  <Check />
                </div>
                <h4 className="mt-4 text-xl text-ink">Booking terkirim!</h4>
                <p className="mt-2 text-sm text-ink-muted">
                  Terima kasih, {form.name}. Kami akan menghubungimu via WhatsApp untuk konfirmasi.
                </p>
                <a href={waLink()} className="btn-secondary mt-5 w-full">
                  Chat WhatsApp sekarang
                </a>
              </div>
            ) : (
              <div className="grid gap-4">
                <Field label="Nama" required>
                  <input
                    className="input"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="Nama lengkap"
                  />
                </Field>
                <Field label="Nomor WhatsApp" required>
                  <input
                    className="input"
                    inputMode="tel"
                    value={form.whatsapp}
                    onChange={(e) => set('whatsapp', e.target.value)}
                    placeholder="08xxxxxxxxxx"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Tanggal" required>
                    <input
                      type="date"
                      className="input"
                      value={form.preferred_date}
                      onChange={(e) => set('preferred_date', e.target.value)}
                    />
                  </Field>
                  <Field label="Jam">
                    <input
                      type="time"
                      className="input"
                      value={form.preferred_time}
                      onChange={(e) => set('preferred_time', e.target.value)}
                    />
                  </Field>
                </div>
                <Field label="Jenis layanan">
                  <select
                    className="input"
                    value={form.service}
                    onChange={(e) => set('service', e.target.value)}
                  >
                    {SERVICES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Catatan / referensi (opsional)">
                  <textarea
                    className="input min-h-[80px] resize-y"
                    value={form.notes}
                    onChange={(e) => set('notes', e.target.value)}
                    placeholder="Contoh: warna nude, panjang sedang, ada foto referensi"
                  />
                </Field>
                <Field label="Link foto referensi (opsional)">
                  <input
                    className="input"
                    value={form.reference_url}
                    onChange={(e) => set('reference_url', e.target.value)}
                    placeholder="https://... (Google Drive / Instagram)"
                  />
                </Field>

                {status === 'error' ? (
                  <p className="text-sm text-rose-gold">
                    Pastikan Nama, WhatsApp, dan Tanggal terisi. Atau langsung{' '}
                    <a className="font-semibold underline" href={`${waLink()}?text=${waMessage}`}>
                      booking via WhatsApp
                    </a>
                    .
                  </p>
                ) : null}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={status === 'submitting'}
                  className="btn-primary mt-1 w-full"
                >
                  {status === 'submitting' ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> Mengirim…
                    </>
                  ) : (
                    'Kirim Booking'
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label} {required ? <span className="text-rose-gold">*</span> : null}
      </span>
      {children}
    </label>
  );
}
