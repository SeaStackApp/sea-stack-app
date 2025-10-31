-- CreateTable
CREATE TABLE "_OrganizationToProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrganizationToProject_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_OrganizationToServer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrganizationToServer_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_OrganizationToSSHKey" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_OrganizationToSSHKey_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_OrganizationToProject_B_index" ON "_OrganizationToProject"("B");

-- CreateIndex
CREATE INDEX "_OrganizationToServer_B_index" ON "_OrganizationToServer"("B");

-- CreateIndex
CREATE INDEX "_OrganizationToSSHKey_B_index" ON "_OrganizationToSSHKey"("B");

-- AddForeignKey
ALTER TABLE "_OrganizationToProject" ADD CONSTRAINT "_OrganizationToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToProject" ADD CONSTRAINT "_OrganizationToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToServer" ADD CONSTRAINT "_OrganizationToServer_A_fkey" FOREIGN KEY ("A") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToServer" ADD CONSTRAINT "_OrganizationToServer_B_fkey" FOREIGN KEY ("B") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToSSHKey" ADD CONSTRAINT "_OrganizationToSSHKey_A_fkey" FOREIGN KEY ("A") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToSSHKey" ADD CONSTRAINT "_OrganizationToSSHKey_B_fkey" FOREIGN KEY ("B") REFERENCES "SSHKey"("id") ON DELETE CASCADE ON UPDATE CASCADE;
