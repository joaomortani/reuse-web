-- AlterEnum
BEGIN;
CREATE TYPE "public"."ItemCondition_new" AS ENUM ('NEW', 'USED', 'DAMAGED');
ALTER TABLE "public"."Item" ALTER COLUMN "condition" TYPE "public"."ItemCondition_new" USING ("condition"::text::"public"."ItemCondition_new");
ALTER TYPE "public"."ItemCondition" RENAME TO "ItemCondition_old";
ALTER TYPE "public"."ItemCondition_new" RENAME TO "ItemCondition";
DROP TYPE "public"."ItemCondition_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Image" DROP CONSTRAINT "Image_itemId_fkey";

-- AlterTable
ALTER TABLE "public"."Item" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Uncategorized',
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE "public"."Image";

