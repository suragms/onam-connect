import type { Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";
import {
  buildPrompt,
  buildImprovePrompt,
  buildSocialCaptionPrompt,
  callGemini,
  parseGeminiResponse,
  validateGeminiResult,
} from "./src/lib/geminiCore.ts";

function loadGeminiKey(): string | undefined {
  const envConvex = path.resolve(process.cwd(), ".env.convex");
  if (fs.existsSync(envConvex)) {
    const match = fs.readFileSync(envConvex, "utf8").match(/^GEMINI_API_KEY=(.+)$/m);
    if (match?.[1]) return match[1].trim();
  }
  return process.env.GEMINI_API_KEY;
}

async function readJsonBody(req: import("node:http").IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? JSON.parse(raw) : {};
}

function sendJson(res: import("node:http").ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export function geminiApiPlugin(): Plugin {
  return {
    name: "gemini-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/ai/") || req.method !== "POST") {
          return next();
        }

        const apiKey = loadGeminiKey();
        if (!apiKey) {
          return sendJson(res, 503, {
            error: "GEMINI_API_KEY is not configured. Add it to .env.convex",
          });
        }

        try {
          const body = (await readJsonBody(req)) as Record<string, unknown>;
          let prompt: string;

          if (req.url === "/api/ai/generate") {
            prompt = buildPrompt({
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
          } else if (req.url === "/api/ai/improve") {
            prompt = buildImprovePrompt(
              String(body.message || "").slice(0, 2000),
              String(body.improvement || ""),
              body.language ? String(body.language) : undefined,
            );
          } else if (req.url === "/api/ai/social-caption") {
            prompt = buildSocialCaptionPrompt({
              platform: String(body.platform || "Instagram"),
              recipient: String(body.recipient || "Everyone"),
              language: String(body.language || "English"),
              tone: String(body.tone || "Social Media"),
              topic: body.topic ? String(body.topic) : undefined,
            });
          } else {
            return sendJson(res, 404, { error: "Not found" });
          }

          const text = await callGemini(apiKey, prompt);
          const result = validateGeminiResult(parseGeminiResponse(text));
          return sendJson(res, 200, result);
        } catch (e: unknown) {
          const message = e instanceof Error ? e.message : "Generation failed";
          return sendJson(res, 500, { error: message });
        }
      });
    },
  };
}
