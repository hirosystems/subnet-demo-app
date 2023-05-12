import {
  Clarinet,
  Tx,
  Chain,
  Account,
} from "https://deno.land/x/clarinet@v1.5.4/index.ts";
import { assertEquals } from "https://deno.land/std@0.177.0/testing/asserts.ts";

const CONTRACT_NAME = "parfait-nft";

Clarinet.test({
  name: "ensure that users can mint",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const { address: addr1 } = accounts.get("wallet_1")!;

    const { receipts } = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, "mint", [], addr1),
    ]);

    receipts[0].result.expectOk().expectBool(true);

    const lastToken = chain.callReadOnlyFn(
      CONTRACT_NAME,
      "get-last-token-id",
      [],
      addr1,
    );
    lastToken.result.expectOk().expectUint(1);
  },
});

Clarinet.test({
  name: "ensure that user spends 5stx on mint",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const { address: addr1 } = accounts.get("wallet_1")!;
    const { address: deployerAddr } = accounts.get("deployer")!;

    chain.mineBlock([Tx.contractCall(CONTRACT_NAME, "mint", [], addr1)]);

    const assetsMaps = chain.getAssetsMaps()!.assets.STX;

    const initialBalance = 100000000e6;
    const mintPrice = 10e6;
    assertEquals(assetsMaps[addr1], initialBalance - mintPrice);
    assertEquals(assetsMaps[`${deployerAddr}.parfait-nft`], mintPrice);
  },
});

Clarinet.test({
  name: "ensure that users can mint 15 and no more",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const { address: addr1 } = accounts.get("wallet_1")!;

    chain.mineBlock(
      [...new Array(15)].fill(
        Tx.contractCall(CONTRACT_NAME, "mint", [], addr1),
      ),
    );

    const block = chain.mineBlock([
      Tx.contractCall(CONTRACT_NAME, "mint", [], addr1),
    ]);
    block.receipts[0].result.expectErr().expectUint(1002);
  },
});
