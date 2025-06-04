/*
  Warnings:

  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'Client';

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role";
