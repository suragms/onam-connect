import type { GeneratorConfig } from "@/types/generator";

const MAX_INSTRUCTIONS = 500;
const MAX_NAME = 80;

export function sanitizeText(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

export function validateGeneratorConfig(config: GeneratorConfig): string | null {
  if (config.recipientName.length > MAX_NAME) {
    return "Recipient name is too long.";
  }
  if (config.instructions.length > MAX_INSTRUCTIONS) {
    return "Custom instructions must be under 500 characters.";
  }
  return null;
}

export function normalizeHashtags(tags: string[]): string[] {
  return tags.map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
}

export function formatRecipientLabel(config: GeneratorConfig): string {
  if (config.recipientName.trim()) {
    return `${config.recipient} (${config.recipientName.trim()})`;
  }
  return config.recipient;
}
