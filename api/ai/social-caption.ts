import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface SocialCaptionRequest {
  platform: string;
  recipient: string;
  language: string;
  tone: string;
  topic?: string;
}

function buildSocialCaptionPrompt(input: SocialCaptionRequest): string {
  const charLimit =
    input.platform === "X" ? 280 : input.platform === "WhatsApp Status" ? 200 : 500;

  return `Create an Onam social caption for ${input.platform}.
Recipient: ${input.recipient}
Language: ${input.language}
Tone: ${input.tone}
${input.topic ? `Topic: ${input.topic}` : ""}
Max ${charLimit} characters for socialMessage. Include relevant hashtags. Do NOT mention Vishu.
Return JSON: {"message":"","shortMessage":"","socialMessage":"","hashtags":[]}`;
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
    return res.status(503).json({ error: 'GEMINI_API_KEY is not configured' });
  }

  try {
    const body = req.body as SocialCaptionRequest;
    const { platform, recipient, language, tone } = body;

    if (!platform || !recipient || !language || !tone) {
      return res.status(400).json({ error: 'platform, recipient, language, and tone are required' });
    }

    const prompt = buildSocialCaptionPrompt(body);

    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-2.5-pro'];
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
      } catch (err) {
        lastErr = err;
        console.warn(`[Vercel AI Model ${modelName} failed]:`, err);
      }
    }

    if (!text && lastErr) throw lastErr;

    const parsed = parseGeminiResponse(text);

    if (!parsed.message && !parsed.shortMessage && !parsed.socialMessage) {
      return res.status(500).json({ error: 'AI returned an empty response. Please try again.' });
    }

    return res.status(200).json(parsed);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Caption generation failed';
    console.error('Social caption error:', e);
    return res.status(500).json({ error: message });
  }
}