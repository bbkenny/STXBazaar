import { Cl } from "@stacks/transactions";
import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const address1 = accounts.get("wallet_1")!;

describe("Vault Contract Tests", () => {
  it("ensures that a vault can be created securely", () => {
    const createVaultResult = simnet.callPublicFn(
      "vault",
      "create-vault",
      [Cl.uint(1000000), Cl.uint(100)],
      address1
    );
    // First vault should have id 0
    expect(createVaultResult.result).toBeOk(Cl.uint(0));
  });

  it("prevents early withdrawal before lock period", () => {
    // Create vault with a long lock period -- this test runs in a fresh simnet state
    const createRes = simnet.callPublicFn(
      "vault",
      "create-vault",
      [Cl.uint(1000000), Cl.uint(50000)],
      address1
    );
    // Extract the vault-id returned (should be 0 in this isolated test context)
    expect(createRes.result).toBeOk(Cl.uint(0));

    // Attempt to withdraw from vault 0 with required engine and strategy args.
    // Since the vault has a 50,000-block lock, calculate-unlocked-amount should return 0,
    // meaning available-to-withdraw = 0 and the contract should return ERR-STILL-LOCKED (u103).
    const withdrawResult = simnet.callPublicFn(
      "vault",
      "withdraw",
      [
        Cl.uint(0),
        Cl.contractPrincipal(deployer, "stxbazaar-lockengine-beta"),
        Cl.contractPrincipal(deployer, "mock-yield-strategy"),
      ],
      address1
    );

    // Should return ERR-STILL-LOCKED (u103)
    expect(withdrawResult.result).toBeErr(Cl.uint(103));
  });
});
