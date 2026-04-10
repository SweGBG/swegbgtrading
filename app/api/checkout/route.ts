import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: Request) {
  try {
    const { items, userId, customerDetails } = await req.json()

    const totalAmount = items.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0
    )

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_address_collection: {
        allowed_countries: ['SE', 'NO', 'DK', 'FI'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'sek' },
            display_name: 'Gratis frakt',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 7900, currency: 'sek' },
            display_name: 'DHL Servicepoint (2-4 arbetsdagar)',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 4 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 12900, currency: 'sek' },
            display_name: 'DHL Hemleverans (1-2 arbetsdagar)',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 2 },
            },
          },
        },
      ],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'sek',
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      metadata: {
        userId: userId || 'guest',
        items: JSON.stringify(
          items.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          }))
        ),
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/kassa/tack`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/kassa`,
    })

    const { error: dbError } = await supabase.from('orders').insert([
      {
        stripe_session_id: session.id,
        amount_total: totalAmount,
        currency: 'sek',
        customer_email: customerDetails.email,
        status: 'paid',
        items: items,
        shipping_name: `${customerDetails.firstName} ${customerDetails.lastName}`,
        shipping_address: customerDetails.address,
        shipping_city: customerDetails.city,
        user_id: userId || null,
        shipping_postcode: customerDetails.postalCode,
      },
    ])

    if (dbError) console.error('Supabase Error:', dbError.message)

    await resend.emails.send({
      from: 'SweGBG Trading <no-reply@swegbg.com>',
      to: customerDetails.email,
      subject: 'Tack för din beställning! 🛒',
      html: `
        <!DOCTYPE html>
        <html lang="sv">
        <head><meta charset="UTF-8" /></head>
        <body style="margin:0;padding:0;background:#0d0d0d;font-family:'Georgia',serif;">
          <div style="max-width:560px;margin:40px auto;background:#111;">

            <div style="background:#0a0a0a;padding:40px;text-align:center;border-bottom:1px solid rgba(180,140,60,0.2);">
              <p style="color:rgba(180,140,60,0.6);font-size:10px;letter-spacing:0.3em;text-transform:uppercase;margin:0 0 8px;">Göteborg · Est. 2026</p>
              <h1 style="color:#fff;font-size:24px;font-weight:700;margin:0;letter-spacing:0.3em;text-transform:uppercase;">SWEGBG</h1>
              <p style="color:rgba(180,140,60,0.6);font-size:10px;letter-spacing:0.3em;text-transform:uppercase;margin:4px 0 0;">Trading</p>
            </div>

            <div style="padding:40px;">
              <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(180,140,60,0.6);margin:0 0 16px;">— Orderbekräftelse</p>
              <h2 style="font-size:24px;font-weight:400;color:#fff;margin:0 0 8px;">Tack, ${customerDetails.firstName}!</h2>
              <p style="font-size:14px;color:rgba(255,255,255,0.5);line-height:1.7;margin:0 0 32px;">
                Din beställning är mottagen och behandlas nu. Vi återkommer med spårningsinformation.
              </p>

              <div style="background:#0a0a0a;padding:24px;margin-bottom:24px;border:1px solid rgba(180,140,60,0.15);">
                <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(180,140,60,0.6);margin:0 0 16px;">Din beställning</p>
                ${items.map((item: any) => `
                  <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.05);">
                    <div>
                      <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.8);">${item.name}</p>
                      <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.3);">Antal: ${item.quantity}</p>
                    </div>
                    <span style="font-size:15px;color:#B48C3C;">${item.price * item.quantity} kr</span>
                  </div>
                `).join('')}
                <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 0 0;">
                  <span style="font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(180,140,60,0.6);">Totalt</span>
                  <span style="font-size:20px;color:#B48C3C;">${totalAmount} kr</span>
                </div>
              </div>

              <div style="background:#0a0a0a;padding:20px;border:1px solid rgba(180,140,60,0.1);">
                <p style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(180,140,60,0.6);margin:0 0 12px;">Leveransadress</p>
                <p style="font-size:13px;color:rgba(255,255,255,0.6);margin:0;line-height:1.7;">
                  ${customerDetails.firstName} ${customerDetails.lastName}<br/>
                  ${customerDetails.address}<br/>
                  ${customerDetails.postalCode} ${customerDetails.city}
                </p>
              </div>
            </div>

            <div style="background:#0a0a0a;padding:24px;text-align:center;border-top:1px solid rgba(180,140,60,0.15);">
              <p style="color:rgba(255,255,255,0.2);font-size:10px;letter-spacing:0.2em;text-transform:uppercase;margin:0;">
                SweGBG Trading · Göteborg · swegbg.com
              </p>
            </div>

          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Server error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
