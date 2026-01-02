import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, index } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Stock data table for caching real-time and historical stock information
export const stocks = mysqlTable("stocks", {
  id: int("id").autoincrement().primaryKey(),
  symbol: varchar("symbol", { length: 10 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  change: decimal("change", { precision: 10, scale: 2 }).notNull(),
  changePercent: decimal("changePercent", { precision: 10, scale: 2 }).notNull(),
  volume: varchar("volume", { length: 20 }),
  marketCap: varchar("marketCap", { length: 20 }),
  peRatio: decimal("peRatio", { precision: 10, scale: 2 }),
  dividendYield: decimal("dividendYield", { precision: 10, scale: 2 }),
  lastUpdated: timestamp("lastUpdated").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  symbolIdx: index("symbol_idx").on(table.symbol),
}));

export type Stock = typeof stocks.$inferSelect;
export type InsertStock = typeof stocks.$inferInsert;

// Market indices table for tracking S&P500, Nasdaq, Dow Jones, Russell 2000
export const indices = mysqlTable("indices", {
  id: int("id").autoincrement().primaryKey(),
  symbol: varchar("symbol", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  value: decimal("value", { precision: 15, scale: 2 }).notNull(),
  change: decimal("change", { precision: 10, scale: 2 }).notNull(),
  changePercent: decimal("changePercent", { precision: 10, scale: 2 }).notNull(),
  lastUpdated: timestamp("lastUpdated").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  symbolIdx: index("indices_symbol_idx").on(table.symbol),
}));

export type Index = typeof indices.$inferSelect;
export type InsertIndex = typeof indices.$inferInsert;

// User watchlist table for tracking favorite stocks
export const watchlist = mysqlTable("watchlist", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  stockId: int("stockId").notNull(),
  addedAt: timestamp("addedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdx: index("watchlist_user_idx").on(table.userId),
  stockIdx: index("watchlist_stock_idx").on(table.stockId),
}));

export type Watchlist = typeof watchlist.$inferSelect;
export type InsertWatchlist = typeof watchlist.$inferInsert;

// Stock screener filters table for saved custom screeners
export const screeners = mysqlTable("screeners", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  filters: text("filters").notNull(), // JSON string of filter criteria
  isPublic: boolean("isPublic").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userIdx: index("screeners_user_idx").on(table.userId),
}));

export type Screener = typeof screeners.$inferSelect;
export type InsertScreener = typeof screeners.$inferInsert;

// Market news table for caching financial news articles
export const news = mysqlTable("news", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  url: varchar("url", { length: 2048 }).notNull(),
  source: varchar("source", { length: 255 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 2048 }),
  publishedAt: timestamp("publishedAt").notNull(),
  sentiment: mysqlEnum("sentiment", ["positive", "negative", "neutral"]).default("neutral"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  publishedIdx: index("news_published_idx").on(table.publishedAt),
}));

export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;

// IPO table for tracking initial public offerings
export const ipos = mysqlTable("ipos", {
  id: int("id").autoincrement().primaryKey(),
  symbol: varchar("symbol", { length: 10 }),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  ipoDate: timestamp("ipoDate"),
  status: mysqlEnum("status", ["upcoming", "recent", "completed"]).default("upcoming").notNull(),
  pricingDate: timestamp("pricingDate"),
  offeringPrice: decimal("offeringPrice", { precision: 10, scale: 2 }),
  shares: varchar("shares", { length: 20 }),
  proceeds: varchar("proceeds", { length: 20 }),
  underwriters: text("underwriters"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  statusIdx: index("ipos_status_idx").on(table.status),
  dateIdx: index("ipos_date_idx").on(table.ipoDate),
}));

export type IPO = typeof ipos.$inferSelect;
export type InsertIPO = typeof ipos.$inferInsert;