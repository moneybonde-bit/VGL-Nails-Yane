import { Instagram, MessageCircle, MapPin } from 'lucide-react';
import { siteConfig, waLink, mapsLink } from '@/lib/site-config';

// TikTok has no Lucide glyph — small inline SVG.
function TiktokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 3c.3 2.1 1.6 3.8 3.7 4.1v2.6c-1.3.1-2.6-.3-3.7-1v6.6c0 3.4-2.7 6.1-6.1 6.1S4.3 18.7 4.3 15.3 7 9.2 10.4 9.2c.3 0 .6 0 .9.1v2.7c-.3-.1-.6-.1-.9-.1-1.9 0-3.4 1.5-3.4 3.4s1.5 3.4 3.4 3.4 3.4-1.5 3.4-3.4V3h2.7z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-nude-100 bg-cream">
      <div className="container-px py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="font-display text-xl font-extrabold text-ink">
              VGL<span className="text-rose-gold"> Nails</span>
            </p>
            <p className="mt-3 max-w-xs text-sm text-ink-muted">{siteConfig.description}</p>
            <div className="mt-5 flex gap-2">
              <a
                href={siteConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram VGL Nails"
                className="grid h-11 w-11 place-items-center rounded-xl border border-nude-200 bg-white text-ink transition-colors hover:text-rose-gold"
              >
                <Instagram size={18} />
              </a>
              <a
                href={siteConfig.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok VGL Nails"
                className="grid h-11 w-11 place-items-center rounded-xl border border-nude-200 bg-white text-ink transition-colors hover:text-rose-gold"
              >
                <TiktokIcon />
              </a>
              <a
                href={waLink()}
                aria-label="WhatsApp VGL Nails"
                className="grid h-11 w-11 place-items-center rounded-xl border border-nude-200 bg-white text-ink transition-colors hover:text-rose-gold"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Jam Operasional</h3>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
              {siteConfig.hours.map((h) => (
                <li key={h.day}>
                  {h.day}
                  <br />
                  <span className="text-ink">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Alamat</h3>
            <p className="mt-3 text-sm text-ink-muted">{siteConfig.address.full}</p>
            <a
              href={mapsLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-rose-gold"
            >
              <MapPin size={15} /> Lihat di Maps
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-nude-100 pt-6 text-xs text-ink-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Semua hak dilindungi.
          </p>
          <p>Bahodopi, Morowali · Sulawesi Tengah</p>
        </div>
      </div>
      {/* Spacer so mobile sticky CTA never covers footer content */}
      <div className="h-20 md:hidden" />
    </footer>
  );
}
