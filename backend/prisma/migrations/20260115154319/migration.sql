-- CreateEnum
CREATE TYPE "AnalysisStatus" AS ENUM ('PENDING', 'ANALYZING', 'COMPLETED', 'COMMITTED', 'DECLINED', 'ERROR');

-- CreateTable
CREATE TABLE "ingredient_analyses" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "file_key" TEXT NOT NULL,
    "compressed_file_key" TEXT,
    "status" "AnalysisStatus" NOT NULL DEFAULT 'PENDING',
    "analysis_data" JSONB,
    "product_name" TEXT,
    "brand_name" TEXT,
    "total_calories" DECIMAL(10,2),
    "total_sugar" DECIMAL(10,2),
    "total_carbs" DECIMAL(10,2),
    "total_protein" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "analyzed_at" TIMESTAMP(3),
    "committed_at" TIMESTAMP(3),

    CONSTRAINT "ingredient_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ingredient_analyses_user_id_analyzed_at_idx" ON "ingredient_analyses"("user_id", "analyzed_at");

-- CreateIndex
CREATE INDEX "ingredient_analyses_user_id_status_idx" ON "ingredient_analyses"("user_id", "status");

-- AddForeignKey
ALTER TABLE "ingredient_analyses" ADD CONSTRAINT "ingredient_analyses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
