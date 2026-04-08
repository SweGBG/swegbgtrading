import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { items, userId, customerDetails } = await req.json();

    const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["SE", "NO", "DK", "FI"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 0, currency: "sek" },
            display_name: "🎁 Gratis frakt",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 7900, currency: "sek" },
            display_name: "📦 DHL Servicepoint (2-4 arbetsdagar)",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 4 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 12900, currency: "sek" },
            display_name: "⚡ DHL Hemleverans (1-2 arbetsdagar)",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 1 },
              maximum: { unit: "business_day", value: 2 },
            },
          },
        },
      ],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "sek",
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      metadata: {
        userId: userId || "guest",
        items: JSON.stringify(items.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }))),
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/kassa/tack`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/kassa`,
    });

    const { error: dbError } = await supabase
      .from("orders")
      .insert([{
        stripe_session_id: session.id,
        amount_total: totalAmount,
        currency: "sek",
        customer_email: customerDetails.email,
        status: "paid",
        items: items,
        shipping_name: `${customerDetails.firstName} ${customerDetails.lastName}`,
        shipping_address: customerDetails.address,
        shipping_city: customerDetails.city,
        user_id: userId || null,
        shipping_postcode: customerDetails.postalCode
      }]);

    if (dbError) console.error("Supabase Error:", dbError.message);

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("Server error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}