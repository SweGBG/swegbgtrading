import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { namn, email, meddelande } = await req.json();

    if (!namn || !email || !meddelande) {
      return NextResponse.json({ error: "Alla fält krävs." }, { status: 400 });
    }

    await resend.emails.send({
      from: "SweGBG Kontakt <order@swegbg.com>",
      to: "lenn.soder@protonmail.com",
      replyTo: email,
      subject: `Nytt meddelande från ${namn} — SweGBG.com`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #0d0d0d; color: #fff; border-radius: 12px; overflow: hidden; border: 1px solid rgba(180,140,60,0.3);">
          <div style="background: linear-gradient(135deg, #1a1408, #0d0d0d); padding: 28px; border-bottom: 1px solid rgba(180,140,60,0.3);">
            <p style="color: rgba(180,140,60,0.9); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin: 0 0 4px;">SweGBG Trading</p>
            <h2 style="color: #fff; margin: 0; font-size: 20px;">Nytt kontaktmeddelande</h2>
          </div>
          <div style="padding: 28px;">
            ${[
              ["Namn", namn],
              ["Email", email],
            ].map(([label, value]) => `
              <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                <span style="color: rgba(255,255,255,0.4); font-size: 13px;">${label}</span>
                <span style="color: #fff; font-size: 13px; font-weight: 600;">${value}</span>
              </div>
            `).join("")}
            <div style="margin-top: 20px;">
              <p style="color: rgba(180,140,60,0.7); font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 10px;">Meddelande</p>
              <p style="color: rgba(255,255,255,0.7); font-size: 14px; line-height: 1.7; margin: 0; background: rgba(255,255,255,0.04); padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
                ${meddelande.replace(/\n/g, "<br>")}
              </p>
            </div>
            <div style="margin-top: 20px; padding: 14px; background: rgba(180,140,60,0.06); border-radius: 8px; border: 1px solid rgba(180,140,60,0.2);">
              <p style="color: rgba(180,140,60,0.7); font-size: 12px; margin: 0;">
                Svara direkt på detta mail för att nå ${namn} på ${email}
              </p>
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Kontakt error:", error);
    return NextResponse.json({ error: "Något gick fel." }, { status: 500 });
  }
}
