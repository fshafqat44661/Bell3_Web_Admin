/**
 * Referral helpers — mirrors creator app invite-link logic.
 * Invite URL shape: {WEB_APP}/register?ref={code}
 * Mobile deep link: {WEB_APP}/app-invite/{code}
 */

export function getWebAppBaseUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_BELL3_WEB_APP_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "https://app.bell3.net";
}

export function resolveReferralCode(user) {
  if (!user) return "";
  return String(
    user.referral_code ||
      user.referralCode ||
      user.ref_code ||
      user.invitation_code ||
      user.unique_code ||
      user.user_code ||
      user.code ||
      user.id ||
      ""
  );
}

export function buildRegisterInviteLink(code, baseUrl = getWebAppBaseUrl()) {
  if (!code) return "";
  const url = new URL("/register", `${baseUrl}/`);
  url.searchParams.set("ref", String(code));
  return url.toString();
}

export function buildAppInviteLink(code, baseUrl = getWebAppBaseUrl()) {
  if (!code) return "";
  return `${baseUrl}/app-invite/${encodeURIComponent(String(code))}`;
}

export function buildMobileDeepLink(code) {
  if (!code) return "";
  return `bell3:///signup?referral_code=${encodeURIComponent(String(code))}`;
}

export function getStoredAdminUser() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
