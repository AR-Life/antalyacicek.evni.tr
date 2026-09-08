async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomUUID();
  const hash = await sha256(salt + password);
  return `$sha256$${salt}$${hash}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (!stored) return false;

  if (stored.startsWith("$sha256$")) {
    const parts = stored.split("$");
    const salt = parts[2];
    const expectedHash = parts[3];
    const hash = await sha256(salt + password);
    return hash === expectedHash;
  }

  return password === stored;
}
