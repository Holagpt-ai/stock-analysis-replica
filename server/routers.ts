import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { getTopGainers, getTopLosers, getMarketIndices, searchStocks, getStockQuote } from "./fmp";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Stock data endpoints - using FMP API
  stocks: router({
    getTopGainers: publicProcedure
      .input(z.object({ limit: z.number().default(10) }).optional())
      .query(async ({ input }) => {
        try {
          const gainers = await getTopGainers();
          return gainers.slice(0, input?.limit || 10).map((stock: any) => ({
            id: stock.symbol,
            symbol: stock.symbol,
            name: stock.symbol,
            price: stock.price?.toString() || "0",
            change: stock.change?.toString() || "0",
            changePercent: stock.changesPercentage?.toString() || "0",
            volume: stock.volume?.toString() || "0",
          }));
        } catch (error) {
          console.error("Error fetching top gainers:", error);
          return [];
        }
      }),
    
    getTopLosers: publicProcedure
      .input(z.object({ limit: z.number().default(10) }).optional())
      .query(async ({ input }) => {
        try {
          const losers = await getTopLosers();
          return losers.slice(0, input?.limit || 10).map((stock: any) => ({
            id: stock.symbol,
            symbol: stock.symbol,
            name: stock.symbol,
            price: stock.price?.toString() || "0",
            change: stock.change?.toString() || "0",
            changePercent: stock.changesPercentage?.toString() || "0",
            volume: stock.volume?.toString() || "0",
          }));
        } catch (error) {
          console.error("Error fetching top losers:", error);
          return [];
        }
      }),
    
    search: publicProcedure
      .input(z.object({ query: z.string(), limit: z.number().default(20) }))
      .query(async ({ input }) => {
        try {
          const results = await searchStocks(input.query);
          return results.slice(0, input.limit).map((stock: any) => ({
            id: stock.symbol,
            symbol: stock.symbol,
            name: stock.symbol,
            price: stock.price?.toString() || "0",
            change: stock.change?.toString() || "0",
            changePercent: stock.changesPercentage?.toString() || "0",
            volume: stock.volume?.toString() || "0",
          }));
        } catch (error) {
          console.error("Error searching stocks:", error);
          return [];
        }
      }),
    
    getBySymbol: publicProcedure
      .input(z.object({ symbol: z.string() }))
      .query(async ({ input }) => {
        try {
          const stock = await getStockQuote(input.symbol);
          if (!stock) return null;
          return {
            id: stock.symbol,
            symbol: stock.symbol,
            name: stock.symbol,
            price: stock.price?.toString() || "0",
            change: stock.change?.toString() || "0",
            changePercent: stock.changesPercentage?.toString() || "0",
            volume: stock.volume?.toString() || "0",
          };
        } catch (error) {
          console.error("Error fetching stock:", error);
          return null;
        }
      }),
  }),

  // Market indices endpoints - using FMP API
  indices: router({
    getAll: publicProcedure.query(async () => {
      try {
        const indices = await getMarketIndices();
        return indices.map((index: any) => ({
          id: index.symbol,
          symbol: index.symbol,
          name: index.name,
          price: index.price?.toString() || "0",
          change: index.change?.toString() || "0",
          changePercent: index.changesPercentage?.toString() || "0",
        }));
      } catch (error) {
        console.error("Error fetching indices:", error);
        return [];
      }
    }),
    
    getBySymbol: publicProcedure
      .input(z.object({ symbol: z.string() }))
      .query(async ({ input }) => {
        try {
          const indices = await getMarketIndices();
          const index = indices.find((i: any) => i.symbol === input.symbol);
          if (!index) return null;
          return {
            id: index.symbol,
            symbol: index.symbol,
            name: index.name,
            price: index.price?.toString() || "0",
            change: index.change?.toString() || "0",
            changePercent: index.changesPercentage?.toString() || "0",
          };
        } catch (error) {
          console.error("Error fetching index:", error);
          return null;
        }
      }),
  }),

  // Watchlist endpoints
  watchlist: router({
    getMyWatchlist: protectedProcedure.query(({ ctx }) => 
      db.getUserWatchlist(ctx.user.id)
    ),
    
    add: protectedProcedure
      .input(z.object({ stockId: z.number() }))
      .mutation(({ ctx, input }) => 
        db.addToWatchlist(ctx.user.id, input.stockId)
      ),
    
    remove: protectedProcedure
      .input(z.object({ stockId: z.number() }))
      .mutation(({ ctx, input }) => 
        db.removeFromWatchlist(ctx.user.id, input.stockId)
      ),
  }),

  // Market news endpoints
  news: router({
    getLatest: publicProcedure
      .input(z.object({ limit: z.number().default(20) }).optional())
      .query(({ input }) => db.getLatestNews(input?.limit || 20)),
  }),

  // IPO endpoints
  ipos: router({
    getUpcoming: publicProcedure
      .input(z.object({ limit: z.number().default(10) }).optional())
      .query(({ input }) => db.getUpcomingIPOs(input?.limit || 10)),
    
    getRecent: publicProcedure
      .input(z.object({ limit: z.number().default(10) }).optional())
      .query(({ input }) => db.getRecentIPOs(input?.limit || 10)),
  }),
});

export type AppRouter = typeof appRouter;
