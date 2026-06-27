/**
 * Single source of truth for business / contact info.
 * Edit these values once and they propagate across the whole site
 * (header, footer, sticky CTA, WhatsApp links, SEO/JSON-LD).
 */
export const siteConfig = {
  name: 'VGL Nails',
  tagline: 'Beautiful Nails, Beautiful Confidence',
  description:
    'Studio nail art premium di Bahodopi, Morowali. Gel nails, soft gel, extension, Korean style, dan custom design dengan hasil rapi dan tahan lama. Booking mudah lewat WhatsApp.',
  // Full address
  address: {
    street: 'Bahodopi',
    locality: 'Morowali',
    region: 'Sulawesi Tengah',
    country: 'ID',
    full: 'Bahodopi, Kabupaten Morowali, Sulawesi Tengah, Indonesia',
  },
  // Approx coordinates for Bahodopi, Morowali (adjust to exact studio location)
  geo: { lat: -2.8167, lng: 122.1333 },
  // Contact — use international format WITHOUT leading 0 or "+" for wa.me
  whatsapp: '6281234567890', // TODO: ganti dengan nomor WhatsApp asli
  whatsappDisplay: '+62 812-3456-7890',
  email: 'hello@vglnails.id',
  hours: [
    { day: 'Senin – Jumat', time: '09.00 – 20.00 WITA' },
    { day: 'Sabtu', time: '09.00 – 21.00 WITA' },
    { day: 'Minggu', time: '10.00 – 18.00 WITA' },
  ],
  socials: {
    instagram: 'https://instagram.com/vglnails',
    instagramHandle: '@vglnails',
    tiktok: 'https://tiktok.com/@vglnails',
    tiktokHandle: '@vglnails',
  },
  // Google Maps query — used for embed + "Buka di Maps" button
  mapsQuery: 'VGL Nails Bahodopi Morowali',
} as const;

export const waLink = (message?: string) =>
  `https://wa.me/${siteConfig.whatsapp}${
    message ? `?text=${encodeURIComponent(message)}` : ''
  }`;

export const mapsLink = () =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.mapsQuery)}`;

export const mapsEmbed = () =>
  `https://www.google.com/maps?q=${encodeURIComponent(siteConfig.mapsQuery)}&output=embed`;
