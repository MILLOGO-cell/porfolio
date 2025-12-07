-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_code_expiry" TIMESTAMP(3),
ADD COLUMN     "email_code_secret" TEXT,
ADD COLUMN     "profile_image" TEXT,
ADD COLUMN     "totp_secret" TEXT,
ADD COLUMN     "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "two_factor_method" TEXT;
