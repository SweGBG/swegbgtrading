import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { items } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: items.map((item: any) => ({
      price_data: {
        currency: "sek",
        product_data: { name: item.name },
        unit_amount: item.price * 100, // Stripe räknar i ören
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/kassa/tack`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/kassa`,
  });

  return NextResponse.json({ url: session.url });
}