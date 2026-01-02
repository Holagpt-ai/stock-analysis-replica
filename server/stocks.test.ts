import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("stock data operations", () => {
  it("should fetch top gainers", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.stocks.getTopGainers({ limit: 10 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("should fetch top losers", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.stocks.getTopLosers({ limit: 10 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("should search stocks by query", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.stocks.search({ query: "AAPL", limit: 20 });
    expect(Array.isArray(result)).toBe(true);
  });

  it("should get stock by symbol", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.stocks.getBySymbol({ symbol: "AAPL" });
    // Result can be undefined if stock doesn't exist
    expect(result === undefined || typeof result === "object").toBe(true);
  });
});
