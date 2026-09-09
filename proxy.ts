import NextAuth from "next-auth";
import { authConfig } from "./app/_lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [], // Adjust to your protected routes
};
