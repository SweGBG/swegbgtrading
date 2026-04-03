"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// 1. Definition av vad en produkt är
interface Product {
  id: string;
  name: string;
  price: number;
}

// 2. Definition av vad vår Context ska innehålla
interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// 3. Provider-komponenten (Själva "motorn")
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
    // Vi lägger till en liten alert så vi ser att det händer nåt!

  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// 4. En "Hook" för att enkelt hämta varukorgen på andra sidor
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart måste användas inom en CartProvider");
  return context;
}