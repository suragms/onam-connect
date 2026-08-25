import type { IncomingMessage, ServerResponse } from "node:http";
import {
  buildSocialCaptionPrompt,
  callGemini,
  parseGeminiResponse,
  validateGeminiResult,
} from "../../src/lib/geminiCore";

async function parseBody(req: any): Promise<Record<string, unknown>> {
  if (req.body) {
    if (typeof req.body === "object") return req.body;
    if (typeof req.body === "string") {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
  }
  try {
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    const raw = Buffer.concat(chunks).toString("utf8");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
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
    const body = await parseBody(req);
    const prompt = buildSocialCaptionPrompt({
      platform: String(body.platform || "Instagram"),
      recipient: String(body.recipient || "Everyone"),
      language: String(body.language || "English"),
      tone: String(body.tone || "Social Media"),
      topic: body.topic ? String(body.topic) : undefined,
    });

    const text = await callGemini(apiKey, prompt);
    const result = validateGeminiResult(parseGeminiResponse(text));

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify(result));
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Social caption generation failed";
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ error: message }));
  }
}
