import {
  NonFungibleConditionCode,
  contractPrincipalCV,
  createAssetInfo,
  makeContractNonFungiblePostCondition,
  someCV,
  standardPrincipalCV,
  uintCV,
} from "@stacks/transactions";
import { useState } from "react";

import { H3 } from "./ui/Headings";
import { ButtonSecondary } from "./ui/Button";
import { useImmediateInterval } from "../lib/hooks";
import {
  NFTWithdrawDetails,
  getPendingNFTWithdrawals,
} from "../stacks/apiCalls";
import { callL1SubnetContract } from "../stacks/callContract";
import {
  L1_NFT_CONTRACT_ADDR,
  L1_SUBNET_CONTRACT_ADDR,
  L1_SUBNET_CONTRACT_NAME,
  NFT_ASSET_NAME,
  NFT_CONTRACT_NAME,
} from "../stacks/env";
import { NFT } from "./NFT";
import { NFTGrid } from "./ui/NFTGrid";

type HoldingsProps = {
  address: string;
};

export function PendingNFTWithdrawals({ address }: HoldingsProps) {
  const [pendingWithdrawals, setPendingWithdrawals] = useState<
    NFTWithdrawDetails[]
  >([]);

  useImmediateInterval(async () => {
    setPendingWithdrawals(await getPendingNFTWithdrawals(address));
  }, 3_000);

  const withdraw = async (w: NFTWithdrawDetails) => {
    const postConditions = w.owner
      ? [
          makeContractNonFungiblePostCondition(
            L1_SUBNET_CONTRACT_ADDR,
            L1_SUBNET_CONTRACT_NAME,
            NonFungibleConditionCode.Sends,
            createAssetInfo(
              L1_NFT_CONTRACT_ADDR,
              NFT_CONTRACT_NAME,
              NFT_ASSET_NAME,
            ),
            uintCV(w.id),
          ),
        ]
      : [];

    const args = [
      contractPrincipalCV(L1_NFT_CONTRACT_ADDR, NFT_CONTRACT_NAME),
      uintCV(w.id),
      standardPrincipalCV(address),
      uintCV(w.withdrawalId),
      uintCV(w.withdrawalHeight),
      someCV(contractPrincipalCV(L1_NFT_CONTRACT_ADDR, NFT_CONTRACT_NAME)),
      w.merkleEntryCV.withdrawalRoot,
      w.merkleEntryCV.withdrawalLeafHash,
      w.merkleEntryCV.siblingHashes,
    ];

    callL1SubnetContract("withdraw-nft-asset", args, postConditions);
  };

  if (pendingWithdrawals.length === 0) return null;

  return (
    <div className="mt-6">
      <hr className="my-4 border-hiro-gray1" />
      <H3>Pending Withdrawals</H3>
      <NFTGrid>
        {pendingWithdrawals.map((withdrawal, i) => (
          <div key={i}>
            <NFT id={withdrawal.id} layer={1}>
              <ButtonSecondary
                onClick={() => withdraw(withdrawal)}
                className="mb-2 w-full"
              >
                Confirm
              </ButtonSecondary>
            </NFT>
          </div>
        ))}
      </NFTGrid>
    </div>
  );
}
