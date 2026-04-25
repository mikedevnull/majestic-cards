-- CreateTable
CREATE TABLE "PlaybackItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "backendUrl" TEXT,
    "imageUrl" TEXT,
    "triggerId" TEXT
);
