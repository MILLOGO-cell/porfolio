-- Étend `projects` pour porter une étude de cas, et non plus une simple vignette.

-- AlterTable : champs d'étude de cas
ALTER TABLE "projects" ADD COLUMN     "summary" TEXT,
                       ADD COLUMN     "context" TEXT,
                       ADD COLUMN     "role" TEXT,
                       ADD COLUMN     "challenges" TEXT,
                       ADD COLUMN     "outcome" TEXT,
                       ADD COLUMN     "client" TEXT,
                       ADD COLUMN     "period" TEXT,
                       ADD COLUMN     "stack" TEXT[],
                       ADD COLUMN     "repo_url" TEXT,
                       ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0,
                       ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable : `slug` est UNIQUE NOT NULL, mais la table contient déjà des
-- lignes. On l'ajoute donc nullable, on le dérive du titre, puis on contraint.
ALTER TABLE "projects" ADD COLUMN     "slug" TEXT;

WITH slugified AS (
    SELECT
        "id",
        "created_at",
        -- Les caractères non alphanumériques (y compris les accents) deviennent
        -- des tirets ; un titre qui se réduirait à rien retombe sur 'projet'.
        COALESCE(
            NULLIF(trim(BOTH '-' FROM regexp_replace(lower("title"), '[^a-z0-9]+', '-', 'g')), ''),
            'projet'
        ) AS base
    FROM "projects"
),
numbered AS (
    SELECT
        "id",
        base,
        ROW_NUMBER() OVER (PARTITION BY base ORDER BY "created_at", "id") AS rn
    FROM slugified
)
UPDATE "projects" p
SET "slug" = CASE WHEN n.rn = 1 THEN n.base ELSE n.base || '-' || n.rn END
FROM numbered n
WHERE p."id" = n."id";

ALTER TABLE "projects" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_published_featured_idx" ON "projects"("published", "featured");
