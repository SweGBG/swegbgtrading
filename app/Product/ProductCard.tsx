import Link from "next/link";

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  image: string;
}

export default function ProductCard({ id, name, price, image }: ProductCardProps) {
  return (
    <Link href={`/produkt/${id}`} passHref>
      <a className="product-card">
        <div className="image-wrapper">
          <img src={image} alt={name} />
        </div>
        <h3>{name}</h3>
        <p>{price}</p>
        <button className="btn-add-to-cart" onClick={(e) => e.preventDefault()}>
          Lägg i kundvagn
        </button>
      </a>
    </Link>
  );
}