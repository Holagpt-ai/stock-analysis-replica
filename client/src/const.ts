export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/** Safe base URL: env var or current origin. Never undefined. */
function getOAuthPortalBase(): string {
  const env = import.meta.env.VITE_OAUTH_PORTAL_URL;
  if (typeof env === "string" && env.trim()) {
    return env.replace(/\/+$/, "") + "/";
  }
  if (typeof window !== "undefined") {
    return window.location.origin + "/";
  }
  return "https://localhost/";
}

// Generate login URL at runtime so redirect URI reflects the current origin.
// Does not crash when VITE_OAUTH_PORTAL_URL is missing; falls back to origin.
export const getLoginUrl = (): string => {
  const base = getOAuthPortalBase();
  const appId = import.meta.env.VITE_APP_ID ?? "";
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL("app-auth", base);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
