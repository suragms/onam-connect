import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface GenerateRequest {
  recipient?: string;
  recipientName?: string;
  language?: string;
  tone?: string;
  style?: string;
  length?: string;
  occasion?: string;
  purpose?: string;
  emojiLevel?: string;
  instructions?: string;
  variation?: string;
}

function buildPrompt(input: GenerateRequest): string {
  const langMap: Record<string, string> = {
    English: "English",
    Malayalam: "Malayalam (Malayalam Unicode script)",
    Manglish: "Manglish (Malayalam in English script)",
    "Malayalam + English":
      "Mix of Malayalam and English — greeting in Malayalam, context in English",
  };

  const lengthGuide: Record<string, string> = {
    Short: "2-3 sentences, concise and impactful",
    Medium: "4-6 sentences, well-balanced",
    Long: "A full heartfelt paragraph, detailed and expressive",
  };

  const purposeGuide: Record<string, string> = {
    WhatsApp: "Optimized for WhatsApp chat — warm, personal, easy to forward",
    "WhatsApp Status": "Short, punchy status text with line breaks",
    Instagram: "Engaging Instagram caption with line breaks and hashtags",
    Facebook: "Friendly Facebook post tone",
    X: "Concise X/Twitter post under 280 characters for socialMessage",
    Telegram: "Clear Telegram message, easy to read",
    "Personal Greeting": "Heartfelt personal greeting",
    "Business Greeting": "Professional yet warm business greeting",
  };

  const emojiGuide: Record<string, string> = {
    "No Emojis": "Use zero emojis",
    Minimal: "Use at most 1-2 subtle emojis",
    Festive: "Use 2-4 festive Onam emojis tastefully",
  };

  const {
    recipient = "Everyone",
    recipientName = "",
    language = "English",
    tone = "Heartwarming",
    style = "Traditional Kerala",
    length = "Medium",
    occasion = "Onam Wishes",
    purpose = "Personal Greeting",
    emojiLevel = "Minimal",
    instructions = "",
    variation,
  } = input;

  const nameLine = recipientName.trim()
    ? `RECIPIENT NAME: ${recipientName.trim()} (personalize the greeting with this name)`
    : "";

  const variationLine = variation
    ? `VARIATION REQUEST: ${variation}`
    : "";

  return `You are an expert Kerala Onam greeting writer. Generate a personalized Onam wish.

RECIPIENT TYPE: ${recipient}
${nameLine}
LANGUAGE: ${langMap[language] || language}
TONE: ${tone}
STYLE: ${style}
LENGTH: ${lengthGuide[length] || length}
OCCASION: ${occasion}
PLATFORM/PURPOSE: ${purposeGuide[purpose] || purpose}
EMOJI LEVEL: ${emojiGuide[emojiLevel] || emojiLevel}
${instructions ? `ADDITIONAL INSTRUCTIONS: ${instructions}` : ""}
${variationLine}

RULES:
- Write natural, heartfelt Onam greetings — never generic or robotic.
- Malayalam must use proper Malayalam Unicode script with correct grammar.
- Manglish must be phonetically readable for Malayalam speakers.
- Personalize for the recipient type and name when provided.
- Reference Onam culture appropriately: Thiruvonam, Pookalam, Onasadya, Onakkodi, Vallam Kali, Pulikali, Mahabali, Kerala harvest traditions.
- Do NOT mention Vishu unless explicitly requested in additional instructions.
- Avoid offensive, political, or inappropriate content. No misinformation.
- Match tone, style, length, and platform purpose precisely.
- Make each generation unique — avoid repetitive phrasing.
- Hashtags should include # prefix.

RESPOND IN VALID JSON ONLY — no markdown, no code fences:
{
  "message": "Full personalized Onam wish",
  "shortMessage": "1-2 line version for WhatsApp status or quick share",
  "socialMessage": "Platform-optimized version with line breaks",
  "hashtags": ["#Onam", "#HappyOnam", "#OnamWishes"]
}`;
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
    const body = req.body as GenerateRequest;
    const prompt = buildPrompt(body);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.88,
        topP: 0.95,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    });
    const text = result.response.text();

    const parsed = parseGeminiResponse(text);

    if (!parsed.message && !parsed.shortMessage && !parsed.socialMessage) {
      return res.status(500).json({ error: 'AI returned an empty response. Please try again.' });
    }

    return res.status(200).json(parsed);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Generation failed';
    console.error('Generate error:', e);
    return res.status(500).json({ error: message });
  }
}