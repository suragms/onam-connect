import type { SavedMessage, UserPreferences } from "@/types/generator";

const HISTORY_KEY = "onamconnect_history";
const FAVORITES_KEY = "onamconnect_favorites";
const PREFS_KEY = "onamconnect_preferences";
const THEME_KEY = "onamconnect_theme";
const LEGACY_KEY = "onam_wishes_history";
const MAX_ITEMS = 20;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function migrateLegacyHistory(): SavedMessage[] {
  try {
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (!legacy) return [];
    const parsed = safeParse<SavedMessage[]>(legacy, []);
    if (parsed.length > 0) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(parsed));
      localStorage.removeItem(LEGACY_KEY);
    }
    return parsed;
  } catch {
    return [];
  }
}

export function getHistory(): SavedMessage[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return migrateLegacyHistory();
    return safeParse<SavedMessage[]>(raw, []);
  } catch {
    return [];
  }
}

export function saveMessage(
  msg: Omit<SavedMessage, "id" | "date" | "isFavorite">,
): SavedMessage {
  try {
    const history = getHistory();
    const entry: SavedMessage = {
      ...msg,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      isFavorite: false,
    };
    const updated = [entry, ...history].slice(0, MAX_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return entry;
  } catch {
    return {
      ...msg,
      id: "offline",
      date: new Date().toISOString(),
      isFavorite: false,
    };
  }
}

export function updateMessage(id: string, patch: Partial<SavedMessage>): SavedMessage[] {
  try {
    const history = getHistory().map((m) =>
      m.id === id ? { ...m, ...patch } : m,
    );
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return history;
  } catch {
    return getHistory();
  }
}

export function toggleFavorite(id: string): SavedMessage[] {
  try {
    const history = getHistory().map((m) =>
      m.id === id ? { ...m, isFavorite: !m.isFavorite } : m,
    );
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return history;
  } catch {
    return getHistory();
  }
}

export function deleteMessage(id: string): SavedMessage[] {
  try {
    const history = getHistory().filter((m) => m.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return history;
  } catch {
    return getHistory();
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    /* ignore */
  }
}

export function getFavorites(): SavedMessage[] {
  return getHistory().filter((m) => m.isFavorite);
}

export function getPreferences(): UserPreferences {
  return safeParse<UserPreferences>(localStorage.getItem(PREFS_KEY), {
    language: "English",
    tone: "Heartwarming",
    theme: "system",
  });
}

export function savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  const current = getPreferences();
  const next = { ...current, ...prefs };
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

export function getTheme(): string {
  try {
    return localStorage.getItem(THEME_KEY) || "system";
  } catch {
    return "system";
  }
}

export function saveTheme(theme: string): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* ignore */
  }
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString();
}

export function groupHistoryByDate(messages: SavedMessage[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: { label: string; items: SavedMessage[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "Earlier", items: [] },
  ];

  for (const msg of messages) {
    const d = new Date(msg.date);
    d.setHours(0, 0, 0, 0);
    if (d.getTime() === today.getTime()) groups[0].items.push(msg);
    else if (d.getTime() === yesterday.getTime()) groups[1].items.push(msg);
    else groups[2].items.push(msg);
  }

  return groups.filter((g) => g.items.length > 0);
}
