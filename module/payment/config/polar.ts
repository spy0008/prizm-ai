import { Polar } from "@polar-sh/sdk";

export const polarClient = new Polar({
  accessToken: process.env.POLAR_CLIENT_SECRET!,
  server: process.env.NODE_ENV === "production" ? "production" : "sandbox",
});
