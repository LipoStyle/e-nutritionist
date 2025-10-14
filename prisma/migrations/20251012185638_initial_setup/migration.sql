-- CreateEnum
CREATE TYPE "public"."Lang" AS ENUM ('en', 'es', 'el');

-- CreateEnum
CREATE TYPE "public"."Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateTable
CREATE TABLE "public"."service_plans" (
    "id" TEXT NOT NULL,
    "language" "public"."Lang" NOT NULL,
    "slug" TEXT NOT NULL,
    "title" VARCHAR(140) NOT NULL,
    "summary" VARCHAR(200),
    "description" TEXT NOT NULL,
    "priceCents" INTEGER NOT NULL,
    "billingPeriod" VARCHAR(40),
    "order" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."service_plan_features" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "name" VARCHAR(300) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_plan_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recipes" (
    "id" TEXT NOT NULL,
    "language" "public"."Lang" NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT,
    "publishedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recipe_ingredients" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "size" TEXT NOT NULL,

    CONSTRAINT "recipe_ingredients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recipe_instructions" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "stepContent" TEXT NOT NULL,

    CONSTRAINT "recipe_instructions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recipe_valuable_info" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "difficulty" "public"."Difficulty" NOT NULL DEFAULT 'easy',
    "portions" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "recipe_valuable_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recipe_nutritional_facts" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "size" TEXT NOT NULL,

    CONSTRAINT "recipe_nutritional_facts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."recipe_meta_info" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,

    CONSTRAINT "recipe_meta_info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_plans_language_order_idx" ON "public"."service_plans"("language", "order");

-- CreateIndex
CREATE UNIQUE INDEX "service_plans_language_slug_key" ON "public"."service_plans"("language", "slug");

-- CreateIndex
CREATE INDEX "service_plan_features_planId_order_idx" ON "public"."service_plan_features"("planId", "order");

-- CreateIndex
CREATE INDEX "recipes_language_category_publishedDate_idx" ON "public"."recipes"("language", "category", "publishedDate");

-- CreateIndex
CREATE UNIQUE INDEX "recipes_language_slug_key" ON "public"."recipes"("language", "slug");

-- CreateIndex
CREATE INDEX "recipe_ingredients_recipeId_idx" ON "public"."recipe_ingredients"("recipeId");

-- CreateIndex
CREATE INDEX "recipe_instructions_recipeId_stepNumber_idx" ON "public"."recipe_instructions"("recipeId", "stepNumber");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_valuable_info_recipeId_key" ON "public"."recipe_valuable_info"("recipeId");

-- CreateIndex
CREATE INDEX "recipe_nutritional_facts_recipeId_idx" ON "public"."recipe_nutritional_facts"("recipeId");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_meta_info_recipeId_key" ON "public"."recipe_meta_info"("recipeId");

-- AddForeignKey
ALTER TABLE "public"."service_plan_features" ADD CONSTRAINT "service_plan_features_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."service_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "public"."recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recipe_instructions" ADD CONSTRAINT "recipe_instructions_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "public"."recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recipe_valuable_info" ADD CONSTRAINT "recipe_valuable_info_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "public"."recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recipe_nutritional_facts" ADD CONSTRAINT "recipe_nutritional_facts_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "public"."recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."recipe_meta_info" ADD CONSTRAINT "recipe_meta_info_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "public"."recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
