-- CreateTable
CREATE TABLE "_NetworkToServer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NetworkToServer_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_NetworkToServer_B_index" ON "_NetworkToServer"("B");

-- AddForeignKey
ALTER TABLE "_NetworkToServer" ADD CONSTRAINT "_NetworkToServer_A_fkey" FOREIGN KEY ("A") REFERENCES "Network"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NetworkToServer" ADD CONSTRAINT "_NetworkToServer_B_fkey" FOREIGN KEY ("B") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;
