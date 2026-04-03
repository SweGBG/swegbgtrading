import "./globals.css";
import { CartProvider } from "./context/cartcontext"; // Se till att namnet matchar filen på disk
import Navbar from "./components/navbar"; // Importera din Navbar-komponent

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