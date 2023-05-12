import { UserData } from "@stacks/connect";
import { useLoaderData } from "react-router-dom";

import { HoldingsL2 } from "../../components/HoldingsL2";

export function MyNFTsL2() {
  const data = useLoaderData() as UserData;

  const address = data.profile.stxAddress.testnet;

  return <HoldingsL2 address={address} />;
}
