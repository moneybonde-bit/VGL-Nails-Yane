'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import type { Testimonial } from '@/types/database';
import { SectionHeading } from '@/components/ui/SectionHeading';

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="w-[300px] shrink-0 rounded-3xl border border-nude-100 bg-white p-6 shadow-soft sm:w-[360px]">
      <div className="flex items-center gap-1 text-rose-gold" aria-label={`Rating ${t.rating} dari 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={15} className={i < t.rating ? 'fill-rose-gold' : 'opacity-25'} />
        ))}
      </div>
      <blockquote className="mt-3 text-sm leading-relaxed text-ink">“{t.comment}”</blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        {t.avatar_url ? (
          <Image
            src={t.avatar_url}
            alt={t.customer_name}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="grid h-10 w-10 place-items-center rounded-full bg-nude-100 text-sm font-semibold text-rose-gold">
            {t.customer_name.charAt(0)}
          </span>
        )}
        <span className="text-sm font-semibold text-ink">{t.customer_name}</span>
      </figcaption>
    </figure>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  // Duplicate the list so the marquee loops seamlessly.
  const loop = [...items, ...items];

  return (
    <section id="testimonials" className="section-y overflow-hidden">
      <div className="container-px">
        <SectionHeading
          eyebrow="Testimoni"
          title="Kata mereka tentang VGL Nails"
          subtitle="Kepercayaan pelanggan adalah hal yang paling kami jaga."
        />
      </div>

      <div
        className="group relative mt-10"
        style={{
          maskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
        }}
      >
        <div className="marquee flex w-max gap-4 px-5">
          {loop.map((t, i) => (
            <Card key={`${t.id}-${i}`} t={t} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .marquee {
          animation: scroll 32s linear infinite;
        }
        .group:hover .marquee {
          animation-play-state: paused;
        }
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee {
            animation: none;
            overflow-x: auto;
          }
        }
      `}</style>
    </section>
  );
}
