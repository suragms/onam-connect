export interface GeneratedMessage {
  message: string;
  shortMessage: string;
  socialMessage: string;
  hashtags: string[];
}

export interface GeneratorConfig {
  recipient: string;
  recipientName: string;
  language: string;
  tone: string;
  style: string;
  occasion: string;
  purpose: string;
  length: string;
  emojiLevel: string;
  instructions: string;
}

export const DEFAULT_GENERATOR_CONFIG: GeneratorConfig = {
  recipient: "Family",
  recipientName: "",
  language: "English",
  tone: "Heartwarming",
  style: "Traditional Kerala",
  occasion: "Onam Wishes",
  purpose: "Personal Greeting",
  length: "Medium",
  emojiLevel: "Minimal",
  instructions: "",
};

export interface SavedMessage {
  id: string;
  message: string;
  shortMessage?: string;
  socialMessage?: string;
  hashtags?: string[];
  recipient: string;
  recipientName?: string;
  language: string;
  tone: string;
  style?: string;
  occasion?: string;
  purpose?: string;
  date: string;
  isFavorite: boolean;
}

export interface UserPreferences {
  language: string;
  tone: string;
  theme: "light" | "dark" | "system";
}
