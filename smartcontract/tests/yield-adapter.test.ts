import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const address1 = accounts.get("wallet_1")!;
const mockStrategy = `${deployer}.mock-yield-strategy`;

describe("Yield Adapter Tests", () => {
  it("prevents non-admin from deploying to strategy", () => {
    const deployResult = simnet.callPublicFn(
      "stxbazaar-yieldadapter-beta",
      "deploy-to-strategy",
      [Cl.uint(1000000), Cl.contractPrincipal(deployer, "mock-yield-strategy")],
      address1
    );

    // Should return ERR-NOT-OWNER (u300)
    expect(deployResult.result).toBeErr(Cl.uint(300));
  });

  it("allows admin to approve a new strategy and deploy/withdraw", () => {
    // 1. Approve mock-yield-strategy
    const approveResult = simnet.callPublicFn(
      "stxbazaar-yieldadapter-beta",
      "set-strategy",
      [
        Cl.contractPrincipal(deployer, "mock-yield-strategy"),
        Cl.bool(true),
        Cl.uint(1200), // 12% APR
        Cl.uint(5000000000)
      ],
      deployer
    );
    expect(approveResult.result).toBeOk(Cl.bool(true));

    // 2. Deploy to strategy
    const deployResult = simnet.callPublicFn(
      "stxbazaar-yieldadapter-beta",
      "deploy-to-strategy",
      [Cl.uint(1000000), Cl.contractPrincipal(deployer, "mock-yield-strategy")],
      deployer
    );
    expect(deployResult.result).toBeOk(Cl.bool(true));

    // 3. Withdraw from strategy
    const withdrawResult = simnet.callPublicFn(
      "stxbazaar-yieldadapter-beta",
      "withdraw-from-strategy",
      [Cl.uint(1000000), Cl.contractPrincipal(deployer, "mock-yield-strategy")],
      deployer
    );
    expect(withdrawResult.result).toBeOk(Cl.bool(true));
  });

  it("returns correct mainnet APR stats", () => {
    const statResult = simnet.callReadOnlyFn(
      "stxbazaar-yieldadapter-beta",
      "get-strategy-stats",
      [Cl.principal("SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-dao")],
      address1
    );

    expect(statResult.result).toBeSome(Cl.tuple({
      active: Cl.bool(true),
      apr: Cl.uint(850),
      tvl: Cl.uint(450000000000)
    }));
  });
});
