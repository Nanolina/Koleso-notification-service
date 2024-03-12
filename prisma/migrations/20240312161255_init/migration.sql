-- CreateEnum
CREATE TYPE "EmailTemplate" AS ENUM ('CONFIRMATION', 'PASSWORD_RESET');

-- CreateTable
CREATE TABLE "Email" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "template" "EmailTemplate" NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Email_pkey" PRIMARY KEY ("id")
);
