-- CreateTable
CREATE TABLE "public"."HeroSetting" (
    "id" TEXT NOT NULL,
    "pageKey" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "title" VARCHAR(200),
    "description" TEXT,
    "message" VARCHAR(200),
    "bookText" VARCHAR(100),
    "bookHref" VARCHAR(300),
    "bgImage" VARCHAR(600),
    "overlayOpacity" DOUBLE PRECISION NOT NULL DEFAULT 0.45,
    "offsetHeader" BOOLEAN NOT NULL DEFAULT true,
    "height" TEXT NOT NULL DEFAULT 'default',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HeroSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HeroSetting_pageKey_language_key" ON "public"."HeroSetting"("pageKey", "language");
