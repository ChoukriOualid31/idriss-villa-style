-- AlterTable
ALTER TABLE "site_content" ADD COLUMN     "facebookUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "instagramUrl" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "whatsappUrl" TEXT NOT NULL DEFAULT '';
