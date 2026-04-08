// Next.js 16: middleware → proxy.ts
// Chrání /admin/* — krom /admin/login
import { auth } from "@/auth";

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const isAdmin = path.startsWith("/admin");
  const isLogin = path.startsWith("/admin/login");

  if (isAdmin && !isLogin && !req.auth) {
    const url = new URL("/admin/login", req.nextUrl.origin);
    url.searchParams.set("from", path);
    return Response.redirect(url);
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
