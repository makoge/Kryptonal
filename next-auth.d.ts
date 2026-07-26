// next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  // 1. Extend the built-in session.user type
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
    } & DefaultSession["user"];
  }

  // 2. Extend the built-in user type
  interface User extends DefaultUser {
    role: "USER" | "ADMIN";
  }
}
