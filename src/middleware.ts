import { auth } from "@/auth";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  runtime: "nodejs", // Now stable!
};

export default auth((req) => {
  if (!req.auth && (req.nextUrl.pathname !== "/login" && req.nextUrl.pathname !== "/signup")) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});
