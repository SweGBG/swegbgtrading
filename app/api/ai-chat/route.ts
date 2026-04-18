import { GoogleGenerativeAI } from "@google/generative-ai";
import FirecrawlApp from "@mendable/firecrawl-js";
import { NextResponse } from "next/server";

// HÄR ÄR FIXEN: Vi tvingar den att använda "v1" istället för "v1beta"
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();

    // Vi hämtar modellen via en specifik konfiguration för att undvika 404
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    }, { apiVersion: "v1" }); // <--- VIKTIGT: Tvinga stabil version

    let webData = "";
    // Firecrawl-logik (behålls som den är)
    if (process.env.FIRECRAWL_API_KEY && message.toLowerCase().includes("pris")) {
      try {
        const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
        const search = await firecrawl.search(message, { limit: 1 });
        if (search.success) webData = search.data[0]?.markdown || "";
      } catch (e) { console.log("Firecrawl vilar."); }
    }

    const prompt = `Du är assistent för SWEGBG TRADING. Svara kort på svenska.
    Data: ${context || "Ingen"}
    Info: ${webData}
    Fråga: ${message}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ reply: text });

  } catch (error: any) {
    console.error("API-FEL:", error);

    // Om det fortfarande blir 404, testa att returnera en lista på vad din nyckel faktiskt kan se
    return NextResponse.json({
      reply: `Fortfarande 404. Kontrollera att din nyckel i .env.local inte har extra mellanslag.`
    }, { status: 500 });
  }
}