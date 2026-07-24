export const POST = async ({ request, cookies }: { request: Request; cookies: any }) => {
  const { password } = await request.json();
  
  if (password === import.meta.env.ADMIN_PASSWORD) {
    cookies.set("admin_token", "authenticated", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
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
