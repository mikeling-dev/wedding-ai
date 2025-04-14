/*
  Warnings:

  - The `category` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TaskCategory" AS ENUM ('VENUE', 'CATERING', 'TRANSPORTATION', 'CAKE_AND_DESSERT', 'PHOTOGRAPHY', 'ATTIRE', 'ENTERTAINMENT', 'DECOR_AND_FLOWERS', 'GIFT', 'GUESTS', 'CULTURAL', 'RELIGIOUS', 'MISCELLANEOUS', 'FINALISATION', 'OTHERS');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "remark" TEXT,
DROP COLUMN "category",
ADD COLUMN     "category" "TaskCategory" NOT NULL DEFAULT 'OTHERS';
