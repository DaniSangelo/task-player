import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authUser } from "../_actions/auth/login";

export const authConfig = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize({ email, password }) {
        return await authUser({ email: email as string, password: password as string})
      },
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) session.user.id = token.id as string;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET ?? process.env.BETTER_AUTH_SECRET ?? process.env.JWT_SECRET,
} satisfies NextAuthConfig;
