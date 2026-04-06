import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["SE", "NO", "DK", "FI"],
      },
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "sek",
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/kassa/tack`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/kassa`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("Stripe error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}