-- Projets dont les ecrans ne peuvent pas etre diffuses.
-- La fiche decrit alors la conception et les choix techniques, sans visuel.

-- AlterTable
ALTER TABLE "projects" ADD COLUMN "confidential" BOOLEAN NOT NULL DEFAULT false;

-- Etat d'avancement affiche en badge. Vide pour un projet livre.
ALTER TABLE "projects" ADD COLUMN "status" TEXT;
