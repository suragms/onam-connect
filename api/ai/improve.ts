import {
  buildImprovePrompt,
  callGemini,
  parseGeminiResponse,
  validateGeminiResult,
} from "../../src/lib/geminiCore";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: "GEMINI_API_KEY is not configured in Vercel Environment Variables.",
    });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    body = body || {};

    const prompt = buildImprovePrompt(
      String(body.message || "").slice(0, 2000),
      String(body.improvement || ""),
      body.language ? String(body.language) : undefined,
    );

    const text = await callGemini(apiKey, prompt);
    const result = validateGeminiResult(parseGeminiResponse(text));

    return res.status(200).json(result);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Improvement failed";
    return res.status(500).json({ error: message });
  }
}
