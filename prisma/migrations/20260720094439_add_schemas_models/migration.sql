-- CreateTable
CREATE TABLE `admins` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `role` VARCHAR(20) NOT NULL DEFAULT 'ADMIN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admins_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gallery_photos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `imagePath` VARCHAR(500) NOT NULL,
    `caption` VARCHAR(255) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `gallery_photos_order_idx`(`order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `imagePath` VARCHAR(500) NOT NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `news_slug_key`(`slug`),
    INDEX `news_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school_profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `vision` TEXT NOT NULL,
    `address` VARCHAR(500) NOT NULL,
    `latitude` DECIMAL(9, 6) NOT NULL,
    `longitude` DECIMAL(9, 6) NOT NULL,
    `googleMapsUrl` VARCHAR(500) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `videoUrl` VARCHAR(500) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school_missions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(500) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `schoolId` INTEGER NOT NULL DEFAULT 1,

    INDEX `school_missions_schoolId_idx`(`schoolId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `school_missions` ADD CONSTRAINT `school_missions_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `school_profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
