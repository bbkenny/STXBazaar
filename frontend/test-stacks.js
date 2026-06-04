const { fetchCallReadOnlyFunction, cvToJSON, uintCV } = require('@stacks/transactions');
const { STACKS_MAINNET } = require('@stacks/network');

async function run() {
  const contractAddress = "SP3TXKY0REKG6P3W6ACFB615N5556EC8VYS4MFA4D";
  const contractName = "stxbazaar-vaults-beta";

  try {
    const totalRes = await fetchCallReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: 'get-total-vaults',
      functionArgs: [],
      network: STACKS_MAINNET,
      senderAddress: contractAddress,
    });
    console.log("Total vaults:", JSON.stringify(cvToJSON(totalRes), null, 2));

    const total = parseInt(cvToJSON(totalRes).value, 10);
    console.log("Parsed total:", total);

    for (let i = Math.max(0, total - 3); i < total; i++) {
        const vaultRes = await fetchCallReadOnlyFunction({
            contractAddress,
            contractName,
            functionName: 'get-vault',
            functionArgs: [uintCV(i)],
            network: STACKS_MAINNET,
            senderAddress: contractAddress,
          });
          console.log(`Vault ${i}:`, JSON.stringify(cvToJSON(vaultRes), null, 2));
    }
  } catch (e) {
    console.error(e);
  }
}
run();
