import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types as t,
} from "https://deno.land/x/clarinet@v1.5.2/index.ts";
import { assertEquals } from "https://deno.land/std@0.180.0/testing/asserts.ts";

const CONTRACT_NAME = "subnet-demo-marketplace";
const NFT_CONTRACT_NAME = "parfait-nft";

function mint(chain: Chain, address: string) {
  return chain.mineBlock([
    Tx.contractCall(NFT_CONTRACT_NAME, "mint", [], address),
  ]);
}

function list(chain: Chain, deployerAddr: string, id: number, address: string) {
  return chain.mineBlock([
    Tx.contractCall(
      CONTRACT_NAME,
      "list-asset",
      [
        t.principal(`${deployerAddr}.${NFT_CONTRACT_NAME}`),
        t.uint(id),
        t.tuple({
          taker: t.none(),
          price: t.uint(100),
        }),
      ],
      address,
    ),
  ]);
}

Clarinet.test({
  name: "ensure that can list nft",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const { address: addrD } = accounts.get("deployer")!;
    const { address: addr1 } = accounts.get("wallet_1")!;

    mint(chain, addr1);

    const block = list(chain, addrD, 1, addr1);

    block.receipts[0].result.expectOk().expectBool(true);
    assertEquals(block.receipts[0].events.length, 1);
    block.receipts[0].events.expectNonFungibleTokenTransferEvent(
      t.uint(1),
      addr1,
      `${addrD}.${CONTRACT_NAME}`,
      `${addrD}.${NFT_CONTRACT_NAME}`,
      "parfait-nft",
    );
  },
});

Clarinet.test({
  name: "ensure that account can only list owned and existing nfts",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const { address: addrD } = accounts.get("deployer")!;
    const { address: addr1 } = accounts.get("wallet_1")!;
    const { address: addr2 } = accounts.get("wallet_2")!;

    mint(chain, addr1);

    // list not owned nft
    const block1 = list(chain, addrD, 1, addr2);
    block1.receipts[0].result.expectErr();

    // list unexisting nft id
    const block2 = list(chain, addrD, 10, addr1);
    block2.receipts[0].result.expectErr();
  },
});

Clarinet.test({
  name: "ensure that account can cancel own listing",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const { address: addrD } = accounts.get("deployer")!;
    const { address: addr1 } = accounts.get("wallet_1")!;

    mint(chain, addr1);
    list(chain, addrD, 1, addr1);

    const block = chain.mineBlock([
      Tx.contractCall(
        CONTRACT_NAME,
        "cancel-listing",
        [t.principal(`${addrD}.${NFT_CONTRACT_NAME}`), t.uint(1)],
        addr1,
      ),
    ]);

    block.receipts[0].result.expectOk().expectBool(true);

    assertEquals(block.receipts[0].events.length, 1);
    block.receipts[0].events.expectNonFungibleTokenTransferEvent(
      t.uint(1),
      `${addrD}.${CONTRACT_NAME}`,
      addr1,
      `${addrD}.${NFT_CONTRACT_NAME}`,
      "parfait-nft",
    );
  },
});

Clarinet.test({
  name: "ensure that account can not cancel someone else listing",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const { address: addrD } = accounts.get("deployer")!;
    const { address: addr1 } = accounts.get("wallet_1")!;
    const { address: addr2 } = accounts.get("wallet_2")!;

    mint(chain, addr1);
    list(chain, addrD, 1, addr1);

    const block = chain.mineBlock([
      Tx.contractCall(
        CONTRACT_NAME,
        "cancel-listing",
        [t.principal(`${addrD}.${NFT_CONTRACT_NAME}`), t.uint(1)],
        addr2,
      ),
    ]);

    block.receipts[0].result.expectErr().expectUint(2001);
  },
});

Clarinet.test({
  name: "ensure that buyer can fulfil listing",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const { address: addrD } = accounts.get("deployer")!;
    const { address: addr1 } = accounts.get("wallet_1")!;
    const { address: addr2 } = accounts.get("wallet_2")!;

    mint(chain, addr1);
    list(chain, addrD, 1, addr1);

    const block = chain.mineBlock([
      Tx.contractCall(
        CONTRACT_NAME,
        "fulfil-listing",
        [t.principal(`${addrD}.${NFT_CONTRACT_NAME}`), t.uint(1)],
        addr2,
      ),
    ]);

    block.receipts[0].result.expectOk().expectBool(true);

    assertEquals(block.receipts[0].events.length, 2);
    block.receipts[0].events.expectNonFungibleTokenTransferEvent(
      t.uint(1),
      `${addrD}.${CONTRACT_NAME}`,
      addr2,
      `${addrD}.${NFT_CONTRACT_NAME}`,
      "parfait-nft",
    );
    block.receipts[0].events.expectSTXTransferEvent(5000, addr2, addr1);
  },
});

Clarinet.test({
  name: "ensure that seller can not fulfil own listing",
  fn(chain: Chain, accounts: Map<string, Account>) {
    const { address: addrD } = accounts.get("deployer")!;
    const { address: addr1 } = accounts.get("wallet_1")!;

    mint(chain, addr1);
    list(chain, addrD, 1, addr1);

    const block = chain.mineBlock([
      Tx.contractCall(
        CONTRACT_NAME,
        "fulfil-listing",
        [t.principal(`${addrD}.${NFT_CONTRACT_NAME}`), t.uint(1)],
        addr1,
      ),
    ]);

    block.receipts[0].result.expectErr().expectUint(2005);
  },
});
