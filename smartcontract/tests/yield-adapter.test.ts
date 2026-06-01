import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const address1 = accounts.get("wallet_1")!;

describe("Yield Adapter Tests", () => {
  it("prevents non-admin from deploying to strategy", () => {
    const deployResult = simnet.callPublicFn(
      "stxbazaar-yieldadapter",
      "deploy-to-strategy",
      [Cl.uint(1000000), Cl.principal("SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-dao")],
      address1
    );

    // Should return ERR-NOT-OWNER (u300)
    expect(deployResult.result).toBeErr(Cl.uint(300));
  });

  it("returns correct mainnet APR stats", () => {
    const statResult = simnet.callReadOnlyFn(
      "stxbazaar-yieldadapter",
      "get-strategy-stats",
      [Cl.principal("SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-dao")],
      address1
    );

    expect(statResult.result).toBeTuple({ apr: Cl.uint(850), tvl: Cl.uint(450000000000) });
  });
});
