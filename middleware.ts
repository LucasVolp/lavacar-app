import { NextRequest, NextResponse } from "next/server";
import { decodeJwt } from "jose";

type UserRole = "USER" | "OWNER" | "EMPLOYEE" | "MANAGER" | "ADMIN";

interface TokenPayload {
    sub: string;
    email: string;
    phone: string;
    role: UserRole;
    iat: number;
    exp: number;
}

function decodeToken(token: string): TokenPayload | null {
    try {
        const payload = decodeJwt(token) as TokenPayload;
        if (!payload.sub || !payload.role) return null;
        if (payload.exp && payload.exp < Date.now() / 1000) return null;
        return payload;
    } catch {
        return null;
    }
}

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("access_token")?.value;
    const { pathname } = req.nextUrl;

    const isOrganizationRoute = pathname.startsWith("/organization");
    const isClientRoute = pathname.startsWith("/client");
    const isAuthRoute = pathname.startsWith("/auth");

    if (isAuthRoute) return NextResponse.next();

    if (isOrganizationRoute || isClientRoute) {
        if (!token) {
            const url = req.nextUrl.clone();
            url.pathname = "/auth/login";
            url.searchParams.set("redirect", pathname);
            return NextResponse.redirect(url);
        }

        const payload = decodeToken(token);

        if (!payload) {
            const url = req.nextUrl.clone();
            url.pathname = "/auth/login";
            return NextResponse.redirect(url);
        }

        // Membership and role authorization is handled by the backend API and page-level
        // guards. Middleware only enforces authentication (valid token).
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/organization/:path*",
        "/client/:path*",
        "/billing",
        "/billing/checkout",
        "/billing/return",
        "/auth/:path*",
    ],
};
