CREATE TABLE `indices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`symbol` varchar(20) NOT NULL,
	`name` varchar(255) NOT NULL,
	`value` decimal(15,2) NOT NULL,
	`change` decimal(10,2) NOT NULL,
	`changePercent` decimal(10,2) NOT NULL,
	`lastUpdated` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `indices_id` PRIMARY KEY(`id`),
	CONSTRAINT `indices_symbol_unique` UNIQUE(`symbol`)
);
--> statement-breakpoint
CREATE TABLE `ipos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`symbol` varchar(10),
	`companyName` varchar(255) NOT NULL,
	`ipoDate` timestamp,
	`status` enum('upcoming','recent','completed') NOT NULL DEFAULT 'upcoming',
	`pricingDate` timestamp,
	`offeringPrice` decimal(10,2),
	`shares` varchar(20),
	`proceeds` varchar(20),
	`underwriters` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ipos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `news` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`url` varchar(2048) NOT NULL,
	`source` varchar(255) NOT NULL,
	`imageUrl` varchar(2048),
	`publishedAt` timestamp NOT NULL,
	`sentiment` enum('positive','negative','neutral') DEFAULT 'neutral',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `news_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `screeners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`filters` text NOT NULL,
	`isPublic` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `screeners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`symbol` varchar(10) NOT NULL,
	`name` varchar(255) NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`change` decimal(10,2) NOT NULL,
	`changePercent` decimal(10,2) NOT NULL,
	`volume` varchar(20),
	`marketCap` varchar(20),
	`peRatio` decimal(10,2),
	`dividendYield` decimal(10,2),
	`lastUpdated` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stocks_id` PRIMARY KEY(`id`),
	CONSTRAINT `stocks_symbol_unique` UNIQUE(`symbol`)
);
--> statement-breakpoint
CREATE TABLE `watchlist` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stockId` int NOT NULL,
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `watchlist_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `indices_symbol_idx` ON `indices` (`symbol`);--> statement-breakpoint
CREATE INDEX `ipos_status_idx` ON `ipos` (`status`);--> statement-breakpoint
CREATE INDEX `ipos_date_idx` ON `ipos` (`ipoDate`);--> statement-breakpoint
CREATE INDEX `news_published_idx` ON `news` (`publishedAt`);--> statement-breakpoint
CREATE INDEX `screeners_user_idx` ON `screeners` (`userId`);--> statement-breakpoint
CREATE INDEX `symbol_idx` ON `stocks` (`symbol`);--> statement-breakpoint
CREATE INDEX `watchlist_user_idx` ON `watchlist` (`userId`);--> statement-breakpoint
CREATE INDEX `watchlist_stock_idx` ON `watchlist` (`stockId`);