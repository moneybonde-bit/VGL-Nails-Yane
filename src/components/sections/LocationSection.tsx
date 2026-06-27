import { MapPin, Clock, ExternalLink } from 'lucide-react';
import { siteConfig, mapsLink, mapsEmbed } from '@/lib/site-config';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';

export function LocationSection() {
  return (
    <section id="location" className="section-y bg-nude-50">
      <div className="container-px">
        <SectionHeading eyebrow="Lokasi" title="Temukan kami" />

        <div className="mt-10 grid gap-4 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="flex h-full flex-col justify-center rounded-3xl border border-nude-100 bg-white p-6">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-nude-50 text-rose-gold">
                  <MapPin size={20} />
                </span>
                <div>
                  <h3 className="text-lg text-ink">Alamat</h3>
                  <p className="mt-1 text-sm text-ink-muted">{siteConfig.address.full}</p>
                </div>
              </div>

              <div className="mt-6 flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-nude-50 text-rose-gold">
                  <Clock size={20} />
                </span>
                <div>
                  <h3 className="text-lg text-ink">Jam operasional</h3>
                  <ul className="mt-1 space-y-1 text-sm text-ink-muted">
                    {siteConfig.hours.map((h) => (
                      <li key={h.day} className="flex justify-between gap-6">
                        <span>{h.day}</span>
                        <span className="text-ink">{h.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <a
                href={mapsLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-6 w-full"
              >
                Buka Google Maps <ExternalLink size={16} />
              </a>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-3">
            <div className="h-full overflow-hidden rounded-3xl border border-nude-100 bg-white shadow-soft">
              <iframe
                title="Peta lokasi VGL Nails"
                src={mapsEmbed()}
                className="h-[320px] w-full lg:h-full"
                style={{ border: 0, minHeight: 320 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
