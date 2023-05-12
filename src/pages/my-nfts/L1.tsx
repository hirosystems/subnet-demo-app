import { UserData } from "@stacks/connect";
import { useLoaderData } from "react-router-dom";

import { HoldingsL1 } from "../../components/HoldingsL1";
import { PendingNFTWithdrawals } from "../../components/PendingNFTWithdrawals";

export function MyNFTsL1() {
  const data = useLoaderData() as UserData;

  const address = data.profile.stxAddress.testnet;

  return (
    <>
      <HoldingsL1 address={address} />
      <PendingNFTWithdrawals address={address} />
    </>
  );
}
