import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

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

  // Stock data endpoints
  stocks: router({
    getTopGainers: publicProcedure
      .input(z.object({ limit: z.number().default(10) }).optional())
      .query(({ input }) => db.getTopGainers(input?.limit || 10)),
    
    getTopLosers: publicProcedure
      .input(z.object({ limit: z.number().default(10) }).optional())
      .query(({ input }) => db.getTopLosers(input?.limit || 10)),
    
    search: publicProcedure
      .input(z.object({ query: z.string(), limit: z.number().default(20) }))
      .query(({ input }) => db.searchStocks(input.query, input.limit)),
    
    getBySymbol: publicProcedure
      .input(z.object({ symbol: z.string() }))
      .query(({ input }) => db.getStockBySymbol(input.symbol)),
  }),

  // Market indices endpoints
  indices: router({
    getAll: publicProcedure.query(() => db.getIndices()),
    
    getBySymbol: publicProcedure
      .input(z.object({ symbol: z.string() }))
      .query(({ input }) => db.getIndexBySymbol(input.symbol)),
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
