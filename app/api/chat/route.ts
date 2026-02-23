import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { productService } from "@/lib/erpnext/services/productService";

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const { message, history = [] } = await request.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Fetch relevant product catalog for accurate answers about parts/machines
    let productContext = "";
    try {
      productContext = await productService.getProductsForChatContext(message, 25);
    } catch (e) {
      console.warn("Chat: Could not load product context", e);
    }

    const systemInstruction = productContext
      ? `You are a helpful assistant for CNC KRAL, a company selling tools, machinery, and equipment for the metalworking industry.

Use ONLY the product catalog below to answer questions about specific parts or machines. Base your answers on the descriptions and details provided. If asked about something not in the catalog, say you don't have that specific information and suggest contacting the company.

PRODUCT CATALOG:
${productContext}

When answering: Be accurate and concise. Reference item names and codes when relevant. For pricing or stock, suggest visiting the product page or contacting sales.`
      : "You are a helpful assistant for CNC KRAL, tools and machinery for metalworking. Answer questions about products and services. For specific product details, suggest visiting the website or contacting the company.";

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTry = ["gemini-2.5-flash-lite", "gemini-1.5-flash-8b", "gemini-pro"];
    let lastError: Error | null = null;

    for (const modelId of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelId });
        const formattedHistory = (history || []).slice(-10).map((h: { role: string; content: string }) => ({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content }],
        }));

        const chat = model.startChat({
          history: [
            { role: "user", parts: [{ text: systemInstruction }] },
            { role: "model", parts: [{ text: "I have the product catalog. Ask me about any part or machine." }] },
            ...formattedHistory,
          ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();
        return NextResponse.json({ reply: text });
      } catch (e) {
        lastError = e as Error;
        continue;
      }
    }

    throw lastError ?? new Error("All models failed");
  } catch (error) {
    const err = error as Error;
    console.error("Chat API error:", err?.message || err);
    const msg = err?.message || "Failed to get response. Please try again.";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
