import {
  AccountsApi,
  Configuration,
  NonFungibleTokensApi,
} from "@stacks/blockchain-api-client";
import {
  NonFungibleTokenHoldingWithTxId,
  StxBalance,
  TransactionEventSmartContractLog,
} from "@stacks/stacks-blockchain-api-types";
import {
  ClarityValue,
  PrincipalCV,
  UIntCV,
  cvToValue,
  deserializeCV,
  getContractMapEntry,
  tupleCV,
  uintCV,
} from "@stacks/transactions";
import {
  L1_SUBNET_CONTRACT_ADDR,
  L1_SUBNET_CONTRACT_NAME,
  L1_NFT_CONTRACT_ADDR,
  L2_SUBNET_CONTRACT_ADDR,
  L2_SUBNET_CONTRACT_NAME,
  L2_SUBNET_PRINCIPAL,
  L2_NFT_CONTRACT_ADDR,
  MARKETPLACE_CONTRACT_ADDR,
  MARKETPLACE_CONTRACT_NAME,
  MARKETPLACE_PRINCIPAL,
  NFT_ASSET_NAME,
  NFT_CONTRACT_NAME,
} from "./env";

import { L1_URL, L2_URL } from "./env";
import { StacksMocknet } from "@stacks/network";
import { callReadOnlyL1NftContract } from "./callContract";

const apiConfigL1 = new Configuration({
  basePath: L1_URL,
});
const accountsL1 = new AccountsApi(apiConfigL1);
const nftL1 = new NonFungibleTokensApi(apiConfigL1);

const apiConfigL2 = new Configuration({
  basePath: L2_URL,
});
const accountsL2 = new AccountsApi(apiConfigL2);
const nftL2 = new NonFungibleTokensApi(apiConfigL2);

const l1Network = new StacksMocknet({ url: L1_URL });
const l2Network = new StacksMocknet({ url: L2_URL }); // localhost:13999

export async function getL1Balance(principal: string) {
  const balance = await accountsL1.getAccountStxBalance({
    principal,
    unanchored: false,
  });
  return balance as StxBalance;
}

export async function getL2Balance(principal: string) {
  const balance = await accountsL2.getAccountStxBalance({
    principal,
    unanchored: false,
  });

  return balance as StxBalance;
}

async function getNFTsList(layer: 1 | 2, owner: string) {
  const network = layer === 1 ? nftL1 : nftL2;
  const nftAddr = layer === 1 ? L1_NFT_CONTRACT_ADDR : L2_NFT_CONTRACT_ADDR;

  const nfts: NonFungibleTokenHoldingWithTxId[] = (
    await network.getNftHoldings({
      principal: owner,
      assetIdentifiers: [`${nftAddr}.${NFT_CONTRACT_NAME}::${NFT_ASSET_NAME}`],
      unanchored: true,
      limit: 200,
    })
  ).results as any[];

  return nfts.map((nft) => ({
    ...nft,
    layer,
    owner,
    id: (deserializeCV(nft.value.hex) as UIntCV).value,
  }));
}

export type NFTType = Awaited<ReturnType<typeof getNFTsList>>[number];

export function getL1NFTs(principal: string): Promise<NFTType[]> {
  return getNFTsList(1, principal);
}

export function getL2NFTs(principal: string): Promise<NFTType[]> {
  return getNFTsList(2, principal);
}

export async function getAllNFTs(principal: string): Promise<NFTType[]> {
  const [onL1, onL2] = await Promise.all([
    getNFTsList(1, principal),
    getNFTsList(2, principal),
  ]);
  return [...onL1, ...onL2].sort((a, b) => Number(a.id - b.id));
}

export function getL2MarketplaceNFTs() {
  return getNFTsList(2, MARKETPLACE_PRINCIPAL);
}

export type STXWithdrawEvent = {
  amount: bigint;
  sender: string;
  type: string;
  withdrawalHeight: bigint;
  withdrawalId: bigint;
};

export async function getPendingSTXWithdrawals(address: string) {
  const req = await fetch(
    `${L2_URL}/extended/v1/tx/events?address=${L2_SUBNET_CONTRACT_ADDR}.${L2_SUBNET_CONTRACT_NAME}`,
  );

  const rawEvents = (await req.json()).events;
  const events: STXWithdrawEvent[] = rawEvents
    .filter((e: any) => e.event_type === "smart_contract_log")
    .reduce((acc: STXWithdrawEvent[], e: TransactionEventSmartContractLog) => {
      const log = e.contract_log;
      const content = cvToValue(deserializeCV(log.value.hex));
      if (!(content.event && content.event.value)) return acc;
      if (content.event.value !== "withdraw") return acc;

      const sender = content.sender.value;
      if (sender !== address) return acc;
      const eventType = content.type.value;
      if (eventType !== "stx") return acc;

      const event: STXWithdrawEvent = {
        sender,
        type: eventType,
        amount: BigInt(content.amount.value),
        withdrawalHeight: BigInt(content["withdrawal-height"].value),
        withdrawalId: BigInt(
          content["withdrawal-id"]
            ? content["withdrawal-id"].value
            : content["withdrawal_id"].value,
        ),
      };

      return acc.concat(event);
    }, [] as STXWithdrawEvent[]);

  return events;
}

