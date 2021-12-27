/*
  Warnings:

  - A unique constraint covering the columns `[index]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[index]` on the table `Request` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Profile_id_key";

-- DropIndex
DROP INDEX "Profile_ownerUserId_index_idx";

-- DropIndex
DROP INDEX "Profile_ownerUserId_index_key";

-- DropIndex
DROP INDEX "Request_id_key";

-- DropIndex
DROP INDEX "Request_targetUserId_index_idx";

-- DropIndex
DROP INDEX "Request_targetUserId_index_key";

-- AlterTable
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Request" ADD CONSTRAINT "Request_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_index_key" ON "Profile"("index");

-- CreateIndex
CREATE INDEX "Profile_index_idx" ON "Profile"("index");

-- CreateIndex
CREATE UNIQUE INDEX "Request_index_key" ON "Request"("index");

-- CreateIndex
CREATE INDEX "Request_index_idx" ON "Request"("index");
