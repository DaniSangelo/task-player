import NextAuth from "next-auth";
import { authConfig } from "./app/_lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    '/tasks/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/home/:path*',
  ],
};