export type NFTWithdrawEvent = {
  sender: string;
  type: string;
  id: bigint;
  withdrawalHeight: bigint;
  withdrawalId: bigint;
};

export type NFTWithdrawDetails = {
  sender: string;
  type: string;
  id: bigint;
  withdrawalHeight: bigint;
  withdrawalId: bigint;
  completed: boolean;
  owner: null | string;
  merkleEntryCV: {
    withdrawalRoot: ClarityValue;
    withdrawalLeafHash: ClarityValue;
    siblingHashes: ClarityValue;
  };
};

export async function getPendingNFTWithdrawals(address: string) {
  const req = await fetch(
    `${L2_URL}/extended/v1/tx/events?address=${L2_SUBNET_PRINCIPAL}`,
  );

  const rawEvents = (await req.json()).events;
  const events: NFTWithdrawEvent[] = rawEvents
    .filter((e: any) => e.event_type === "smart_contract_log")
    .reduce((acc: NFTWithdrawEvent[], e: TransactionEventSmartContractLog) => {
      const log = e.contract_log;
      const content = cvToValue(deserializeCV(log.value.hex));
      if (!(content.event && content.event.value)) return acc;
      if (content.event.value !== "withdraw") return acc;

      const sender = content.sender.value;
      if (sender !== address) return acc;
      const eventType = content.type.value;
      if (eventType !== "nft") return acc;

      const event: NFTWithdrawEvent = {
        sender,
        type: eventType,
        id: BigInt(content.id.value),
        withdrawalHeight: BigInt(content["withdrawal-height"].value),
        withdrawalId: BigInt(
          content["withdrawal-id"]
            ? content["withdrawal-id"].value
            : content["withdrawal_id"].value,
        ),
      };

      return acc.concat(event);
    }, [] as NFTWithdrawEvent[]);

  const details = await Promise.all(
    events.map(async (e) => {
      const res = await fetch(
        `${L2_URL}/v2/withdrawal/nft/${e.withdrawalHeight}/${e.sender}/${e.withdrawalId}/${L2_NFT_CONTRACT_ADDR}/${NFT_CONTRACT_NAME}/${e.id}`,
      );
      const merkleEntry = await res.json();
      const merkleEntryCV = {
        withdrawalRoot: deserializeCV(merkleEntry.withdrawal_root),
        withdrawalLeafHash: deserializeCV(merkleEntry.withdrawal_leaf_hash),
        siblingHashes: deserializeCV(merkleEntry.sibling_hashes),
      };

      const completed = !!cvToValue(
        await getContractMapEntry({
          contractAddress: L1_SUBNET_CONTRACT_ADDR,
          contractName: L1_SUBNET_CONTRACT_NAME,
          mapKey: tupleCV({
            "withdrawal-leaf-hash": merkleEntryCV.withdrawalLeafHash,
            "withdrawal-root-hash": merkleEntryCV.withdrawalRoot,
          }),
          mapName: "processed-withdrawal-leaves-map",
          network: l1Network,
        }),
      );

      // Knowing if the NFT has an owner is useful to set a post condition on the withdraw transaction
      // if the nft has an owner: it means that it has already been minted and the withdraw will need a transfer post condition
      // otherwise, it will be freshly minted on the L1 and won't need a post condition
      const ownerReqParams = [
        "get-owner",
        [uintCV(e.id)] as ClarityValue[],
        address,
      ] as const;

      const owner =
        (await callReadOnlyL1NftContract(...ownerReqParams))?.value || null;

      const details: NFTWithdrawDetails = {
        ...e,
        completed,
        owner,
        merkleEntryCV,
      };
      return details;
    }),
  );

  return details.filter((w) => !w.completed);
}

export async function getListingDetails(
  nftContract: PrincipalCV,
  nftId: UIntCV,
) {
  return cvToValue(
    await getContractMapEntry({
      contractAddress: MARKETPLACE_CONTRACT_ADDR,
      contractName: MARKETPLACE_CONTRACT_NAME,
      mapKey: tupleCV({
        "nft-contract": nftContract,
        "nft-id": nftId,
      }),
      mapName: "listings",
      network: l2Network,
    }),
  );
}
