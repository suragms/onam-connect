import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  FRIENDLY_EMPTY,
  FRIENDLY_NOT_CONFIGURED,
  FRIENDLY_UNAVAILABLE,
  toFriendlyAiError,
} from '../_lib/friendlyError';

interface ImproveRequest {
  message: string;
  improvement: string;
  language?: string;
}

function buildImprovePrompt(message: string, improvement: string, language?: string): string {
  return `Improve this Onam wish message.

ORIGINAL:
${message}

IMPROVEMENT: ${improvement}
${language ? `TARGET LANGUAGE: ${language}` : ""}

Rules: Keep it culturally appropriate for Onam. Do NOT mention Vishu unless asked. Return JSON only:
{"message":"improved full message","shortMessage":"short version","socialMessage":"social version","hashtags":["#Onam","#HappyOnam"]}`;
}

function parseGeminiResponse(text: string) {
  try {
    const parsed = JSON.parse(text);
    const hashtags = Array.isArray(parsed.hashtags)
      ? parsed.hashtags.map((t: string) => (String(t).startsWith("#") ? String(t) : `#${t}`))
      : ["#Onam", "#HappyOnam", "#OnamWishes"];
    return {
      message: String(parsed.message || ""),
      shortMessage: String(parsed.shortMessage || ""),
      socialMessage: String(parsed.socialMessage || ""),
      hashtags,
    };
  } catch {
    const trimmed = text.trim();
    return {
      message: trimmed,
      shortMessage: trimmed.split("\n").slice(0, 2).join(" "),
      socialMessage: trimmed,
      hashtags: ["#Onam", "#HappyOnam", "#OnamWishes"],
    };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: FRIENDLY_NOT_CONFIGURED });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const body = req.body as ImproveRequest;
    const { message, improvement, language } = body;

    if (!message || !improvement) {
      return res.status(400).json({ error: 'message and improvement are required' });
    }

    const prompt = buildImprovePrompt(message, improvement, language);

    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-3.5-flash-lite'];
    let text = '';
    let lastErr: unknown = null;

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.88,
            topP: 0.95,
            maxOutputTokens: 2048,
            responseMimeType: "application/json",
          },
        });
        text = result.response.text();
        if (text) break;
      } catch (err: unknown) {
        lastErr = err;
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[Vercel AI Model ${modelName} failed]:`, msg);
      }
    }

    if (!text) {
      console.error('Improve: all models failed', lastErr);
      return res.status(500).json({ error: FRIENDLY_UNAVAILABLE });
    }

    const parsed = parseGeminiResponse(text);

    if (!parsed.message && !parsed.shortMessage && !parsed.socialMessage) {
      return res.status(500).json({ error: FRIENDLY_EMPTY });
    }

    return res.status(200).json(parsed);
  } catch (e: unknown) {
    console.error('Improve error:', e);
    return res.status(500).json({ error: toFriendlyAiError(e) });
  }
}
