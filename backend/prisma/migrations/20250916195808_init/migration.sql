CREATE SCHEMA IF NOT EXISTS "app";

-- CreateEnum
CREATE TYPE "app"."FileType" AS ENUM ('IMAGE', 'TEXT', 'AUDIO');

-- CreateTable
CREATE TABLE "app"."file_uploads" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" "app"."FileType" NOT NULL,
    "file_path" TEXT NOT NULL,

    CONSTRAINT "file_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app"."users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "app"."users"("email");

-- AddForeignKey
ALTER TABLE "app"."file_uploads" ADD CONSTRAINT "file_uploads_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "app"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
