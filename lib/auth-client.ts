import { polarClient } from "@polar-sh/better-auth";
import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, useSession, signOut } = createAuthClient({
  baseURL: process.env.BETTER_AUTH_API_URL || "http://localhost:3000",
  plugins: [polarClient()]
});
