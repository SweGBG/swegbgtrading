import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SweGBG Trading",
  description: "Premium Essentials — Göteborg",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body>
        {children}
      </body>
    </html>
  );
}