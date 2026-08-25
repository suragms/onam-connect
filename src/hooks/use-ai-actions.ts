import { useCallback } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { GeneratedMessage } from "@/types/generator";
import { validateGeminiResult } from "@/lib/geminiCore";

async function localAI(path: string, body: unknown): Promise<GeneratedMessage> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Unable to connect to the server. Please check your internet connection.");
  }

  const rawText = await res.text();
  let data: any;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error("Server returned an unexpected response. Please check your configuration and try again.");
  }

  if (!res.ok) {
    throw new Error(data.error || "We couldn't create your wish right now. Please try again.");
  }
  return validateGeminiResult(data) as GeneratedMessage;
}

/** Legacy Convex deployment only accepts these fields until redeployed. */
function toLegacyGenerateArgs(args: Record<string, unknown>) {
  return {
    recipient: String(args.recipient || "Everyone"),
    language: String(args.language || "English"),
    tone: String(args.tone || "Heartwarming"),
    length: String(args.length || "Medium"),
    occasion: String(args.occasion || "Onam Wishes"),
    instructions: [
      args.instructions,
      args.recipientName ? `Recipient name: ${args.recipientName}` : "",
      args.style ? `Style: ${args.style}` : "",
      args.purpose ? `Purpose: ${args.purpose}` : "",
      args.emojiLevel ? `Emojis: ${args.emojiLevel}` : "",
      args.variation ? `Variation: ${args.variation}` : "",
    ]
      .filter(Boolean)
      .join(". "),
  };
}

/** Dev uses local Vite API only (Convex cloud may be on an old schema). */
export function useAIActions() {
  const generateMessage = useCallback(
    async (args: Record<string, unknown>) => {
      return localAI("/api/ai/generate", args);
    },
    [],
  );

  const improveMessage = useCallback(
    async (args: Record<string, unknown>) => {
      return localAI("/api/ai/improve", args);
    },
    [],
  );

  const generateSocialCaption = useCallback(
    async (args: Record<string, unknown>) => {
      return localAI("/api/ai/social-caption", args);
    },
    [],
  );

  return { generateMessage, improveMessage, generateSocialCaption, toLegacyGenerateArgs };
}
