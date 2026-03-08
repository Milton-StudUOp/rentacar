/*
  Warnings:

  - You are about to drop the column `routeId` on the `transfer_bookings` table. All the data in the column will be lost.
  - You are about to alter the column `url` on the `vehicle_images` table. The data in that column could be lost. The data in that column will be cast from `VarChar(500)` to `VarChar(400)`.
  - You are about to drop the `transfer_routes` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[reference]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `destination` to the `transfer_bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `origin` to the `transfer_bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceId` to the `transfer_bookings` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `bookings_userId_fkey` ON `bookings`;

-- DropIndex
DROP INDEX `transfer_bookings_routeId_fkey` ON `transfer_bookings`;

-- DropIndex
DROP INDEX `vehicle_bookings_vehicleId_fkey` ON `vehicle_bookings`;

-- DropIndex
DROP INDEX `vehicle_images_vehicleId_fkey` ON `vehicle_images`;

-- DropIndex
DROP INDEX `vehicle_region_regionId_fkey` ON `vehicle_region`;

-- AlterTable
ALTER TABLE `bookings` ADD COLUMN `clientArchived` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `rating` INTEGER NULL,
    ADD COLUMN `ratingComment` TEXT NULL,
    MODIFY `status` ENUM('PENDING', 'CONFIRMED', 'PAID', 'AWAITING_DELIVERY', 'DELIVERED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `payments` ADD COLUMN `receiptUrl` VARCHAR(400) NULL,
    ADD COLUMN `reference` VARCHAR(50) NULL;

-- AlterTable
ALTER TABLE `transfer_bookings` DROP COLUMN `routeId`,
    ADD COLUMN `destination` VARCHAR(255) NOT NULL,
    ADD COLUMN `isRoundTrip` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `origin` VARCHAR(255) NOT NULL,
    ADD COLUMN `returnDate` DATE NULL,
    ADD COLUMN `returnTime` VARCHAR(5) NULL,
    ADD COLUMN `serviceId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `vehicle_images` MODIFY `url` VARCHAR(400) NOT NULL;

-- DropTable
DROP TABLE `transfer_routes`;

-- CreateTable
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `payments_reference_key` ON `payments`(`reference`);

-- AddForeignKey
ALTER TABLE `vehicle_images` ADD CONSTRAINT `vehicle_images_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicle_region` ADD CONSTRAINT `vehicle_region_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicle_region` ADD CONSTRAINT `vehicle_region_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `regions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicle_availability` ADD CONSTRAINT `vehicle_availability_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `bookings_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicle_bookings` ADD CONSTRAINT `vehicle_bookings_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehicle_bookings` ADD CONSTRAINT `vehicle_bookings_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transfer_bookings` ADD CONSTRAINT `transfer_bookings_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transfer_bookings` ADD CONSTRAINT `transfer_bookings_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `transfer_services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `bookings`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
