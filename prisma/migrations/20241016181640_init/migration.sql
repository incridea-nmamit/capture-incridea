/*
  Warnings:

  - You are about to drop the column `committee` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `member_committee` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `member_designation` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `member_name` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "committee",
DROP COLUMN "image",
DROP COLUMN "name",
ADD COLUMN     "member_committee" TEXT NOT NULL,
ADD COLUMN     "member_designation" TEXT NOT NULL,
ADD COLUMN     "member_name" TEXT NOT NULL;

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "Events" (
    "id" SERIAL NOT NULL,
    "event_name" TEXT NOT NULL,
    "event_description" TEXT NOT NULL,
    "event_log" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "event_day" TEXT NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebAnalytics" (
    "id" SERIAL NOT NULL,
    "ip_address" TEXT NOT NULL,
    "date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DownloadLog" (
    "id" SERIAL NOT NULL,
    "ip_address" TEXT NOT NULL,
    "date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image" TEXT NOT NULL,

    CONSTRAINT "DownloadLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "user" TEXT NOT NULL,
    "audit_description" TEXT NOT NULL,
    "date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventAnalysis" (
    "id" SERIAL NOT NULL,
    "event_name" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gallery" (
    "id" SERIAL NOT NULL,
    "image_path" TEXT NOT NULL,
    "image_name" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "image_type" TEXT NOT NULL,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);
