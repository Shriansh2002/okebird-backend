/*
  Warnings:

  - You are about to drop the column `contacted` on the `SheetContact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sheet" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'CAFE',
ADD COLUMN     "city" TEXT NOT NULL DEFAULT 'DELHI';

-- AlterTable
ALTER TABLE "SheetContact" DROP COLUMN "contacted";
