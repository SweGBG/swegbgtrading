import ProductCard from "../components/ProductCard";

const products = [
  { id: 1, name: "Essential Tee", price: "399 SEK", image: "/products/tee.jpg" },
  { id: 2, name: "Classic Hoodie", price: "799 SEK", image: "/products/hoodie.jpg" },
];

export default function Home() {
  return (
    <div className="grid-container">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
import Link from "next/link";

const products = [
  { id: 1, name: "Essential Tee", price: "399 SEK", image: "/products/tee.jpg" },
  { id: 2, name: "Classic Hoodie", price: "799 SEK", image: "/products/hoodie.jpg" },
];

export default function Home() {
  return (
    <div className="grid-container">
      {products.map((product) => (
        <Link key={product.id} href={`/produkt/${product.id}`}>
          <div className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}