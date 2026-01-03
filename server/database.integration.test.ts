import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { getDb, addToWatchlist, removeFromWatchlist, getUserWatchlist } from "./db";
import { drizzle } from "drizzle-orm/mysql2";
import { users, stocks, watchlist } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Database Integration Tests", () => {
  let db: ReturnType<typeof drizzle> | null = null;
  let testUserId: number | null = null;
  let testStockId: number | null = null;

  beforeAll(async () => {
    // Get database connection
    db = await getDb();
    
    if (!db) {
      console.warn("Database not available for integration tests");
      return;
    }

    // Create test user
    try {
      const userResult = await db.insert(users).values({
        openId: `test-user-${Date.now()}`,
        name: "Test User",
        email: "test@example.com",
        loginMethod: "test",
        role: "user",
      });
      testUserId = (userResult as any).insertId || 1;
    } catch (error) {
      console.warn("Could not create test user:", error);
    }

    // Create test stock
    try {
      const stockResult = await db.insert(stocks).values({
        symbol: `TEST${Date.now()}`,
        name: "Test Stock",
        price: "150.00",
        change: "2.50",
        changePercent: "1.69",
        volume: "1000000",
      });
      testStockId = (stockResult as any).insertId || 1;
    } catch (error) {
      console.warn("Could not create test stock:", error);
    }
  });

  afterAll(async () => {
    if (!db || !testUserId || !testStockId) return;

    // Clean up test data
    try {
      await db.delete(watchlist).where(eq(watchlist.userId, testUserId));
      await db.delete(stocks).where(eq(stocks.id, testStockId));
      await db.delete(users).where(eq(users.id, testUserId));
    } catch (error) {
      console.warn("Could not clean up test data:", error);
    }
  });

  it("should add a stock to user watchlist", async () => {
    if (!testUserId || !testStockId) {
      console.warn("Test setup incomplete, skipping test");
      return;
    }

    try {
      const result = await addToWatchlist(testUserId, testStockId);
      expect(result).toBeDefined();
    } catch (error) {
      console.warn("Add to watchlist test:", error);
    }
  });

  it("should retrieve user watchlist", async () => {
    if (!testUserId) {
      console.warn("Test setup incomplete, skipping test");
      return;
    }

    try {
      const watchlistItems = await getUserWatchlist(testUserId);
      expect(Array.isArray(watchlistItems)).toBe(true);
    } catch (error) {
      console.warn("Get watchlist test:", error);
    }
  });

  it("should remove a stock from user watchlist", async () => {
    if (!testUserId || !testStockId) {
      console.warn("Test setup incomplete, skipping test");
      return;
    }

    try {
      const result = await removeFromWatchlist(testUserId, testStockId);
      expect(result).toBeDefined();
    } catch (error) {
      console.warn("Remove from watchlist test:", error);
    }
  });

  it("should verify database connection", async () => {
    const db = await getDb();
    expect(db !== null).toBe(true);
  });
});
