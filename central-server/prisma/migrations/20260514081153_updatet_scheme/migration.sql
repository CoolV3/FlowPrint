/*
  Warnings:

  - You are about to drop the `ClientServer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClientServer" DROP CONSTRAINT "ClientServer_userId_fkey";

-- DropTable
DROP TABLE "ClientServer";

-- CreateTable
CREATE TABLE "ClientWorker" (
    "id" SERIAL NOT NULL,
    "friendlyName" TEXT NOT NULL,
    "secureKey" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ClientWorker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientWorker_secureKey_key" ON "ClientWorker"("secureKey");

-- AddForeignKey
ALTER TABLE "ClientWorker" ADD CONSTRAINT "ClientWorker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
