import type { IncomingMessage, ServerResponse } from "node:http";
import {
  buildPrompt,
  callGemini,
  parseGeminiResponse,
  validateGeminiResult,
} from "../../src/lib/geminiCore";

interface ApiRequest extends IncomingMessage {
  body?: Record<string, unknown>;
}

interface ApiResponse extends ServerResponse {
  status: (code: number) => ApiResponse;
  json: (data: unknown) => void;
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "POST") {
    if (res.status && res.json) return res.status(405).json({ error: "Method Not Allowed" });
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: "Method Not Allowed" }));
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    return res.end(
      JSON.stringify({
        error: "GEMINI_API_KEY is not configured in Vercel Environment Variables.",
      }),
    );
  }

  try {
    const body = req.body || {};
    const prompt = buildPrompt({
      recipient: String(body.recipient || "Everyone"),
      recipientName: String(body.recipientName || ""),
      language: String(body.language || "English"),
      tone: String(body.tone || "Heartwarming"),
      style: String(body.style || "Traditional Kerala"),
      length: String(body.length || "Medium"),
      occasion: String(body.occasion || "Onam Wishes"),
      purpose: String(body.purpose || "Personal Greeting"),
      emojiLevel: String(body.emojiLevel || "Minimal"),
      instructions: String(body.instructions || "").slice(0, 500),
      variation: body.variation ? String(body.variation) : undefined,
    });

    const text = await callGemini(apiKey, prompt);
    const result = validateGeminiResult(parseGeminiResponse(text));

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify(result));
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Generation failed";
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: message }));
  }
}
