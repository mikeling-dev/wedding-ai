/*
  Warnings:

  - You are about to drop the column `location` on the `Wedding` table. All the data in the column will be lost.
  - You are about to drop the `_UserToWedding` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Wedding` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WeddingRole" AS ENUM ('CREATOR', 'PARTNER', 'HELPER');

-- DropForeignKey
ALTER TABLE "_UserToWedding" DROP CONSTRAINT "_UserToWedding_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToWedding" DROP CONSTRAINT "_UserToWedding_B_fkey";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "category" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Wedding" DROP COLUMN "location",
ADD COLUMN     "country" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "state" TEXT;

-- DropTable
DROP TABLE "_UserToWedding";

-- CreateTable
CREATE TABLE "WeddingUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "role" "WeddingRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeddingUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WeddingUser_userId_idx" ON "WeddingUser"("userId");

-- CreateIndex
CREATE INDEX "WeddingUser_weddingId_idx" ON "WeddingUser"("weddingId");

-- CreateIndex
CREATE UNIQUE INDEX "WeddingUser_userId_weddingId_key" ON "WeddingUser"("userId", "weddingId");

-- AddForeignKey
ALTER TABLE "WeddingUser" ADD CONSTRAINT "WeddingUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingUser" ADD CONSTRAINT "WeddingUser_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
