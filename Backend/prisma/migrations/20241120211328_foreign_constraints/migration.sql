-- DropForeignKey
ALTER TABLE `authTokens` DROP FOREIGN KEY `authtokens_userid_foreign`;

-- DropForeignKey
ALTER TABLE `privateList` DROP FOREIGN KEY `privatelist_recipeid_foreign`;

-- DropForeignKey
ALTER TABLE `privateList` DROP FOREIGN KEY `privatelist_userid_foreign`;

-- DropForeignKey
ALTER TABLE `recipes` DROP FOREIGN KEY `recipes_authorid_foreign`;

-- DropForeignKey
ALTER TABLE `recipes` DROP FOREIGN KEY `recipes_typeid_foreign`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_recipeid_foreign`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `reviews_userid_foreign`;

-- AlterTable
ALTER TABLE `users` MODIFY `active` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `authTokens` ADD CONSTRAINT `authtokens_userid_foreign` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `privateList` ADD CONSTRAINT `privatelist_recipeid_foreign` FOREIGN KEY (`recipeID`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `privateList` ADD CONSTRAINT `privatelist_userid_foreign` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipes` ADD CONSTRAINT `recipes_authorid_foreign` FOREIGN KEY (`authorID`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `recipes` ADD CONSTRAINT `recipes_typeid_foreign` FOREIGN KEY (`typeID`) REFERENCES `types`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_recipeid_foreign` FOREIGN KEY (`recipeID`) REFERENCES `recipes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `reviews_userid_foreign` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
