import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { scrapeProductPage } from '@/app/lib/firecrawl';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    const { data: products, error } = await supabase
      .from('tracked_products')
      .select('id, url')
      .eq('is_active', true);

    if (error) throw error;

    const results = await Promise.allSettled(
      (products || []).map(async (p) => {
        const scraped = await scrapeProductPage(p.url);
        if (scraped.price === null) throw new Error(`Inget pris hittades f\u00f6r ${p.url}`);

        await supabase.from('price_history').insert({
          product_id: p.id,
          price: scraped.price,
          currency: scraped.currency,
          in_stock: scraped.in_stock,
        });

        return { id: p.id, price: scraped.price };
      })
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    return NextResponse.json({ succeeded, failed, total: results.length });
  } catch (err: any) {
    console.error('refresh tracking error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}