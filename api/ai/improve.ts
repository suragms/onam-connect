import type { IncomingMessage, ServerResponse } from "node:http";
import {
  buildImprovePrompt,
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
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
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
    const prompt = buildImprovePrompt(
      String(body.message || "").slice(0, 2000),
      String(body.improvement || ""),
      body.language ? String(body.language) : undefined,
    );

    const text = await callGemini(apiKey, prompt);
    const result = validateGeminiResult(parseGeminiResponse(text));

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify(result));
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Improvement failed";
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: message }));
  }
}
