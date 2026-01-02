import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

import { stocks, watchlist, indices, news, ipos } from "../drizzle/schema";
import { desc, like, or, and } from "drizzle-orm";

// Stock queries
export async function getStockBySymbol(symbol: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(stocks).where(eq(stocks.symbol, symbol)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getTopGainers(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stocks).orderBy(desc(stocks.changePercent)).limit(limit);
}

export async function getTopLosers(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stocks).orderBy(stocks.changePercent).limit(limit);
}

export async function searchStocks(query: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stocks).where(
    or(
      like(stocks.symbol, `%${query}%`),
      like(stocks.name, `%${query}%`)
    )
  ).limit(limit);
}

// Index queries
export async function getIndices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(indices);
}

export async function getIndexBySymbol(symbol: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(indices).where(eq(indices.symbol, symbol)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Watchlist queries
export async function getUserWatchlist(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(watchlist)
    .innerJoin(stocks, eq(watchlist.stockId, stocks.id))
    .where(eq(watchlist.userId, userId));
}

export async function addToWatchlist(userId: number, stockId: number) {
  const db = await getDb();
  if (!db) return null;
  return db.insert(watchlist).values({ userId, stockId });
}

export async function removeFromWatchlist(userId: number, stockId: number) {
  const db = await getDb();
  if (!db) return null;
  return db.delete(watchlist).where(
    and(eq(watchlist.userId, userId), eq(watchlist.stockId, stockId))
  );
}

// News queries
export async function getLatestNews(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(news).orderBy(desc(news.publishedAt)).limit(limit);
}

// IPO queries
export async function getUpcomingIPOs(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ipos).where(eq(ipos.status, 'upcoming')).orderBy(desc(ipos.ipoDate)).limit(limit);
}

export async function getRecentIPOs(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ipos).where(eq(ipos.status, 'recent')).orderBy(desc(ipos.ipoDate)).limit(limit);
}
