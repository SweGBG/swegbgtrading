import { createServerSupabaseClient } from "@/utils/supabase/server";
import KaffeClient from "./KaffeClient";

export const metadata = {
  title: "Kaffe",
  description: "Handplockat specialkaffe rostat med kärlek i Göteborg. Beställ online med snabb leverans.",
};

export default async function KaffePage() {
  const supabase = await createServerSupabaseClient();
  const { data: produkter } = await supabase
    .from("Products")
    .select("*")
    .eq("category", "Kaffe");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": (produkter || []).map((p, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Product",
        "name": p.Name,
        "description": p.description,
        "brand": { "@type": "Brand", "name": "SweGBG Trading" },
        "offers": {
          "@type": "Offer",
          "price": p.price,
          "priceCurrency": "SEK",
          "availability": "https://schema.org/InStock",
          "url": `https://swegbg.com/kaffe`
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "5",
          "reviewCount": "1"
        }
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <KaffeClient produkter={produkter || []} />
    </>
  );
}