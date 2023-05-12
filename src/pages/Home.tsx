import { useState } from "react";
import { UserData } from "@stacks/connect";
import { useLoaderData } from "react-router-dom";

import { useImmediateInterval } from "../lib/hooks";
import { getL2MarketplaceNFTs } from "../stacks/apiCalls";
import { H2, H3 } from "../components/ui/Headings";
import { NFT } from "../components/NFT";
import { Mint } from "../components/Mint";
import { HomeInstructions } from "../components/HomeInstructions";
import { NFTGrid } from "../components/ui/NFTGrid";

export function Home() {
  const data = useLoaderData() as UserData;
  const [nfts, setNfts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useImmediateInterval(async () => {
    setNfts(await getL2MarketplaceNFTs());
    setIsLoading(false);
  }, 3_000);

  const address = data.profile.stxAddress.testnet;

  return (
    <div>
      <HomeInstructions {...{ address }} />
      <H2 className="text-center">Mint</H2>

      <Mint address={address} />
      <hr className="mb-12 mt-[55px] border-hiro-neutral-200" />

      {nfts.length === 0 && !isLoading && (
        <p className="my-8 text-center text-sm text-hiro-neutral-300">
          ◔̯◔
          <br />
          No NFT for sale yet
        </p>
      )}

      {nfts.length > 0 && (
        <>
          <H3 className="mb-16 mt-1 text-center">NFTs for Sale</H3>
          <NFTGrid>
            {nfts.map((nft) => (
              <NFT key={nft.id.toString()} id={nft.id} layer={2} />
            ))}
          </NFTGrid>
        </>
      )}
    </div>
  );
}
