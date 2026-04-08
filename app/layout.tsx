import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "./context/cartcontext";
import Navbar from "./components/navbar";

export const metadata: Metadata = {
  title: {
    default: "SweGBG Trading — Kaffe & Te från Göteborg",
    template: "%s | SweGBG Trading",
  },
  description: "Premium kaffe och te med äkta Göteborg-känsla. Handplockat, rostat med kärlek och levererat till din dörr.",
  keywords: ["kaffe", "te", "Göteborg", "SweGBG", "specialty coffee", "svensk kaffe"],
  authors: [{ name: "SweGBG Trading" }],
  creator: "SweGBG Trading",
  metadataBase: new URL("https://swegbg.com"),
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: "https://swegbg.com",
    siteName: "SweGBG Trading",
    title: "SweGBG Trading — Kaffe & Te från Göteborg",
    description: "Premium kaffe och te med äkta Göteborg-känsla.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SweGBG Trading",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SweGBG Trading — Kaffe & Te från Göteborg",
    description: "Premium kaffe och te med äkta Göteborg-känsla.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sv">
      <body>
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}