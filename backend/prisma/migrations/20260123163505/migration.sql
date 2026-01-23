/*
  Warnings:

  - You are about to drop the column `compressed_file_key` on the `ingredient_analyses` table. All the data in the column will be lost.
  - You are about to drop the column `file_key` on the `ingredient_analyses` table. All the data in the column will be lost.
  - You are about to drop the `file_uploads` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "file_uploads" DROP CONSTRAINT "file_uploads_user_id_fkey";

-- AlterTable
ALTER TABLE "ingredient_analyses" DROP COLUMN "compressed_file_key",
DROP COLUMN "file_key";

-- DropTable
DROP TABLE "file_uploads";

-- CreateTable
CREATE TABLE "image_uploads" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "analysis_id" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "file_key" TEXT NOT NULL,
    "compressed_file_key" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "image_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "image_uploads_analysis_id_idx" ON "image_uploads"("analysis_id");

-- AddForeignKey
ALTER TABLE "image_uploads" ADD CONSTRAINT "image_uploads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "image_uploads" ADD CONSTRAINT "image_uploads_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "ingredient_analyses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
