-- AlterTable
ALTER TABLE "Player"
ADD COLUMN "preferredRoles" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "ladderScore" INTEGER,
ADD COLUMN "gameYears" INTEGER,
ADD COLUMN "playStyles" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "gameUnderstanding" TEXT;