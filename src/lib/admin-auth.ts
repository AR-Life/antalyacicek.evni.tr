import crypto from "node:crypto";

const ADMIN_COOKIE_NAME = "admin_session";
const LEGACY_ADMIN_COOKIE_NAME = "admin_token";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24;

function getSessionSecret(): string {
  const env = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {};
  return (
    (env.ADMIN_SESSION_SECRET as string | undefined) ||
    process.env.ADMIN_SESSION_SECRET ||
    "fallback-admin-session-secret-changeme"
  );
}

export function parseCookieHeader(header: string | null): Record<string, string> {
  const result: Record<string, string> = {};
  if (!header) return result;

  for (const pair of header.split(";")) {
    const [name, ...rest] = pair.trim().split("=");
    if (!name) continue;
    const value = rest.join("=");
    if (!value) continue;
    try {
      result[name] = decodeURIComponent(value);
    } catch {
      result[name] = value;
    }
  }

  return result;
}

export function createAdminSessionToken(): string {
  const issuedAt = Date.now();
  const nonce = crypto.randomBytes(24).toString("hex");
  const payload = `${issuedAt}.${nonce}`;
  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");

  return `${payload}.${signature}`;
}

export function verifyAdminSessionToken(tokenValue: string | null | undefined): boolean {
  if (!tokenValue || typeof tokenValue !== "string") return false;

  const parts = tokenValue.split(".");
  if (parts.length !== 3) return false;

  const [issuedAt, nonce, signature] = parts;
  if (!issuedAt || !nonce || !signature) return false;

  const expectedSignature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(`${issuedAt}.${nonce}`)
    .digest("hex");

  if (signature.length !== expectedSignature.length) {
    return false;
  }

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return false;
  }

  const timestamp = Number(issuedAt);
  if (!Number.isFinite(timestamp)) return false;

  return Date.now() - timestamp < SESSION_TTL_MS;
}

export function getAdminSessionToken(request: Request): string | null {
  const cookies = parseCookieHeader(request.headers.get("cookie"));
  const token = cookies[ADMIN_COOKIE_NAME] || cookies[LEGACY_ADMIN_COOKIE_NAME];
  return token || null;
}

export function isAdminRequest(request: Request): boolean {
  return verifyAdminSessionToken(getAdminSessionToken(request));
}

export function setAdminSession(cookies: { set: (name: string, value: string, options: Record<string, unknown>) => void }): void {
  const sessionToken = createAdminSessionToken();
  const env = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {};
  const cookieOptions = {
    httpOnly: true,
    secure: !!(env.PROD || process.env.NODE_ENV === "production"),
    sameSite: "lax",
    path: "/",
    maxAge: Math.round(SESSION_TTL_MS / 1000),
  } as const;

  cookies.set(ADMIN_COOKIE_NAME, sessionToken, cookieOptions);
  cookies.set(LEGACY_ADMIN_COOKIE_NAME, sessionToken, cookieOptions);
}
