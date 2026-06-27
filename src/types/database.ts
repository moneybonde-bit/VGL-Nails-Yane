/**
 * Hand-written DB types that mirror supabase/migrations/0001_init.sql.
 * If you change the schema, regenerate with:
 *   npx supabase gen types typescript --project-id YOUR_REF > src/types/database.ts
 */

export type GalleryStatus = 'published' | 'draft';

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  image_url: string;
  alt_text: string | null;
  duration_minutes: number | null;
  starting_price: number | null;
  tags: string[] | null;
  status: GalleryStatus;
  sort_order: number;
  created_at: string;
}

export type Service = {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number | null;
  price: number | null;
  icon: string | null; // lucide icon name
  sort_order: number;
  is_active: boolean;
}

export type PricingTier = {
  id: string;
  name: string; // Basic / Premium / Luxury
  price: number;
  highlight: boolean;
  features: string[];
  sort_order: number;
}

export type PricingAddon = {
  id: string;
  name: string; // Nail art / Extension / Repair
  price_from: number;
  sort_order: number;
}

export type Testimonial = {
  id: string;
  customer_name: string;
  avatar_url: string | null;
  rating: number; // 1..5
  comment: string;
  is_published: boolean;
  sort_order: number;
}

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
}

export type Booking = {
  id: string;
  name: string;
  whatsapp: string;
  preferred_date: string; // YYYY-MM-DD
  preferred_time: string | null; // HH:mm
  service: string | null;
  notes: string | null;
  reference_url: string | null;
  status: 'new' | 'confirmed' | 'done' | 'cancelled';
  created_at: string;
}

export type NewBooking = Omit<Booking, 'id' | 'status' | 'created_at'>;

/**
 * Database shape for @supabase/supabase-js generic typing.
 * Each table includes `Relationships: []` and the schema includes empty
 * Views/Functions/Enums/CompositeTypes so it matches the GenericSchema shape
 * expected by @supabase/postgrest-js (otherwise table types resolve to `never`).
 */
type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      gallery_items: Table<GalleryItem>;
      services: Table<Service>;
      pricing_tiers: Table<PricingTier>;
      pricing_addons: Table<PricingAddon>;
      testimonials: Table<Testimonial>;
      faq_items: Table<FaqItem>;
      bookings: Table<Booking, NewBooking>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
