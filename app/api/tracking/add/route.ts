// app/api/tracking/add/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  scrapeProductPage,
  scrapeCategoryPage,
  looksLikeCategoryPage,
} from "@/app/lib/firecrawl";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { url, your_price, mode } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL saknas" }, { status: 400 });
    }

    // Avgör om det är kategori- eller produktsida
    // mode kan vara "product", "category" eller "auto" (default)
    const useCategory =
      mode === "category" ||
      (mode !== "product" && looksLikeCategoryPage(url));

    // ========== KATEGORISIDA — flera produkter ==========
    if (useCategory) {
      const products = await scrapeCategoryPage(url);

      if (products.length === 0) {
        return NextResponse.json(
          { error: "Inga produkter hittades på sidan" },
          { status: 422 }
        );
      }

      const results = await Promise.allSettled(
        products.map(async (scraped) => {
          const productUrl = scraped.product_url || url;

          // Kolla om produkten redan finns (samma URL)
          const { data: existing } = await supabase
            .from("tracked_products")
            .select("id")
            .eq("url", productUrl)
            .maybeSingle();

          if (existing) {
            // Produkten finns redan — lägg till ny pris-snapshot
            await supabase.from("price_history").insert({
              product_id: existing.id,
              price: scraped.price,
              currency: scraped.currency,
              in_stock: scraped.in_stock,
            });
            return { id: existing.id, updated: true };
          }

          // Ny produkt — skapa + första pris-snapshot
          const { data: newProduct, error: insertError } = await supabase
            .from("tracked_products")
            .insert({
              name: scraped.name,
              url: productUrl,
              store: scraped.store,
              image_url: scraped.image_url,
              your_price: your_price ?? null,
            })
            .select()
            .single();

          if (insertError) throw insertError;

          await supabase.from("price_history").insert({
            product_id: newProduct.id,
            price: scraped.price,
            currency: scraped.currency,
            in_stock: scraped.in_stock,
          });

          return { id: newProduct.id, created: true };
        })
      );

      const created = results.filter(
        (r) => r.status === "fulfilled" && (r.value as any).created
      ).length;
      const updated = results.filter(
        (r) => r.status === "fulfilled" && (r.value as any).updated
      ).length;
      const failed = results.filter((r) => r.status === "rejected").length;

      return NextResponse.json({
        type: "category",
        total_found: products.length,
        created,
        updated,
        failed,
      });
    }

    // ========== ENSKILD PRODUKTSIDA ==========
    const scraped = await scrapeProductPage(url);
    if (!scraped.name || scraped.price === null) {
      return NextResponse.json(
        { error: "Kunde inte extrahera produktdata från sidan" },
        { status: 422 }
      );
    }

    const { data: product, error: insertError } = await supabase
      .from("tracked_products")
      .insert({
        name: scraped.name,
        url,
        store: scraped.store,
        image_url: scraped.image_url,
        your_price: your_price ?? null,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    const { error: historyError } = await supabase
      .from("price_history")
      .insert({
        product_id: product.id,
        price: scraped.price,
        currency: scraped.currency,
        in_stock: scraped.in_stock,
      });

    if (historyError) throw historyError;

    return NextResponse.json({
      type: "product",
      product,
      initial_price: scraped.price,
    });
  } catch (err: any) {
    console.error("add tracking error:", err);
    return NextResponse.json(
      { error: err.message || "Okänt fel" },
      { status: 500 }
    );
  }
}