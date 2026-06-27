import {
  Sparkles,
  Hand,
  Palette,
  Gem,
  Flower2,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import type { Service } from '@/types/database';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { formatIDR, formatDuration } from '@/utils/format';

const ICONS: Record<string, LucideIcon> = {
  Sparkles,
  Hand,
  Palette,
  Gem,
  Flower2,
  Wrench,
};

export function Services({ services }: { services: Service[] }) {
  return (
    <section id="services" className="section-y">
      <div className="container-px">
        <SectionHeading
          eyebrow="Layanan"
          title="Apa yang bisa kami buat untukmu"
          subtitle="Setiap layanan dikerjakan dengan teliti, produk berkualitas, dan hasil yang rapi."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = (s.icon && ICONS[s.icon]) || Sparkles;
            return (
              <Reveal key={s.id} delay={i * 0.05}>
                <article className="card h-full p-6 transition-shadow duration-300 hover:shadow-soft-lg">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-nude-50 text-rose-gold">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-4 text-lg text-ink">{s.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.description}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-nude-100 pt-4 text-sm">
                    <span className="text-ink-muted">{formatDuration(s.duration_minutes)}</span>
                    <span className="font-semibold text-ink">Mulai {formatIDR(s.price)}</span>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
