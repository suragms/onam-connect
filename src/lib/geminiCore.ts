const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-3.5-flash-lite",
  "gemini-2.5-pro",
] as const;

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

function isRetryableGeminiError(message: string, status: number): boolean {
  const lower = message.toLowerCase();
  return (
    status === 429 ||
    status === 503 ||
    lower.includes("high demand") ||
    lower.includes("overloaded") ||
    lower.includes("resource exhausted") ||
    lower.includes("unavailable")
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

async function callGeminiOnce(
  apiKey: string,
  model: string,
  prompt: string,
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.88,
          topP: 0.95,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
      }),
    });

    if (!response.ok) {
      let detail = "";
      try {
        const errBody = (await response.json()) as { error?: { message?: string } };
        detail = errBody?.error?.message || "";
      } catch {
        /* ignore */
      }
      if (response.status === 401 || response.status === 403) {
        throw new Error("AI service is temporarily unavailable. Please check the API key.");
      }
      const err = new Error(detail || "We couldn't create your wish right now. Please try again.");
      if (isRetryableGeminiError(detail, response.status)) {
        (err as Error & { retryable: boolean }).retryable = true;
      }
      throw err;
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty response from AI. Please try again.");
    return text;
  } finally {
    clearTimeout(timeout);
  }
}

export async function callGemini(apiKey: string, prompt: string): Promise<string> {
  let lastError: Error | null = null;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await callGeminiOnce(apiKey, model, prompt);
      } catch (e: unknown) {
        lastError = e instanceof Error ? e : new Error(String(e));
        const retryable =
          (lastError as Error & { retryable?: boolean }).retryable ||
          isRetryableGeminiError(lastError.message, 503);

        if (retryable) {
          await sleep(1200 * (attempt + 1));
          continue;
        }
        throw lastError;
      }
    }
  }

  throw new Error(
    "AI is busy right now. Please wait a few seconds and try again.",
  );
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
    throw new Error("AI returned an empty response. Please try again.");
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
