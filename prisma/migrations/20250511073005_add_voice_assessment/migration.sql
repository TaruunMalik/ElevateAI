-- CreateTable
CREATE TABLE "VoiceAssessment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "responses" JSONB[],
    "improvementTip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoiceAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VoiceAssessment_userId_idx" ON "VoiceAssessment"("userId");

-- AddForeignKey
ALTER TABLE "VoiceAssessment" ADD CONSTRAINT "VoiceAssessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
