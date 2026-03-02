import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isAdminPath = pathname.startsWith("/admin");
    const isLoginPage = pathname === "/admin/login";

    // Get JWT token (works in middleware without DB)
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isLoggedIn = !!token;

    if (isAdminPath && !isLoginPage && !isLoggedIn) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    if (isLoginPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/admin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
