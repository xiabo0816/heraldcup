CREATE TYPE "ClaimRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

DROP TABLE IF EXISTS "ClaimRequest";
DROP TABLE IF EXISTS "PlayerReport";
DROP TABLE IF EXISTS "PlayerBinding";

CREATE TABLE "PlayerBinding" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "steamId" TEXT NOT NULL,
  "openDotaId" INTEGER,
  "status" "BindingStatus" NOT NULL DEFAULT 'PENDING',
  "lastBoundAt" TIMESTAMP(3),
  "lastError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PlayerBinding_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PlayerReport" (
  "id" TEXT NOT NULL,
  "playerId" TEXT,
  "bindingId" TEXT NOT NULL,
  "steamId" TEXT NOT NULL,
  "reportVersion" INTEGER NOT NULL DEFAULT 1,
  "summary" JSONB NOT NULL,
  "topHeroes" JSONB NOT NULL,
  "recentMatches" JSONB NOT NULL,
  "rawPayload" JSONB NOT NULL,
  "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "syncedAt" TIMESTAMP(3),
  CONSTRAINT "PlayerReport_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClaimRequest" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "playerId" TEXT NOT NULL,
  "bindingId" TEXT NOT NULL,
  "submittedSteamId" TEXT NOT NULL,
  "note" TEXT,
  "status" "ClaimRequestStatus" NOT NULL DEFAULT 'PENDING',
  "reviewNote" TEXT,
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "reviewedAt" TIMESTAMP(3),
  "reviewedByUserId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ClaimRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PlayerBinding_userId_key" ON "PlayerBinding"("userId");
CREATE UNIQUE INDEX "PlayerBinding_steamId_key" ON "PlayerBinding"("steamId");
CREATE INDEX "ClaimRequest_userId_status_idx" ON "ClaimRequest"("userId", "status");
CREATE INDEX "ClaimRequest_playerId_status_idx" ON "ClaimRequest"("playerId", "status");
CREATE INDEX "ClaimRequest_bindingId_idx" ON "ClaimRequest"("bindingId");

ALTER TABLE "PlayerBinding"
ADD CONSTRAINT "PlayerBinding_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PlayerReport"
ADD CONSTRAINT "PlayerReport_playerId_fkey"
FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "PlayerReport"
ADD CONSTRAINT "PlayerReport_bindingId_fkey"
FOREIGN KEY ("bindingId") REFERENCES "PlayerBinding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ClaimRequest"
ADD CONSTRAINT "ClaimRequest_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ClaimRequest"
ADD CONSTRAINT "ClaimRequest_playerId_fkey"
FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ClaimRequest"
ADD CONSTRAINT "ClaimRequest_bindingId_fkey"
FOREIGN KEY ("bindingId") REFERENCES "PlayerBinding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ClaimRequest"
ADD CONSTRAINT "ClaimRequest_reviewedByUserId_fkey"
FOREIGN KEY ("reviewedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;