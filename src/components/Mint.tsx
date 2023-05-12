import { Pc } from "@stacks/transactions";
import { useCallback } from "react";

import logoURL from "../assets/images/title-icon.png";

import { callL2NftContract } from "../stacks/callContract";
import { Button, ButtonSecondary } from "./ui/Button";
import { NFT } from "./NFT";

type MintProps = {
  address: string;
};

export function Mint({ address }: MintProps) {
  const callMint = useCallback(() => {
    const postCondition = Pc.principal(address).willSendEq(10_000_000).ustx();
    callL2NftContract("mint", [], [postCondition]);
  }, [address]);

  return (
    <>
      <img src={logoURL} className="mx-auto grayscale" />
      <div className="mt-4 flex flex-col items-center gap-4">
        <span className="my-2 text-hiro-neutral-300">
          Mint for <span className="text-hiro-black">10 STX</span> on Subnet
          (~30 seconds confirmation time)
        </span>
        <Button onClick={callMint} className="py-x mx-auto block h-14">
          Mint a Parfait
        </Button>
      </div>
    </>
  );
}
