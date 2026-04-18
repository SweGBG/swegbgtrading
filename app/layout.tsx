import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "./context/cartcontext";
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Navbar from "./components/navbar";


export const metadata: Metadata = {
  title: {
    default: "Köp Kaffe, Te & Muggar Online | SweGBG Trading Göteborg",
    template: "%s | SweGBG Trading",
  },
  description:
    "Handla premium kaffe, exklusivt te, designade muggar och mer från Göteborg. SweGBG Trading – din kompletta webbshop för hantverk och livsstilsprodukter. Snabb leverans över hela Sverige.",
  keywords: [
    // Köp-intent (högkonverterande)
    "köpa kaffe online",
    "köp premium kaffe",
    "beställa kaffe göteborg",
    "handla te online",
    "köp kaffemuggar",

    // Lokalt fokus (low competition)
    "kaffe göteborg",
    "kaffebutik göteborg",
    "te göteborg",
    "webbshop göteborg",

    // Produktspecifikt (long-tail)
    "premium espresso kaffe",
    "ekologiskt kaffe sverige",
    "designade kaffemuggar",
    "premium te online",
    "hantverk göteborg",
    "livsstilsprodukter sverige",

    // Brand
    "SweGBG Trading",
    "swegbg kaffe",
    "göteborg worldwide",
  ],
  authors: [{ name: "SweGBG Trading", url: "https://swegbg.com" }],
  creator: "SweGBG Trading",
  publisher: "SweGBG Trading",
  category: "E-commerce",
  metadataBase: new URL("https://swegbg.com"),
  verification: {
    google: "MgXljLSXRRrS1bdtWPFctCNPOIf8hQJ8RIskr4VTmWw",
  },
  alternates: {
    canonical: "https://swegbg.com",
    languages: { "sv-SE": "https://swegbg.com" },
  },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: "https://swegbg.com",
    siteName: "SweGBG Trading",
    title: "Köp Kaffe, Te & Livsstilsprodukter från Göteborg | SweGBG Trading",
    description:
      "Premium kaffe, exklusivt te, designade muggar och hantverk från Göteborg. Snabb leverans över hela Sverige – handla online idag!",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: "SweGBG Trading - Göteborg Worldwide" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@swegbgtrading",
    title: "Köp Premium Kaffe & Livsstilsprodukter | SweGBG Trading",
    description: "Göteborgs webbshop för kaffe, te, muggar och hantverk. Snabb leverans hela Sverige.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/images/logo.png", type: "image/png" }],
    apple: [{ url: "/images/logo.png" }],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <head>
        {/* LocalBusiness Schema - Kritiskt för lokal SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "SweGBG Trading",
              "description": "Webbshop för premium kaffe, te, muggar och livsstilsprodukter från Göteborg",
              "url": "https://swegbg.com",
              "logo": "https://swegbg.com/images/hlogo2.png",
              "image": "https://swegbg.com/images/og-image.jpg",
              "priceRange": "$$",
              "slogan": "Göteborg - Worldwide",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Göteborg",
                "addressRegion": "Västra Götaland",
                "addressCountry": "SE"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "57.7089",
                "longitude": "11.9746"
              },
              "areaServed": {
                "@type": "Country",
                "name": "Sverige"
              },
              "sameAs": [
                "https://instagram.com/swegbgtrading",
                "https://twitter.com/swegbgtrading"
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "SweGBG Produkter",
                "itemListElement": [
                  {
                    "@type": "Product",
                    "name": "Premium Kaffe",
                    "description": "Handplockat specialkaffe och espressoblandningar från världens bästa odlingar",
                    "category": "Kaffe",
                    "brand": { "@type": "Brand", "name": "SweGBG Trading" },
                    "offers": {
                      "@type": "AggregateOffer",
                      "priceCurrency": "SEK",
                      "lowPrice": "129",
                      "highPrice": "299",
                      "availability": "https://schema.org/InStock",
                      "url": "https://swegbg.com/kaffe"
                    }
                  },
                  {
                    "@type": "Product",
                    "name": "Premium Te",
                    "description": "Handplockat premium te från världens finaste odlingar",
                    "category": "Te",
                    "brand": { "@type": "Brand", "name": "SweGBG Trading" },
                    "offers": {
                      "@type": "AggregateOffer",
                      "priceCurrency": "SEK",
                      "lowPrice": "99",
                      "highPrice": "249",
                      "availability": "https://schema.org/InStock",
                      "url": "https://swegbg.com/te"
                    }
                  },
                  {
                    "@type": "Product",
                    "name": "Designade Kaffemuggar",
                    "description": "Exklusiva espressomuggar och designade kaffemuggar med GBG-känsla",
                    "category": "Muggar & Tillbehör",
                    "brand": { "@type": "Brand", "name": "SweGBG Trading" },
                    "offers": {
                      "@type": "AggregateOffer",
                      "priceCurrency": "SEK",
                      "lowPrice": "199",
                      "highPrice": "299",
                      "availability": "https://schema.org/InStock",
                      "url": "https://swegbg.com/kaffemuggar"
                    }
                  }
                ]
              }
            })
          }}
        />

        {/* FAQ Schema - Får featured snippets i Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "Levererar ni till hela Sverige?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ja, SweGBG Trading levererar premium kaffe, te och muggar till hela Sverige med snabb leverans via PostNord och DHL."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Var kommer kaffet ifrån?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Vårt premium kaffe är handplockat från världens bästa odlingar och kvalitetskontrollerat i Göteborg innan leverans."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Hur lång är leveranstiden?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Vi skickar beställningar inom 1-2 vardagar. Leveranstid är vanligtvis 2-4 vardagar inom Sverige."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Kan jag handla flera produkter samtidigt?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ja, SweGBG Trading erbjuder kaffe, te, muggar och andra livsstilsprodukter. Lägg till flera produkter i varukorgen och betala säkert med Stripe."
                  }
                }
              ]
            })
          }}
        />

        {/* BreadcrumbList Schema - Hjälper Google förstå sidstruktur */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Hem",
                  "item": "https://swegbg.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Kaffe",
                  "item": "https://swegbg.com/kaffe"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Te",
                  "item": "https://swegbg.com/te"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": "Kaffemuggar",
                  "item": "https://swegbg.com/kaffemuggar"
                }
              ]
            })
          }}
        />

        {/* WebSite Schema med sökfunktion */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "SweGBG Trading",
              "url": "https://swegbg.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://swegbg.com/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body>
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}