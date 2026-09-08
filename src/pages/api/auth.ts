import { db } from "../../db";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

import { signToken } from "../../lib/jwt";
import { hashPassword, verifyPassword } from "../../lib/password";

export const POST = async ({ request, cookies }: { request: Request; cookies: any }) => {
  const { password, email } = await request.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ success: false, error: "E-posta ve şifre gerekli" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const adminEmail = import.meta.env.ADMIN_EMAIL || "admin@antalyacicek.evni.tr";
  const adminPassword = import.meta.env.ADMIN_PASSWORD;

  let adminUser = await db.select().from(users).where(eq(users.email, email)).get();

  if (adminUser) {
    if (adminUser.role !== "admin") {
      return new Response(JSON.stringify({ success: false, error: "Geçersiz şifre veya kullanıcı" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const valid = await verifyPassword(password, adminUser.passwordHash);
    if (!valid) {
      return new Response(JSON.stringify({ success: false, error: "Geçersiz şifre veya kullanıcı" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  } else if (email === adminEmail && adminPassword && password === adminPassword) {
    const hashed = await hashPassword(password);
    const id = `user-${crypto.randomUUID()}`;

    await db.insert(users).values({
      id,
      email: adminEmail,
      passwordHash: hashed,
      firstName: "Admin",
      role: "admin",
    });

    adminUser = { id, email: adminEmail, role: "admin" } as any;
  } else {
    return new Response(JSON.stringify({ success: false, error: "Geçersiz şifre veya kullanıcı" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = await signToken({ sub: adminUser.id, role: "admin" });

  cookies.set("admin_token", token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
