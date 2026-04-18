import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message, context } = await req.json();

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: `Du är SweGBG Trading's AI-assistent i admin-panelen. Du hjälper ägaren Lenn med:
- Produktidéer och prissättning
- Copywriting för produktbeskrivningar
- Marknadsföringsstrategier för Göteborg
- Analysera ordrar och försäljning
- SEO-tips

Svara alltid på svenska. Var kort och konkret.

Aktuell data från butiken:
${context || "Ingen data tillgänglig just nu."}`,
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await res.json();
    const reply = data?.content?.[0]?.text || "Kunde inte svara just nu.";
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ reply: "Något gick fel med AI:n." }, { status: 500 });
  }
}