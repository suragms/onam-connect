export interface GeminiResult {
  message: string;
  shortMessage: string;
  socialMessage: string;
  hashtags: string[];
}

export interface GenerateInput {
  recipient: string;
  recipientName: string;
  language: string;
  tone: string;
  style: string;
  length: string;
  occasion: string;
  purpose: string;
  emojiLevel: string;
  instructions: string;
  variation?: string;
}

/**
 * Prompt builders and response helpers for Gemini.
 * The API key must only be used in Vercel serverless functions (api/ai/*).
 * Never call Gemini from the browser with a client-side key.
 */

export function buildPrompt(input: GenerateInput): string {
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

  const nameLine = input.recipientName.trim()
    ? `RECIPIENT NAME: ${input.recipientName.trim()} (personalize the greeting with this name)`
    : "";

  const variationLine = input.variation
    ? `VARIATION REQUEST: ${input.variation}`
    : "";

  return `You are an expert Kerala Onam greeting writer. Generate a personalized Onam wish.

RECIPIENT TYPE: ${input.recipient}
${nameLine}
LANGUAGE: ${langMap[input.language] || input.language}
TONE: ${input.tone}
STYLE: ${input.style}
LENGTH: ${lengthGuide[input.length] || input.length}
OCCASION: ${input.occasion}
PLATFORM/PURPOSE: ${purposeGuide[input.purpose] || input.purpose}
EMOJI LEVEL: ${emojiGuide[input.emojiLevel] || input.emojiLevel}
${input.instructions ? `ADDITIONAL INSTRUCTIONS: ${input.instructions}` : ""}
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

export function parseGeminiResponse(text: string): GeminiResult {
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

export function validateGeminiResult(result: GeminiResult): GeminiResult {
  if (!result.message && !result.shortMessage && !result.socialMessage) {
    throw new Error("We couldn't create your wish right now. Please try again.");
  }
  return result;
}

export function buildImprovePrompt(message: string, improvement: string, language?: string): string {
  return `Improve this Onam wish message.

ORIGINAL:
${message}

IMPROVEMENT: ${improvement}
${language ? `TARGET LANGUAGE: ${language}` : ""}

Rules: Keep it culturally appropriate for Onam. Do NOT mention Vishu unless asked. Return JSON only:
{"message":"improved full message","shortMessage":"short version","socialMessage":"social version","hashtags":["#Onam","#HappyOnam"]}`;
}

export function buildSocialCaptionPrompt(input: {
  platform: string;
  recipient: string;
  language: string;
  tone: string;
  topic?: string;
}): string {
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
