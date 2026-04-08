import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body, sig, process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    await supabase.from("orders").insert({
      stripe_session_id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_details?.email,
      shipping_name: session.customer_details?.name,
      shipping_address: session.customer_details?.address?.line1,
      shipping_city: session.customer_details?.address?.city,
      shipping_postal_code: session.customer_details?.address?.postal_code,
      items: session.metadata?.items ?? null,
      status: "paid",
    });

    // Skicka bekräftelsemail
    await resend.emails.send({
      from: "order@swegbg.com",
      to: session.customer_details?.email!,
      subject: "Tack för din beställning! ☕",
      html: `
        <h2>Tack för din beställning!</h2>
        <p>Hej ${session.customer_details?.name},</p>
        <p>Vi har tagit emot din beställning och den är nu bekräftad.</p>
        <p><strong>Totalt:</strong> ${(session.amount_total! / 100)} kr</p>
        <p><strong>Leveransadress:</strong><br/>
          ${session.customer_details?.address?.line1}<br/>
          ${session.customer_details?.address?.postal_code} ${session.customer_details?.address?.city}
        </p>
        <p>Vi återkommer med spårningsinformation när paketet är skickat.</p>
        <br/>
        <p>Med vänliga hälsningar,<br/>SweGBG Trading</p>
      `,
    });
  }

  return NextResponse.json({ received: true });
}