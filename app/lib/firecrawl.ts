// app/lib/firecrawl.ts

export type ScrapedProduct = {
  name: string | null;
  price: number | null;
  currency: string;
  image_url: string | null;
  in_stock: boolean | null;
  store: string | null;
  product_url?: string | null;
};

/**
 * Extraherar butiksnamn från URL:ens domän.
 * Hanterar subdomäner: shop.cervera.se -> Cervera
 */
function extractStoreName(url: string): string | null {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    const parts = hostname.split(".");
    // Ta näst sista delen (domännamnet) oavsett subdomän
    const domain = parts.length >= 2 ? parts[parts.length - 2] : parts[0];
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch {
    return null;
  }
}

/**
 * Scrapa en enskild produktsida.
 * Returnerar EN produkt.
 */
export async function scrapeProductPage(url: string): Promise<ScrapedProduct> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) throw new Error("FIRECRAWL_API_KEY saknas i .env.local");

  const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      formats: ["extract", "markdown"],
      extract: {
        schema: {
          type: "object",
          properties: {
            product_name: { type: "string" },
            price: {
              type: "number",
              description: "Priset i SEK som ett nummer, utan valutasymbol",
            },
            currency: { type: "string" },
            image_url: {
              type: "string",
              description: "URL till huvudbilden av produkten",
            },
            in_stock: { type: "boolean" },
          },
          required: ["product_name", "price"],
        },
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Firecrawl fel (${response.status}): ${text}`);
  }

  const data = await response.json();
  const extracted = data?.data?.extract || {};

  return {
    name: extracted.product_name || null,
    price: typeof extracted.price === "number" ? extracted.price : null,
    currency: extracted.currency || "SEK",
    image_url: extracted.image_url || null,
    in_stock: extracted.in_stock ?? null,
    store: extractStoreName(url),
  };
}

/**
 * Scrapa en kategorisida / söksida.
 * Returnerar en ARRAY av produkter som hittades på sidan.
 * Användbar för t.ex. ahlens.se/muggar/ eller cervera.se/kopp-mugg/
 */
export async function scrapeCategoryPage(
  url: string
): Promise<ScrapedProduct[]> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) throw new Error("FIRECRAWL_API_KEY saknas i .env.local");

  const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      formats: ["extract", "markdown"],
      extract: {
        schema: {
          type: "object",
          properties: {
            products: {
              type: "array",
              description:
                "Lista över ALLA produkter som visas på sidan. Extrahera varje produkt individuellt.",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "Produktens namn",
                  },
                  price: {
                    type: "number",
                    description:
                      "Priset i SEK som ett nummer utan valutasymbol. Om rea-pris visas, använd rea-priset.",
                  },
                  image_url: {
                    type: "string",
                    description: "URL till produktens bild",
                  },
                  product_url: {
                    type: "string",
                    description:
                      "Full URL till produktens egen sida (inte kategorisidan)",
                  },
                  in_stock: {
                    type: "boolean",
                    description: "Om produkten är i lager",
                  },
                },
                required: ["name", "price"],
              },
            },
          },
          required: ["products"],
        },
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Firecrawl fel (${response.status}): ${text}`);
  }

  const data = await response.json();
  const products = data?.data?.extract?.products || [];
  const store = extractStoreName(url);

  return products
    .filter(
      (p: any) => p.name && typeof p.price === "number"
    )
    .map((p: any) => ({
      name: p.name,
      price: p.price,
      currency: "SEK",
      image_url: p.image_url || null,
      in_stock: p.in_stock ?? null,
      store,
      product_url: p.product_url || null,
    }));
}

/**
 * Smart auto-detect: gissar om URL:en är en produktsida eller kategorisida.
 * Heuristik: kategorisidor har oftast /kategori/, /muggar/, /sok/, /search/, ?q= etc.
 */
export function looksLikeCategoryPage(url: string): boolean {
  const lower = url.toLowerCase();
  const categoryIndicators = [
    "/sok",
    "/search",
    "/category",
    "/kategori",
    "/c/",
    "?q=",
    "?search=",
    "/muggar",
    "/koppar",
    "/glas",
    "/kokkarl",
  ];
  return categoryIndicators.some((ind) => lower.includes(ind));
}