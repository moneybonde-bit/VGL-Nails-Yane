import type {
  FaqItem,
  GalleryItem,
  PricingAddon,
  PricingTier,
  Service,
  Testimonial,
} from '@/types/database';

/**
 * Fallback content used when Supabase is not yet configured (or a table is empty).
 * The same content is inserted by supabase/migrations/0001_init.sql so the live
 * site and the local preview look identical out of the box.
 * Replace the Unsplash placeholder photos with your own studio photos.
 */

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`;

export const fallbackGallery: GalleryItem[] = [
  { id: '1', title: 'Soft Glam French', category: 'French', image_url: u('1604654894610-df63bc536371'), alt_text: 'French nails nuansa nude', duration_minutes: 90, starting_price: 150000, tags: ['Simple', 'Short Nails'], status: 'published', sort_order: 1, created_at: '' },
  { id: '2', title: 'Korean Milky Gel', category: 'Korean Style', image_url: u('1632345031435-8727f6897d53'), alt_text: 'Gel nails ala Korea warna milky', duration_minutes: 120, starting_price: 200000, tags: ['Gel', 'Luxury'], status: 'published', sort_order: 2, created_at: '' },
  { id: '3', title: 'Chrome Rose', category: 'Chrome', image_url: u('1519014816548-bf5fe059798b'), alt_text: 'Chrome nails warna rose gold', duration_minutes: 120, starting_price: 220000, tags: ['Luxury', 'Long Nails'], status: 'published', sort_order: 3, created_at: '' },
  { id: '4', title: 'Wedding Pearl', category: 'Wedding', image_url: u('1600948836101-f9ffda59d250'), alt_text: 'Nail art pernikahan dengan mutiara', duration_minutes: 150, starting_price: 300000, tags: ['Wedding', 'Luxury'], status: 'published', sort_order: 4, created_at: '' },
  { id: '5', title: 'Cat Eye Galaxy', category: 'Cat Eye', image_url: u('1607779097040-26e80aa78e66'), alt_text: 'Cat eye nail art efek galaxy', duration_minutes: 120, starting_price: 230000, tags: ['Luxury', 'Long Nails'], status: 'published', sort_order: 5, created_at: '' },
  { id: '6', title: 'Minimal Nude', category: 'Simple', image_url: u('1522337660859-02fbefca4702'), alt_text: 'Desain kuku minimalis nude', duration_minutes: 60, starting_price: 120000, tags: ['Simple', 'Short Nails'], status: 'published', sort_order: 6, created_at: '' },
  { id: '7', title: 'Glitter Ombre', category: 'Ombre', image_url: u('1610992015732-2449b76344bc'), alt_text: 'Ombre glitter pink', duration_minutes: 110, starting_price: 200000, tags: ['Glitter'], status: 'published', sort_order: 7, created_at: '' },
  { id: '8', title: 'Character Art', category: 'Character', image_url: u('1632344004415-bb22fa8ee32a'), alt_text: 'Nail art karakter custom', duration_minutes: 140, starting_price: 250000, tags: ['Character', 'Long Nails'], status: 'published', sort_order: 8, created_at: '' },
];

export const fallbackServices: Service[] = [
  { id: '1', name: 'Gel Polish', description: 'Cat kuku gel tahan lama, kilap maksimal hingga 3 minggu.', duration_minutes: 60, price: 120000, icon: 'Sparkles', sort_order: 1, is_active: true },
  { id: '2', name: 'Soft Gel Extension', description: 'Perpanjangan kuku ringan dan natural, nyaman dipakai harian.', duration_minutes: 120, price: 220000, icon: 'Hand', sort_order: 2, is_active: true },
  { id: '3', name: 'Nail Art Custom', description: 'Desain sesuai keinginan — dari simple hingga detail mewah.', duration_minutes: 120, price: 180000, icon: 'Palette', sort_order: 3, is_active: true },
  { id: '4', name: 'Korean Style Set', description: 'Tampilan bersih ala salon Korea: glossy, rapi, elegan.', duration_minutes: 120, price: 230000, icon: 'Gem', sort_order: 4, is_active: true },
  { id: '5', name: 'Manicure & Care', description: 'Perawatan kutikula dan pelembap agar kuku sehat.', duration_minutes: 45, price: 90000, icon: 'Flower2', sort_order: 5, is_active: true },
  { id: '6', name: 'Nail Repair', description: 'Perbaikan kuku patah atau lepas dengan cepat.', duration_minutes: 30, price: 40000, icon: 'Wrench', sort_order: 6, is_active: true },
];

export const fallbackPricing: PricingTier[] = [
  { id: '1', name: 'Basic', price: 120000, highlight: false, features: ['Gel polish 1 warna', 'Bentuk & rapikan kuku', 'Base & top coat', 'Tahan ±2 minggu'], sort_order: 1 },
  { id: '2', name: 'Premium', price: 220000, highlight: true, features: ['Semua di Basic', 'Soft gel extension', '2–3 aksen nail art', 'Konsultasi desain'], sort_order: 2 },
  { id: '3', name: 'Luxury', price: 350000, highlight: false, features: ['Semua di Premium', 'Full custom design', 'Chrome / cat eye / mutiara', 'Prioritas booking'], sort_order: 3 },
];

export const fallbackAddons: PricingAddon[] = [
  { id: '1', name: 'Tambahan nail art (per kuku)', price_from: 10000, sort_order: 1 },
  { id: '2', name: 'Tambahan extension (per set)', price_from: 80000, sort_order: 2 },
  { id: '3', name: 'Repair / perbaikan (per kuku)', price_from: 15000, sort_order: 3 },
];

export const fallbackTestimonials: Testimonial[] = [
  { id: '1', customer_name: 'Dinda P.', avatar_url: u('1494790108377-be9c29b29330'), rating: 5, comment: 'Hasilnya rapi banget dan tahan lama. Tempatnya nyaman, mbaknya ramah!', is_published: true, sort_order: 1 },
  { id: '2', customer_name: 'Sarah W.', avatar_url: u('1438761681033-6461ffad8d80'), rating: 5, comment: 'Korean style-nya juara. Persis seperti referensi yang aku kasih.', is_published: true, sort_order: 2 },
  { id: '3', customer_name: 'Nabila R.', avatar_url: u('1534528741775-53994a69daeb'), rating: 5, comment: 'Booking gampang lewat WhatsApp, on time, hasil memuaskan banget.', is_published: true, sort_order: 3 },
  { id: '4', customer_name: 'Kirana M.', avatar_url: u('1517841905240-472988babdf9'), rating: 4, comment: 'Desain wedding-ku cantik dan elegan. Recommended buat acara spesial.', is_published: true, sort_order: 4 },
];

export const fallbackFaq: FaqItem[] = [
  { id: '1', question: 'Berapa lama waktu pengerjaan?', answer: 'Tergantung layanan: gel polish ±60 menit, extension & nail art custom 2–2,5 jam. Estimasi waktu tertera di setiap desain galeri.', sort_order: 1, is_published: true },
  { id: '2', question: 'Bagaimana cara booking?', answer: 'Klik tombol Book Now / WhatsApp, atau isi form booking di website. Kami konfirmasi jadwal lewat WhatsApp.', sort_order: 2, is_published: true },
  { id: '3', question: 'Apakah menerima custom design?', answer: 'Tentu! Kirim foto referensi saat booking, dan kami bantu wujudkan sedekat mungkin dengan keinginanmu.', sort_order: 3, is_published: true },
  { id: '4', question: 'Berapa lama ketahanan gel?', answer: 'Gel polish umumnya tahan 2–3 minggu, extension bisa lebih lama dengan perawatan yang tepat.', sort_order: 4, is_published: true },
  { id: '5', question: 'Apakah aman untuk kuku?', answer: 'Kami pakai produk berkualitas dan teknik aplikasi yang benar agar kuku asli tetap sehat.', sort_order: 5, is_published: true },
];
