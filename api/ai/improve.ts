import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
    return res.status(503).json({ error: 'GEMINI_API_KEY is not configured in Vercel environment variables.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const body = req.body as ImproveRequest;
    const { message, improvement, language } = body;

    if (!message || !improvement) {
      return res.status(400).json({ error: 'message and improvement are required' });
    }

    const prompt = buildImprovePrompt(message, improvement, language);

    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite'];
    let text = '';
    let lastErr: any = null;

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
      } catch (err: any) {
        lastErr = err;
        console.warn(`[Vercel AI Model ${modelName} failed]:`, err?.message || err);
      }
    }

    if (!text) {
      const errMsg = lastErr?.message || 'Gemini AI service unavailable. Please try again.';
      return res.status(500).json({ error: errMsg });
    }

    const parsed = parseGeminiResponse(text);

    if (!parsed.message && !parsed.shortMessage && !parsed.socialMessage) {
      return res.status(500).json({ error: 'AI returned an empty response. Please try again.' });
    }

    return res.status(200).json(parsed);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Improvement failed';
    console.error('Improve error:', e);
    return res.status(500).json({ error: message });
  }
}