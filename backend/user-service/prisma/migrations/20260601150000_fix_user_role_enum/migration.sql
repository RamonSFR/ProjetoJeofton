-- CreateEnum
DO $$
BEGIN
  CREATE TYPE "role" AS ENUM ('CLIENTE', 'GERENTE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AlterTable
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'users'
      AND column_name = 'role'
  ) THEN
    ALTER TABLE "users"
      ALTER COLUMN "role" DROP DEFAULT;

    ALTER TABLE "users"
      ALTER COLUMN "role" TYPE "role"
      USING (
        CASE
          WHEN lower("role"::text) IN ('gerente', 'manager') THEN 'GERENTE'::"role"
          ELSE 'CLIENTE'::"role"
        END
      );

    ALTER TABLE "users"
      ALTER COLUMN "role" SET DEFAULT 'CLIENTE';
  ELSE
    ALTER TABLE "users"
      ADD COLUMN "role" "role" NOT NULL DEFAULT 'CLIENTE';
  END IF;
END $$;
