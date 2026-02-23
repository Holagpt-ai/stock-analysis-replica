/**
 * Safe URL construction helpers to avoid "TypeError: Invalid URL" crashes.
 * Ensures base URLs are valid and have proper trailing slash handling.
 */

/** Ensures base URL has trailing slash for new URL(relativePath, base) usage. */
export function ensureTrailingSlash(baseUrl: string): string {
  if (!baseUrl || typeof baseUrl !== "string") return "";
  const trimmed = baseUrl.trim();
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

/**
 * Builds a full URL from base + relative path. Returns empty string if base is invalid.
 * Use when base may be undefined or empty to avoid crashes.
 */
export function safeUrlFromBase(
  relativePath: string,
  baseUrl: string | undefined
): string {
  const base = ensureTrailingSlash(baseUrl ?? "");
  if (!base) return "";
  try {
    return new URL(relativePath, base).toString();
  } catch {
    return "";
  }
}

/**
 * Safely joins base URL with path. Returns empty string if base is invalid.
 * Use when constructing absolute URLs (e.g. base + "/v1/maps/proxy" + endpoint).
 */
export function safeJoinUrl(baseUrl: string | undefined, ...parts: string[]): string {
  const base = (baseUrl ?? "").trim().replace(/\/+$/, "");
  if (!base) return "";
  const path = parts
    .map((p) => p.replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");
  const full = path ? `${base}/${path}` : base;
  try {
    return new URL(full).toString();
  } catch {
    return "";
  }
}
