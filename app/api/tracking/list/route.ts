import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { data: products, error } = await supabase
      .from('tracked_products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Hämta senaste pris för varje produkt
    const withLatestPrice = await Promise.all(
      (products || []).map(async (p) => {
        const { data: latest } = await supabase
          .from('price_history')
          .select('price, in_stock, scraped_at')
          .eq('product_id', p.id)
          .order('scraped_at', { ascending: false })
          .limit(1)
          .single();

        return {
          ...p,
          latest_price: latest?.price ?? null,
          in_stock: latest?.in_stock ?? null,
          last_scraped: latest?.scraped_at ?? null,
        };
      })
    );

    return NextResponse.json({ products: withLatestPrice });
  } catch (err: any) {
    console.error('list tracking error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}