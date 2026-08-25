"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import type { ActionCtx } from "./_generated/server";
import { v } from "convex/values";

const GEMINI_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash-latest",
  "gemini-2.5-pro",
] as const;

const MAX_INSTRUCTIONS = 500;
const MAX_NAME = 80;

function buildPrompt(input: {
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
}): string {
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
  const timeout = setTimeout(() => controller.abort(), 30000);

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
        const errBody = await response.json();
        detail = errBody?.error?.message || "";
      } catch {
        /* ignore */
      }
      if (response.status === 429) {
        throw new Error("Rate limit reached. Please wait a moment.");
      }
      if (response.status === 401 || response.status === 403) {
        throw new Error("AI service is temporarily unavailable. Please check the API key.");
      }
      throw new Error(detail || "Model request failed.");
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Empty response from AI. Please try again.");
    return text;
  } finally {
    clearTimeout(timeout);
  }
}

async function callGemini(apiKey: string, prompt: string): Promise<string> {
  let lastError: Error | null = null;
  for (const model of GEMINI_MODELS) {
    try {
      return await callGeminiOnce(apiKey, model, prompt);
    } catch (e: unknown) {
      lastError = e instanceof Error ? e : new Error(String(e));
      console.warn(`[Gemini Model ${model} failed]:`, lastError.message);
    }
  }
  throw new Error(
    lastError?.message || "AI is busy right now. Please wait a few seconds and try again.",
  );
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

const generatorArgs = {
  clientId: v.string(),
  recipient: v.string(),
  recipientName: v.string(),
  language: v.string(),
  tone: v.string(),
  style: v.string(),
  length: v.string(),
  occasion: v.string(),
  purpose: v.string(),
  emojiLevel: v.string(),
  instructions: v.string(),
  variation: v.optional(v.string()),
};

export const generateMessage = action({
  args: generatorArgs,
  handler: async (ctx: ActionCtx, args: any) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("AI service is not configured. Please try again later.");
    }

    const instructions = String(args.instructions || "").slice(0, MAX_INSTRUCTIONS);
    const recipientName = String(args.recipientName || "").slice(0, MAX_NAME);

    const rateCheck = await ctx.runMutation(internal.rateLimit.checkAndIncrement, {
      clientId: args.clientId,
    });
    if (!rateCheck.allowed) {
      throw new Error(
        "You've reached the hourly generation limit. Please wait a while and try again.",
      );
    }

    const prompt = buildPrompt({
      recipient: String(args.recipient || "Everyone"),
      recipientName,
      language: String(args.language || "English"),
      tone: String(args.tone || "Heartwarming"),
      style: String(args.style || "Traditional Kerala"),
      length: String(args.length || "Medium"),
      occasion: String(args.occasion || "Onam Wishes"),
      purpose: String(args.purpose || "Personal Greeting"),
      emojiLevel: String(args.emojiLevel || "Minimal"),
      instructions,
      variation: args.variation,
    });

    const text = await callGemini(apiKey, prompt);
    return parseGeminiResponse(text);
  },
});

export const improveMessage = action({
  args: {
    clientId: v.string(),
    message: v.string(),
    improvement: v.string(),
    language: v.optional(v.string()),
  },
  handler: async (ctx: ActionCtx, args: any) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("AI service is not configured.");

    const rateCheck = await ctx.runMutation(internal.rateLimit.checkAndIncrement, {
      clientId: args.clientId,
    });
    if (!rateCheck.allowed) {
      throw new Error("You've reached the hourly generation limit. Please wait and try again.");
    }

    const msg = String(args.message || "").slice(0, 2000);
    const prompt = `Improve this Onam wish message.

ORIGINAL:
${msg}

IMPROVEMENT: ${args.improvement}
${args.language ? `TARGET LANGUAGE: ${args.language}` : ""}

Rules: Keep it culturally appropriate for Onam. Do NOT mention Vishu unless asked. Return JSON only:
{"message":"improved full message","shortMessage":"short version","socialMessage":"social version","hashtags":["#Onam","#HappyOnam"]}`;

    const text = await callGemini(apiKey, prompt);
    return parseGeminiResponse(text);
  },
});

export const generateSocialCaption = action({
  args: {
    clientId: v.string(),
    platform: v.string(),
    recipient: v.string(),
    language: v.string(),
    tone: v.string(),
    topic: v.optional(v.string()),
  },
  handler: async (ctx: ActionCtx, args: any) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("AI service is not configured.");

    const rateCheck = await ctx.runMutation(internal.rateLimit.checkAndIncrement, {
      clientId: args.clientId,
    });
    if (!rateCheck.allowed) {
      throw new Error("You've reached the hourly generation limit. Please wait and try again.");
    }

    const charLimit =
      args.platform === "X" ? 280 : args.platform === "WhatsApp Status" ? 200 : 500;

    const prompt = `Create an Onam social caption for ${args.platform}.
Recipient: ${args.recipient}
Language: ${args.language}
Tone: ${args.tone}
${args.topic ? `Topic: ${args.topic}` : ""}
Max ${charLimit} characters for socialMessage. Include relevant hashtags. Do NOT mention Vishu.
Return JSON: {"message":"","shortMessage":"","socialMessage":"","hashtags":[]}`;

    const text = await callGemini(apiKey, prompt);
    return parseGeminiResponse(text);
  },
});
