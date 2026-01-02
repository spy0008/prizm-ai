import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import {
  polar,
  checkout,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { polarClient } from "@/module/payment/config/polar";
import {
  updatePolarCustomerId,
  updateUserTier,
} from "@/module/payment/lib/subscription";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", //
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scope: ["repo"],
    },
  },
  trustedOrigins: ["http://localhost:3000"],
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "9191f8f4-b788-492a-930a-bd3067b8e2fc",
              slug: "pro",
            },
          ],
          successUrl:
            process.env.POLAR_SUCCESS_URL ||
            "/dashboard/subscription?success=true",
          authenticatedUsersOnly: true,
        }),
        portal({
          returnUrl:
            process.env.NEXT_PUBLIC_APP_URL ||
            "http://localhost:3000/dashboard",
        }),
        usage(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,

          onSubscriptionActive: async (payload) => {
            const customerId = payload.data.customerId;
            const user = await prisma.user.findUnique({
              where: { polarCustomerId: customerId },
            });
            if (user) {
              await updateUserTier(user.id, "PRO", "ACTIVE", payload.data.id);
            }
          },

          onSubscriptionCanceled: async (payload) => {
            const customerId = payload.data.customerId;
            const user = await prisma.user.findUnique({
              where: { polarCustomerId: customerId },
            });

            if (user) {
              const periodEndDate = payload.data.cancelAtPeriodEnd
                ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                : null;

              await prisma.user.update({
                where: { id: user.id },
                data: {
                  subscriptionStatus: "CANCELING",
                  cancelAtPeriodEnd: periodEndDate,
                  polarSubscriptionId: payload.data.id,
                },
              });
            }
          },

          onSubscriptionRevoked: async (payload) => {
            const customerId = payload.data.customerId;
            const user = await prisma.user.findUnique({
              where: { polarCustomerId: customerId },
            });
            if (user) {
              await updateUserTier(user.id, "FREE", "EXPIRED");
            }
          },

          onSubscriptionUncanceled: async (payload) => {
            const customerId = payload.data.customerId;
            const user = await prisma.user.findUnique({
              where: { polarCustomerId: customerId },
            });
            if (user) {
              await prisma.user.update({
                where: { id: user.id },
                data: {
                  subscriptionStatus: "ACTIVE",
                  cancelAtPeriodEnd: null,
                },
              });
            }
          },

          onSubscriptionUpdated: async (payload) => {
            const customerId = payload.data.customerId;
            const user = await prisma.user.findUnique({
              where: { polarCustomerId: customerId },
            });
            if (user && payload.data.status === "active") {
              await updateUserTier(user.id, "PRO", "ACTIVE", payload.data.id);
            }
          },

          onOrderPaid: async () => {},

          onCustomerCreated: async (payload) => {
            const email = payload.data.email;
            const user = await prisma.user.findUnique({
              where: { email },
            });
            if (user) {
              await updatePolarCustomerId(user.id, payload.data.id);
            }
          },
        }),
      ],
    }),
  ],
});
