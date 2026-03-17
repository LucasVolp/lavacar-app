import { NextRequest } from "next/server";

const OWNER_ROUTES = ["/organization"]

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("access_token")?.value;
    const { pathname } = req.nextUrl;
}