-- Categorie de projet : une valeur unique et controlee par fiche, qui sert au
-- regroupement et au filtrage. Distincte des tags, qui restent libres.

-- AlterTable
ALTER TABLE "projects" ADD COLUMN "category" TEXT;

-- Les fiches existantes sont toutes des sites web ; on evite ainsi une
-- rubrique « Sans categorie » des la mise en service.
UPDATE "projects" SET "category" = 'Site web' WHERE "category" IS NULL;

-- CreateIndex
CREATE INDEX "projects_published_category_idx" ON "projects"("published", "category");
