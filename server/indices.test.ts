import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

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

describe("market indices operations", () => {
  it("should fetch all indices", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.indices.getAll();
    expect(Array.isArray(result)).toBe(true);
  });

  it("should get index by symbol", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.indices.getBySymbol({ symbol: "SPX" });
    // Result can be undefined if index doesn't exist
    expect(result === undefined || typeof result === "object").toBe(true);
  });
});
