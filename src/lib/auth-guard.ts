import { verifyToken } from "./jwt";

export async function requireAuth(request: Request): Promise<{ id: string; role: string } | Response> {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)admin_token=([^;]*)/);
  const token = match ? match[1] : null;

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return { id: payload.sub as string, role: payload.role as string };
}
