-- Galerie de captures : une application a plusieurs ecrans, une seule image ne
-- rend pas compte de ce qui a ete construit.

-- AlterTable
ALTER TABLE "projects" ADD COLUMN "gallery" TEXT[];

UPDATE "projects" SET "gallery" = ARRAY[]::TEXT[] WHERE "gallery" IS NULL;
