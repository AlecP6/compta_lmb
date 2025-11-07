-- Step 1: Add username column as nullable first
ALTER TABLE "User" ADD COLUMN "username" TEXT;

-- Step 2: Update existing users - generate username from email or id
UPDATE "User" SET "username" = CASE 
  WHEN "email" IS NOT NULL AND "email" != '' THEN substr("email", 1, instr("email" || '@', '@') - 1)
  ELSE 'user_' || substr(hex(randomblob(4)), 1, 8)
END
WHERE "username" IS NULL;

-- Step 3: Make sure usernames are unique by appending numbers if needed
-- This is handled by the application logic

-- Step 4: Create unique index (will fail if duplicates exist, handled by app)
-- We'll recreate the table to make username NOT NULL and unique
PRAGMA foreign_keys=OFF;
CREATE TABLE "User_new" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "User_new" SELECT "id", COALESCE("username", 'user_' || substr(hex(randomblob(4)), 1, 8)), "password", "name", "email", "createdAt", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "User_new" RENAME TO "User";
PRAGMA foreign_keys=ON;
