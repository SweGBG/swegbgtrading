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

    // 1. Beräkna totalbeloppet (Stripe vill ha det i öre/cent)
    const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

    // 2. Skapa Stripe Checkout-session FÖRST (så vi får ett session.id)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["SE", "NO", "DK", "FI"],
      },
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "sek",
          product_data: { name: item.name },
          unit_amount: item.price * 100, // Omvandla till öre
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      metadata: {
        userId: userId || "guest",
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/kassa/tack`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/kassa`,
    });

    // 3. Skapa ordern i Supabase NU när vi har session.id och totalAmount
    // I din app/api/checkout/route.ts
    const { data: order, error: dbError } = await supabase
      .from("orders")
      .insert([
        {
          stripe_session_id: session.id,
          amount_total: totalAmount,
          currency: "sek",
          customer_email: customerDetails.email,
          status: "paid",
          // VIKTIGT: Spara dina items som en JSON-lista
          items: items, // Detta matchar 'items' kolumnen i din bild
          shipping_name: `${customerDetails.firstName} ${customerDetails.lastName}`,
          shipping_address: customerDetails.address,
          shipping_city: customerDetails.city,
          user_id: userId || null,
          shipping_postcode: customerDetails.postalCode
        },
      ]);

    if (dbError) {
      console.error("Supabase Error:", dbError.message);
      // Om databasen sviker vill vi veta varför, men sessionen är redan skapad
    }

    // 4. Skicka tillbaka Stripe-URL:en till frontenden
    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("Server error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}