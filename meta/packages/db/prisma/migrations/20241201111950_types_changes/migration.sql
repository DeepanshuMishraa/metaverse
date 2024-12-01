/*
  Warnings:

  - Made the column `height` on table `Space` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Space" ALTER COLUMN "width" SET DATA TYPE TEXT,
ALTER COLUMN "height" SET NOT NULL,
ALTER COLUMN "height" SET DATA TYPE TEXT;
