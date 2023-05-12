import { useState } from "react";

import { H4 } from "./ui/Headings";
import { useImmediateInterval } from "../lib/hooks";
import { NFTType, getL2NFTs } from "../stacks/apiCalls";
import { NFT } from "./NFT";
import { NFTGrid } from "./ui/NFTGrid";

type HoldingsProps = {
  address: string;
};

export function HoldingsL2({ address }: HoldingsProps) {
  const [nfts, setNfts] = useState<NFTType[]>([]);

  useImmediateInterval(async () => {
    setNfts(await getL2NFTs(address));
  }, 3_000);

  if (nfts.length === 0) return null;

  return (
    <NFTGrid>
      {nfts.map((nft, i) => (
        <NFT key={nft.id.toString()} id={nft.id} layer={2} />
      ))}
    </NFTGrid>
  );
}
