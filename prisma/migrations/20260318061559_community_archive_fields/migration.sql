-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "championTeamId" TEXT,
ADD COLUMN     "participantTeamNames" TEXT[];

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "championshipCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "championshipCount" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_championTeamId_fkey" FOREIGN KEY ("championTeamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
