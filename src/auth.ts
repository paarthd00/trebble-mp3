import type { NextAuthConfig } from "next-auth"
import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db"

export const authConfig = {
      adapter: DrizzleAdapter(db),
      providers: [GitHub],
      callbacks: {
            async session({ session, user }) {
                  session.user.id = user.id
                  return session
            },
      }
} satisfies NextAuthConfig

export const {
      handlers,
      auth,
      signOut
} = NextAuth(authConfig)