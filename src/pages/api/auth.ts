import { setAdminSession } from "../../lib/admin-auth";

export const POST = async ({ request, cookies }: { request: Request; cookies: any }) => {
  const body = await request.json().catch(() => ({}));
  const password = typeof body?.password === "string" ? body.password : "";

  if (password === import.meta.env.ADMIN_PASSWORD) {
    setAdminSession(cookies);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: false, error: "Geçersiz şifre" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
};
