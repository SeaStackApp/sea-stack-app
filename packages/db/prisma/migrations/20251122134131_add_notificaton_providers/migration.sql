-- CreateTable
CREATE TABLE "NotificationProvider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "NotificationProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SMTPNotificationProvider" (
    "id" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fromAddress" TEXT NOT NULL,

    CONSTRAINT "SMTPNotificationProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiscordNotificationProvider" (
    "id" TEXT NOT NULL,
    "webhook" TEXT NOT NULL,

    CONSTRAINT "DiscordNotificationProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelegramNotificationProvider" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,

    CONSTRAINT "TelegramNotificationProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "notificationProviderId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_NotificationProviderToOrganization" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_NotificationProviderToOrganization_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notification_type_organizationId_notificationProviderId_key" ON "Notification"("type", "organizationId", "notificationProviderId");

-- CreateIndex
CREATE INDEX "_NotificationProviderToOrganization_B_index" ON "_NotificationProviderToOrganization"("B");

-- AddForeignKey
ALTER TABLE "SMTPNotificationProvider" ADD CONSTRAINT "SMTPNotificationProvider_id_fkey" FOREIGN KEY ("id") REFERENCES "NotificationProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiscordNotificationProvider" ADD CONSTRAINT "DiscordNotificationProvider_id_fkey" FOREIGN KEY ("id") REFERENCES "NotificationProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramNotificationProvider" ADD CONSTRAINT "TelegramNotificationProvider_id_fkey" FOREIGN KEY ("id") REFERENCES "NotificationProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_notificationProviderId_fkey" FOREIGN KEY ("notificationProviderId") REFERENCES "NotificationProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotificationProviderToOrganization" ADD CONSTRAINT "_NotificationProviderToOrganization_A_fkey" FOREIGN KEY ("A") REFERENCES "NotificationProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NotificationProviderToOrganization" ADD CONSTRAINT "_NotificationProviderToOrganization_B_fkey" FOREIGN KEY ("B") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
