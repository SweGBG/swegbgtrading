import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { url, query, mode, action } = await req.json();

  // SEARCH — använder Firecrawl /search endpoint
  if (action === "search") {
    if (!query) {
      return NextResponse.json({ error: "Ingen sökfråga angiven" }, { status: 400 });
    }
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/search", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          limit: 8,
          lang: "sv",
          country: "se",
          scrapeOptions: {
            formats: ["extract"],
            extract: {
              prompt:
                mode === "priser"
                  ? "Extract all product names and prices as JSON array: [{name, price, currency}]"
                  : mode === "seo"
                    ? "Extract the page title, meta description, and h1 tags as JSON: {title, description, h1s: []}"
                    : "Extract a short summary, any product names with prices, and key facts as JSON: {summary, products: [{name, price}], keyFacts: []}",
            },
          },
        }),
      });
      const data = await res.json();

      const results = (data?.data || []).map((item: any) => ({
        title: item.title || item.metadata?.title || "Okänd sida",
        url: item.url || "",
        description: item.description || item.metadata?.description || "",
        extract: item.extract || null,
      }));

      return NextResponse.json({
        success: true,
        action: "search",
        query,
        results,
        resultCount: results.length,
        searchedAt: new Date().toISOString(),
      });
    } catch {
      return NextResponse.json({ error: "Sökning misslyckades" }, { status: 500 });
    }
  }

  // SCRAPE — befintlig funktionalitet
  if (!url) {
    return NextResponse.json({ error: "Ingen URL angiven" }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["extract", "markdown"],
        extract: {
          prompt:
            mode === "priser"
              ? "Extract all product names and prices as JSON array: [{name, price, currency}]. Include any discounts or sale prices."
              : mode === "seo"
                ? "Extract the page title, meta description, h1 tags, h2 tags, and any visible keywords as JSON: {title, description, h1s: [], h2s: [], keywords: []}"
                : "Extract the main content, any product names, prices, contact info, and key facts as JSON: {summary, products: [{name, price}], contact: {email, phone, address}, keyFacts: []}",
        },
      }),
    });

    const data = await res.json();

    return NextResponse.json({
      success: data.success,
      action: "scrape",
      extract: data?.data?.extract || null,
      markdown: data?.data?.markdown?.substring(0, 2000) || null,
      url,
      scrapedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Scrape misslyckades" }, { status: 500 });
  }
}