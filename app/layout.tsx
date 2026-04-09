import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "./context/cartcontext";
import Navbar from "./components/navbar";

export const metadata: Metadata = {
  title: {
    default: "SweGBG Trading — Kaffe, Te & Muggar från Göteborg",
    template: "%s | SweGBG Trading",
  },
  description: "Göteborg i varje kopp. Handplockat kaffe, premium te och designade muggar — levererat till din dörr med äkta GBG-känsla.",
  keywords: [
    "kaffe", "te", "muggar", "kaffekoppar",
    "Göteborg", "GBG", "SweGBG", "SweGBG Trading",
    "specialty coffee", "svensk kaffe", "lokalt kaffe",
    "kaffe online", "te online", "köp kaffe",
    "handplockat kaffe", "premium te", "göteborg kaffe",
    "rostning", "local roast", "kaffepresent"
  ],
  authors: [{ name: "SweGBG Trading", url: "https://swegbg.com" }],
  creator: "SweGBG Trading",
  publisher: "SweGBG Trading",
  category: "Shopping",
  metadataBase: new URL("https://swegbg.com"),

  verification: {
    google: "MgXljLSXRRrS1bdtWPFctCNPOIf8hQJ8RIskr4VTmWw",
  },

  alternates: {
    canonical: "https://swegbg.com",
    languages: {
      "sv-SE": "https://swegbg.com",
    },
  },

  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: "https://swegbg.com",
    siteName: "SweGBG Trading",
    title: "SweGBG Trading — Göteborg i varje kopp ☕",
    description: "Handplockat kaffe, premium te och designade muggar med äkta GBG-känsla. Levererat till din dörr.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SweGBG Trading — Kaffe & Te från Göteborg",
        type: "image/jpeg",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@swegbgtrading",
    creator: "@swegbgtrading",
    title: "SweGBG Trading — Göteborg i varje kopp ☕",
    description: "Handplockat kaffe, premium te och designade muggar med äkta GBG-känsla.",
    images: [
      {
        url: "/images/og-image.jpg",
        alt: "SweGBG Trading",
      }
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/images/logo.png" },
    ],
    shortcut: "/favicon.ico",
  },

  manifest: "/manifest.json",

  other: {
    "og:locale:alternate": "en_US",
    "theme-color": "#0a0a0a",
    "msapplication-TileColor": "#0a0a0a",
    "msapplication-TileImage": "/images/logo.png",
  },
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
        {/* JSON-LD Structured Data — Google förstår vad siten säljer */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "SweGBG Trading",
              "url": "https://swegbg.com",
              "logo": "https://swegbg.com/images/hlogo2.png",
              "description": "Premium kaffe, te och muggar från Göteborg.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Göteborg",
                "addressCountry": "SE"
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
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "GBG Brew Kaffe",
                      "description": "Handplockat specialkaffe från Göteborg"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "Premium Te",
                      "description": "Handplockat premium te"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Product",
                      "name": "SweGBG Muggar",
                      "description": "Designade muggar med GBG-känsla"
                    }
                  }
                ]
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
      </body>
    </html>
  );
}