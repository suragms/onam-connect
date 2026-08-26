/** Map Gemini / network failures to safe user-facing messages (no secrets or stack traces). */
export function toFriendlyAiError(err: unknown): string {
  const raw =
    err instanceof Error
      ? err.message
      : typeof err === "string"
        ? err
        : "";

  const lower = raw.toLowerCase();

  if (
    lower.includes("api key") ||
    lower.includes("api_key") ||
    lower.includes("permission denied") ||
    lower.includes("unauthorized") ||
    lower.includes("401") ||
    lower.includes("403")
  ) {
    return "We couldn't create your wish right now. Please try again.";
  }

  if (
    lower.includes("429") ||
    lower.includes("rate") ||
    lower.includes("quota") ||
    lower.includes("resource exhausted") ||
    lower.includes("high demand") ||
    lower.includes("overloaded")
  ) {
    return "AI is busy right now. Please wait a few seconds and try again.";
  }

  if (
    lower.includes("timeout") ||
    lower.includes("timed out") ||
    lower.includes("abort") ||
    lower.includes("network") ||
    lower.includes("fetch failed") ||
    lower.includes("econnreset") ||
    lower.includes("enotfound")
  ) {
    return "We couldn't reach the AI service. Please check your connection and try again.";
  }

  return "We couldn't create your wish right now. Please try again.";
}

export const FRIENDLY_EMPTY =
  "We couldn't create your wish right now. Please try again.";

export const FRIENDLY_UNAVAILABLE =
  "We couldn't create your wish right now. Please try again.";

export const FRIENDLY_NOT_CONFIGURED =
  "AI is not configured on this deployment. Please try again later.";
