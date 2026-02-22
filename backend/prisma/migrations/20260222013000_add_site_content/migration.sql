-- CreateTable
CREATE TABLE "site_content" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "aboutAdminNote" TEXT NOT NULL,
    "contactHeaderTitle" TEXT NOT NULL,
    "contactHeaderDescription" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactAddress" TEXT NOT NULL,
    "contactHours" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_content_pkey" PRIMARY KEY ("id")
);
