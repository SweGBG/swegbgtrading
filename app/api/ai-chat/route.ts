import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message, context } = await req.json();

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: `Du är SweGBG Trading's AI-assistent i admin-panelen. Du hjälper ägaren Lenn med:
- Produktidéer och prissättning för kaffe, te och muggar
- Copywriting för produktbeskrivningar på svenska
- Marknadsföringsstrategier för Göteborg och lokala företag
- Analysera ordrar och försäljningstrender
- SEO-tips för swegbg.com
- Fiverr-gig och freelance-strategi

Svara alltid på svenska. Var kort, konkret och kreativ. Använd GBG-känsla.

Aktuell butiksdata:
${context || "Ingen data tillgänglig just nu."}`
            }]
          },
          contents: [{
            role: "user",
            parts: [{ text: message }]
          }],
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
          }
        }),
      }
    );

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Kunde inte svara just nu.";
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: "Något gick fel med AI:n." }, { status: 500 });
  }
}