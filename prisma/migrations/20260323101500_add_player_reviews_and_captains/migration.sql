-- AlterTable
ALTER TABLE "Team" ADD COLUMN "captainPlayerId" TEXT;

-- CreateTable
CREATE TABLE "PlayerReview" (
    "id" TEXT NOT NULL,
    "authorPlayerId" TEXT NOT NULL,
    "targetPlayerId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "showOnProfile" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlayerReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerReview_authorPlayerId_targetPlayerId_key" ON "PlayerReview"("authorPlayerId", "targetPlayerId");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_captainPlayerId_fkey" FOREIGN KEY ("captainPlayerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerReview" ADD CONSTRAINT "PlayerReview_authorPlayerId_fkey" FOREIGN KEY ("authorPlayerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerReview" ADD CONSTRAINT "PlayerReview_targetPlayerId_fkey" FOREIGN KEY ("targetPlayerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;