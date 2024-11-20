-- CreateTable
CREATE TABLE `authTokens` (
    `value` VARCHAR(255) NOT NULL,
    `userID` INTEGER UNSIGNED NOT NULL,
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `expiration` TIMESTAMP(0) NOT NULL,
    `purpose` ENUM('REFRESH', 'SIGNUP', 'PASSWORD') NOT NULL,

    UNIQUE INDEX `authtokens_value_unique`(`value`),
    INDEX `authtokens_userid_foreign`(`userID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `privateList` (
    `userID` INTEGER UNSIGNED NOT NULL,
    `recipeID` INTEGER UNSIGNED NOT NULL,
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,

    INDEX `privatelist_userid_foreign`(`userID`),
    UNIQUE INDEX `privatelist_recipeid_userid_unique`(`recipeID`, `userID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recipes` (
    `images` VARCHAR(255) NULL,
    `typeID` INTEGER UNSIGNED NULL,
    `description` TEXT NULL,
    `uploadTime` TIMESTAMP(0) NOT NULL,
    `authorID` INTEGER UNSIGNED NOT NULL,
    `cookingTime` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `difficulty` INTEGER NULL,
    `uuid` CHAR(36) NOT NULL,

    UNIQUE INDEX `recipes_uuid_unique`(`uuid`),
    INDEX `recipes_authorid_foreign`(`authorID`),
    INDEX `recipes_typeid_foreign`(`typeID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `userID` INTEGER UNSIGNED NOT NULL,
    `recipeID` INTEGER UNSIGNED NOT NULL,
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `rating` DOUBLE NOT NULL,
    `comment` TEXT NULL,
    `uploadTime` TIMESTAMP(0) NOT NULL,

    INDEX `reviews_userid_foreign`(`userID`),
    UNIQUE INDEX `reviews_recipeid_userid_unique`(`recipeID`, `userID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `types` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `types_name_unique`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `password` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NULL,
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `description` TEXT NULL,
    `name` VARCHAR(255) NULL,
    `email` VARCHAR(255) NULL,
    `active` BOOLEAN NOT NULL,
    `telephone` VARCHAR(255) NULL,
    `uploadTime` TIMESTAMP(0) NOT NULL,
    `username` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `users_password_unique`(`password`),
    UNIQUE INDEX `users_image_unique`(`image`),
    UNIQUE INDEX `users_email_unique`(`email`),
    UNIQUE INDEX `users_telephone_unique`(`telephone`),
    UNIQUE INDEX `users_username_unique`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `authTokens` ADD CONSTRAINT `authtokens_userid_foreign` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `privateList` ADD CONSTRAINT `privatelist_recipeid_foreign` FOREIGN KEY (`recipeID`) REFERENCES `recipes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `privateList` ADD CONSTRAINT `privatelist_userid_foreign` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recipes` ADD CONSTRAINT `recipes_authorid_foreign` FOREIGN KEY (`authorID`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `recipes` ADD CONSTRAINT `recipes_typeid_foreign` FOREIGN KEY (`typeID`) REFERENCES `types`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_recipeid_foreign` FOREIGN KEY (`recipeID`) REFERENCES `recipes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_userid_foreign` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

