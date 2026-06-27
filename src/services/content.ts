import { createClient } from '@/lib/supabase/server';
import {
  fallbackAddons,
  fallbackFaq,
  fallbackGallery,
  fallbackPricing,
  fallbackServices,
  fallbackTestimonials,
} from '@/lib/data/fallback';
import type {
  FaqItem,
  GalleryItem,
  PricingAddon,
  PricingTier,
  Service,
  Testimonial,
} from '@/types/database';

/**
 * Each getter tries Supabase first. If env vars are missing, the request errors,
 * or the table is empty, it falls back to bundled seed content so the site never
 * renders blank. This keeps local preview working before you connect a database.
 */

const hasSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function safeQuery<T>(
  run: (db: Awaited<ReturnType<typeof createClient>>) => PromiseLike<{ data: T[] | null; error: unknown }>,
  fallback: T[],
): Promise<T[]> {
  if (!hasSupabase) return fallback;
  try {
    const db = await createClient();
    const { data, error } = await run(db);
    if (error || !data || data.length === 0) return fallback;
    return data;
  } catch {
    return fallback;
  }
}

export const getGallery = () =>
  safeQuery<GalleryItem>(
    (db) =>
      db
        .from('gallery_items')
        .select('*')
        .eq('status', 'published')
        .order('sort_order', { ascending: true }),
    fallbackGallery,
  );

export const getServices = () =>
  safeQuery<Service>(
    (db) =>
      db.from('services').select('*').eq('is_active', true).order('sort_order', { ascending: true }),
    fallbackServices,
  );

export const getPricing = () =>
  safeQuery<PricingTier>(
    (db) => db.from('pricing_tiers').select('*').order('sort_order', { ascending: true }),
    fallbackPricing,
  );

export const getAddons = () =>
  safeQuery<PricingAddon>(
    (db) => db.from('pricing_addons').select('*').order('sort_order', { ascending: true }),
    fallbackAddons,
  );

export const getTestimonials = () =>
  safeQuery<Testimonial>(
    (db) =>
      db
        .from('testimonials')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true }),
    fallbackTestimonials,
  );

export const getFaq = () =>
  safeQuery<FaqItem>(
    (db) =>
      db.from('faq_items').select('*').eq('is_published', true).order('sort_order', { ascending: true }),
    fallbackFaq,
  );
