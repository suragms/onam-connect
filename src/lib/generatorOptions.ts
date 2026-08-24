export const RECIPIENTS = [
  "Family", "Parents", "Friends", "Best Friend", "Partner",
  "Colleague", "Teacher", "Customer", "Business Client",
  "Community", "Everyone", "Custom",
];

export const LANGUAGES = ["English", "Malayalam", "Manglish", "Malayalam + English"];

export const TONES = [
  "Traditional", "Heartwarming", "Friendly", "Funny", "Professional",
  "Inspirational", "Emotional", "Short & Sweet", "Social Media",
];

export const STYLES = [
  "Traditional Kerala", "Modern", "Elegant", "Youth", "Emotional",
  "Funny", "Professional", "Festive", "Viral/Social",
];

export const OCCASIONS = [
  "Onam Wishes", "Thiruvonam", "Family Onam", "Friends Onam",
  "Office Onam", "Business Onam", "Customer Onam", "Community Onam",
  "Onam Celebration",
];

export const PURPOSES = [
  "WhatsApp", "WhatsApp Status", "Instagram", "Facebook", "X",
  "Telegram", "Personal Greeting", "Business Greeting",
];

export const LENGTHS = ["Short", "Medium", "Long"];
export const EMOJI_LEVELS = ["No Emojis", "Minimal", "Festive"];

export const QUICK_PRESETS = [
  { label: "🌸 Family Wish", config: { recipient: "Family", tone: "Heartwarming", language: "English" } },
  { label: "👨‍👩‍👧 Parents", config: { recipient: "Parents", tone: "Emotional", language: "Malayalam" } },
  { label: "❤️ Best Friend", config: { recipient: "Best Friend", tone: "Friendly", language: "Manglish" } },
  { label: "💼 Office", config: { recipient: "Colleague", tone: "Professional", occasion: "Office Onam", purpose: "Business Greeting" } },
  { label: "🏢 Customers", config: { recipient: "Customer", tone: "Professional", occasion: "Business Onam", purpose: "Business Greeting" } },
  { label: "📱 WhatsApp Status", config: { purpose: "WhatsApp Status", length: "Short", tone: "Short & Sweet" } },
  { label: "📸 Instagram", config: { purpose: "Instagram", tone: "Social Media", style: "Viral/Social" } },
  { label: "😂 Funny Onam", config: { tone: "Funny", style: "Funny", language: "Manglish" } },
  { label: "🇮🇳 Malayalam", config: { language: "Malayalam", tone: "Traditional", style: "Traditional Kerala" } },
  { label: "✨ Traditional", config: { tone: "Traditional", style: "Traditional Kerala", occasion: "Thiruvonam" } },
];

export const VARIATIONS = [
  { label: "Make it shorter", variation: "Make the message shorter and more concise" },
  { label: "Make it funnier", variation: "Make the message funnier while staying appropriate" },
  { label: "Make it more emotional", variation: "Make the message more emotional and heartfelt" },
  { label: "Make it more traditional", variation: "Make the message more traditional Kerala Onam style" },
  { label: "Make it professional", variation: "Make the message more professional" },
  { label: "Add emojis", variation: "Add festive Onam emojis tastefully" },
];

export const TRENDING = [
  { title: "Best Onam wishes for family", config: { recipient: "Family", tone: "Heartwarming" } },
  { title: "Malayalam Onam wishes", config: { language: "Malayalam", tone: "Traditional" } },
  { title: "Funny Onam wishes", config: { tone: "Funny", style: "Funny" } },
  { title: "Professional Onam wishes", config: { tone: "Professional", occasion: "Office Onam" } },
  { title: "Onam WhatsApp messages", config: { purpose: "WhatsApp", length: "Short" } },
  { title: "Onam Instagram captions", config: { purpose: "Instagram", tone: "Social Media" } },
  { title: "Thiruvonam wishes", config: { occasion: "Thiruvonam", tone: "Traditional" } },
  { title: "Onam wishes for friends", config: { recipient: "Friends", tone: "Friendly" } },
];

export const IMPROVEMENTS = [
  "Make emotional", "Make professional", "Make shorter", "Make funnier",
  "Translate to Malayalam", "Translate to English", "Convert to Manglish",
  "Add emojis", "Make Instagram-ready",
];

export const SOCIAL_PLATFORMS = [
  "Instagram", "Facebook", "X", "LinkedIn", "WhatsApp Status", "Telegram",
];

export const CARD_TEMPLATES = [
  "Traditional Kerala", "Pookalam", "Mahabali", "Kasavu", "Golden Lamp",
  "Floral", "Kerala Nature", "Modern Minimal", "Elegant Gold", "Social Media",
];

export const CARD_FORMATS = [
  { id: "square", label: "Square", width: 1080, height: 1080 },
  { id: "story", label: "Story", width: 1080, height: 1920 },
  { id: "whatsapp", label: "WhatsApp Status", width: 1080, height: 1920 },
  { id: "facebook", label: "Facebook", width: 1200, height: 630 },
  { id: "x", label: "X / Social", width: 1200, height: 675 },
];
