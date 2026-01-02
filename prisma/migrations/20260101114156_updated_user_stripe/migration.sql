/*
  Warnings:

  - You are about to drop the column `polarCustomerId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `polarSubscriptionId` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_polarCustomerId_key";

-- DropIndex
DROP INDEX "user_polarSubscriptionId_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "polarCustomerId",
DROP COLUMN "polarSubscriptionId",
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripeSubscriptionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_stripeCustomerId_key" ON "user"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "user_stripeSubscriptionId_key" ON "user"("stripeSubscriptionId");
