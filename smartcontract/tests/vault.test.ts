import { describe, expect, it } from "vitest";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;

describe("Vault Contract Tests", () => {
  it("ensures that a vault can be created securely", () => {
    const createVaultResult = simnet.callPublicFn(
      "stxbazaar-vault",
      "create-vault",
      [Cl.uint(1000000), Cl.uint(100)],
      address1
    );
    expect(createVaultResult.result).toBeOk(Cl.uint(0));
  });

  it("prevents early withdrawal before lock period", () => {
    simnet.callPublicFn(
      "stxbazaar-vault",
      "create-vault",
      [Cl.uint(1000000), Cl.uint(50000)],
      address1
    );

    const withdrawResult = simnet.callPublicFn(
      "stxbazaar-vault",
      "withdraw",
      [Cl.uint(1)],
      address1
    );

    // Should return ERR-STILL-LOCKED (u103)
    expect(withdrawResult.result).toBeErr(Cl.uint(103));
  });
});
