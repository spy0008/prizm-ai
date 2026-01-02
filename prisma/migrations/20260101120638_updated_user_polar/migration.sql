/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[polarCustomerId]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[polarSubscriptionId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_stripeCustomerId_key";

-- DropIndex
DROP INDEX "user_stripeSubscriptionId_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "stripeCustomerId",
DROP COLUMN "stripeSubscriptionId",
ADD COLUMN     "polarCustomerId" TEXT,
ADD COLUMN     "polarSubscriptionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_polarCustomerId_key" ON "user"("polarCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "user_polarSubscriptionId_key" ON "user"("polarSubscriptionId");
