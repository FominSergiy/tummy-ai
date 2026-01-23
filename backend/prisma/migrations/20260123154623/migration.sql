/*
  Warnings:

  - The primary key for the `ingredient_analyses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "file_uploads" DROP CONSTRAINT "file_uploads_user_id_fkey";

-- DropForeignKey
ALTER TABLE "ingredient_analyses" DROP CONSTRAINT "ingredient_analyses_user_id_fkey";

-- AlterTable
ALTER TABLE "file_uploads" ALTER COLUMN "user_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ingredient_analyses" DROP CONSTRAINT "ingredient_analyses_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ingredient_analyses_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ingredient_analyses_id_seq";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AlterTable
ALTER TABLE "file_uploads" DROP CONSTRAINT "file_uploads_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "file_uploads_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "file_uploads_id_seq";


-- AddForeignKey
ALTER TABLE "file_uploads" ADD CONSTRAINT "file_uploads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ingredient_analyses" ADD CONSTRAINT "ingredient_analyses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
