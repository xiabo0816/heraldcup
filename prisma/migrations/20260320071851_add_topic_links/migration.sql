-- AlterTable
ALTER TABLE "ContentPage" ADD COLUMN     "topicId" TEXT;

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "topicId" TEXT;

-- AlterTable
ALTER TABLE "RecruitmentPost" ADD COLUMN     "topicId" TEXT;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "CommunityTopic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentPage" ADD CONSTRAINT "ContentPage_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "CommunityTopic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecruitmentPost" ADD CONSTRAINT "RecruitmentPost_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "CommunityTopic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
