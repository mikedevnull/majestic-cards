-- CreateTable
CREATE TABLE "PlaybackItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "backendUrl" TEXT,
    "imageUrl" TEXT,
    "triggerId" TEXT
);
