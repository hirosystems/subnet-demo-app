import { UserData } from "@stacks/connect";
import { useLoaderData } from "react-router-dom";
import { NFTGrid } from "../../components/ui/NFTGrid";
import { useImmediateInterval } from "../../lib/hooks";
import { NFTType, getAllNFTs } from "../../stacks/apiCalls";
import { useState } from "react";
import { NFT } from "../../components/NFT";
import { PendingNFTWithdrawals } from "../../components/PendingNFTWithdrawals";

export function AllMyNFTs() {
  const data = useLoaderData() as UserData;
  const address = data.profile.stxAddress.testnet;
  const [nfts, setNfts] = useState<NFTType[]>([]);

  useImmediateInterval(async () => {
    setNfts(await getAllNFTs(address));
  }, 3_000);

  if (nfts.length === 0) return null;

  return (
    <>
      <NFTGrid>
        {nfts.map((nft) => (
          <NFT key={nft.id.toString()} id={nft.id} layer={nft.layer} />
        ))}
      </NFTGrid>
      <PendingNFTWithdrawals address={address} />
    </>
  );
}
