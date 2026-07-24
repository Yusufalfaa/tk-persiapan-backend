/*
  Warnings:

  - You are about to drop the column `content` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `imagePath` on the `news` table. All the data in the column will be lost.
  - You are about to drop the `gallery_photos` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `news` DROP COLUMN `content`,
    DROP COLUMN `imagePath`;

-- DropTable
DROP TABLE `gallery_photos`;

-- CreateTable
CREATE TABLE `news_sections` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('TEXT', 'IMAGE', 'YOUTUBE') NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `text` TEXT NULL,
    `youtubeUrl` VARCHAR(500) NULL,
    `imageLayout` ENUM('SINGLE', 'GRID', 'CAROUSEL') NULL,
    `newsId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `news_sections_newsId_idx`(`newsId`),
    INDEX `news_sections_order_idx`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news_section_images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `imagePath` VARCHAR(500) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `sectionId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `news_section_images_sectionId_idx`(`sectionId`),
    INDEX `news_section_images_order_idx`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `news_sections` ADD CONSTRAINT `news_sections_newsId_fkey` FOREIGN KEY (`newsId`) REFERENCES `news`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `news_section_images` ADD CONSTRAINT `news_section_images_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `news_sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
