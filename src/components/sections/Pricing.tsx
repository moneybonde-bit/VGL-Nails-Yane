'use client';

import { Check, Plus } from 'lucide-react';
import type { PricingAddon, PricingTier } from '@/types/database';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { useBooking } from '@/store/booking';
import { formatIDR } from '@/utils/format';

export function Pricing({ tiers, addons }: { tiers: PricingTier[]; addons: PricingAddon[] }) {
  const { open } = useBooking();

  return (
    <section id="pricing" className="section-y bg-nude-50">
      <div className="container-px">
        <SectionHeading
          eyebrow="Harga"
          title="Paket yang transparan"
          subtitle="Pilih paket sesuai kebutuhan. Harga akhir menyesuaikan desain dan panjang kuku."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.06}>
              <div
                className={
                  'relative flex h-full flex-col rounded-3xl border p-6 ' +
                  (t.highlight
                    ? 'border-rose-gold bg-white shadow-soft-lg'
                    : 'border-nude-100 bg-white shadow-soft')
                }
              >
                {t.highlight ? (
                  <span className="absolute -top-3 left-6 rounded-full bg-rose-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                    Paling populer
                  </span>
                ) : null}
                <h3 className="text-lg text-ink">{t.name}</h3>
                <p className="mt-2">
                  <span className="text-3xl font-bold text-ink">{formatIDR(t.price)}</span>
                </p>
                <ul className="mt-5 grid gap-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-ink-muted">
                      <Check size={17} className="mt-0.5 shrink-0 text-rose-gold" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => open(`Paket ${t.name}`)}
                  className={
                    'mt-6 ' + (t.highlight ? 'btn-primary w-full' : 'btn-secondary w-full')
                  }
                >
                  Pilih {t.name}
                </button>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Add-ons */}
        <Reveal delay={0.1}>
          <div className="mt-6 rounded-3xl border border-nude-100 bg-white p-6">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
              Tambahan
            </h4>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {addons.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-3 rounded-2xl bg-nude-50 px-4 py-3 text-sm"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-rose-gold">
                    <Plus size={15} />
                  </span>
                  <span className="text-ink">{a.name}</span>
                  <span className="ml-auto whitespace-nowrap font-semibold text-ink">
                    {formatIDR(a.price_from)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
