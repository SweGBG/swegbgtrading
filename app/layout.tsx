import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "./context/cartcontext";
import Navbar from "./components/navbar";

export const metadata: Metadata = {
  title: "SweGBG Trading",
  description: "Kaffe & Te från Göteborg",
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