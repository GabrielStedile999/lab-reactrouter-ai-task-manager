
-- CreateTable
CREATE TABLE "chats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "steps" TEXT,
    "estimated_time" TEXT NOT NULL,
    "implementation_suggestion" TEXT,
    "acceptance_criteria" TEXT,
    "suggested_tests" TEXT,
    "content" TEXT,
    "chat_history" TEXT,
    "chat_id" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "tasks_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chats" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_tasks" ("acceptance_criteria", "chat_history", "content", "created_at", "description", "estimated_time", "id", "implementation_suggestion", "steps", "suggested_tests", "title", "updated_at") SELECT "acceptance_criteria", "chat_history", "content", "created_at", "description", "estimated_time", "id", "implementation_suggestion", "steps", "suggested_tests", "title", "updated_at" FROM "tasks";
DROP TABLE "tasks";
ALTER TABLE "new_tasks" RENAME TO "tasks";
CREATE UNIQUE INDEX "tasks_chat_id_key" ON "tasks"("chat_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
