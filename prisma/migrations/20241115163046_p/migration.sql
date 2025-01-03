-- CreateEnum
CREATE TYPE "RemovalRequestStatus" AS ENUM ('pending', 'declined', 'approved');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('core', 'technical', 'nontechnical', 'special');

-- CreateEnum
CREATE TYPE "Day" AS ENUM ('day1', 'day2', 'day3');

-- CreateEnum
CREATE TYPE "State" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "Teamgroup" AS ENUM ('media', 'digital', 'socialmedia', 'developer', 'none');

-- CreateEnum
CREATE TYPE "position" AS ENUM ('mediahead', 'mediacohead', 'leadvideographer', 'leadphotographer', 'photographer', 'videographer', 'aerialvideographer', 'socialmediahead', 'socialmediacohead', 'socialmediateam', 'frontenddev', 'backenddev', 'fullstackdev', 'teamleadfrontenddev', 'teamleadbackenddev', 'teamleadfullstackdev', 'digitalhead', 'digitalcohead', 'digitalteam', 'none');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'manager', 'editor', 'user');

-- CreateEnum
CREATE TYPE "CardState" AS ENUM ('active', 'inactive');

-- CreateTable
CREATE TABLE "RemovalRequest" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "idcard" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_path" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "RemovalRequestStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "RemovalRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "day" "Day" NOT NULL,
    "visibility" "State" NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "committee" "Teamgroup" NOT NULL,
    "designation" "position" NOT NULL,
    "image" TEXT NOT NULL,
    "say" TEXT NOT NULL,

    CONSTRAINT "team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webAnalytics" (
    "id" SERIAL NOT NULL,
    "cookie_id" TEXT NOT NULL,
    "page_name" TEXT NOT NULL,
    "time_spent" INTEGER NOT NULL,
    "date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "downloadLog" (
    "id" SERIAL NOT NULL,
    "ip_address" TEXT NOT NULL,
    "date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file_path" TEXT NOT NULL,

    CONSTRAINT "downloadLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditLog" (
    "id" SERIAL NOT NULL,
    "user" TEXT NOT NULL,
    "audit_description" TEXT NOT NULL,
    "date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gallery" (
    "id" SERIAL NOT NULL,
    "image_path" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "event_category" TEXT NOT NULL,
    "date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stories" (
    "id" SERIAL NOT NULL,
    "event_name" TEXT NOT NULL,
    "date_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "file_path" TEXT NOT NULL,

    CONSTRAINT "Stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "refresh_token_expires_in" INTEGER,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "CaptureCard" (
    "id" SERIAL NOT NULL,
    "cardName" TEXT NOT NULL,
    "cardState" "CardState" NOT NULL,
    "cardRtime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaptureCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "liveViewers" (
    "id" SERIAL NOT NULL,
    "routePath" TEXT NOT NULL,
    "viewerCount" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "liveViewers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_name_key" ON "events"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
