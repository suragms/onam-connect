const SITE_URL = "https://onamconnect.vercel.app/";

export function getSiteUrl(): string {
  return SITE_URL;
}

/** Append the live site URL once at share/export time (not into editable AI text). */
export function withSiteUrl(message: string): string {
  const trimmed = message.trimEnd();
  const url = SITE_URL.replace(/\/$/, "");
  if (!trimmed) return SITE_URL;
  if (trimmed.includes(url) || trimmed.includes(SITE_URL)) return trimmed;
  return `${trimmed}\n\n${SITE_URL}`;
}

export function shareToWhatsApp(message: string): void {
  const encoded = encodeURIComponent(withSiteUrl(message));
  window.open(`https://wa.me/?text=${encoded}`, "_blank", "noopener,noreferrer");
}

export function shareToTelegram(message: string, url?: string): void {
  const text = encodeURIComponent(message);
  const link = encodeURIComponent(url || SITE_URL);
  window.open(
    `https://t.me/share/url?text=${text}&url=${link}`,
    "_blank",
    "noopener,noreferrer",
  );
}

/** Facebook cannot pre-fill message text via web — share site URL or copy fallback. */
export function shareToFacebook(url: string = SITE_URL): void {
  const encoded = encodeURIComponent(url);
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    "_blank",
    "noopener,noreferrer",
  );
}

export async function shareToFacebookWithFallback(
  message: string,
  url: string = SITE_URL,
): Promise<"shared" | "copied"> {
  await copyMessage(withSiteUrl(message));
  shareToFacebook(url);
  return "copied";
}

export function shareToX(message: string, maxLength = 280): string {
  const withUrl = withSiteUrl(message);
  const trimmed =
    withUrl.length > maxLength ? withUrl.slice(0, maxLength - 3) + "..." : withUrl;
  const encoded = encodeURIComponent(trimmed);
  window.open(
    `https://x.com/intent/tweet?text=${encoded}`,
    "_blank",
    "noopener,noreferrer",
  );
  return trimmed;
}

export function getXCharCount(message: string): number {
  return withSiteUrl(message).length;
}

export async function copyMessage(message: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(message);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = message;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    } catch {
      document.body.removeChild(textarea);
      return false;
    }
  }
}

/** Copy message with site URL appended once (for share/copy actions). */
export async function copyMessageWithSiteUrl(message: string): Promise<boolean> {
  return copyMessage(withSiteUrl(message));
}

export async function nativeShare(
  title: string,
  text: string,
  url?: string,
): Promise<boolean> {
  if (!navigator.share) return false;
  try {
    await navigator.share({ title, text, url: url || SITE_URL });
    return true;
  } catch {
    return false;
  }
}

export async function shareImage(file: File, title: string, text?: string): Promise<boolean> {
  if (!navigator.share || !navigator.canShare?.({ files: [file] })) return false;
  try {
    await navigator.share({ title, text, files: [file] });
    return true;
  } catch {
    return false;
  }
}

export function canNativeShare(): boolean {
  return typeof navigator !== "undefined" && !!navigator.share;
}

/** Signal has no web share API — use native share or copy. */
export async function shareViaSignal(message: string): Promise<"native" | "copied" | "failed"> {
  const payload = withSiteUrl(message);
  if (canNativeShare()) {
    const ok = await nativeShare("ONAMCONNECT", payload, SITE_URL);
    if (ok) return "native";
  }
  const ok = await copyMessage(payload);
  return ok ? "copied" : "failed";
}

/** Arattai has no official web API — native share or copy fallback. */
export async function shareViaArattai(message: string): Promise<"native" | "copied" | "failed"> {
  const payload = withSiteUrl(message);
  if (canNativeShare()) {
    const ok = await nativeShare("ONAMCONNECT", payload, SITE_URL);
    if (ok) return "native";
  }
  const ok = await copyMessage(payload);
  return ok ? "copied" : "failed";
}
