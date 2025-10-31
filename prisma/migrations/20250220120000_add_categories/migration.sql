-- DropIndex
DROP INDEX "public"."Category_slug_key";

-- AlterTable
ALTER TABLE "public"."Category" DROP COLUMN "slug";

-- AlterTable
ALTER TABLE "public"."Item" DROP COLUMN "category";
