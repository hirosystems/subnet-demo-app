import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";

import { Instructions } from "./ui/Instructions";
import { useImmediateInterval } from "../lib/hooks";
import { getL2Balance } from "../stacks/apiCalls";
import { L2_URL } from "../stacks/env";
import { Popin } from "./ui/Popin";

import addNetworkImg from "../assets/images/add-network.png";

const getInstructions = (loading = true, l2Balance = 0): ReactNode[] => {
  if (loading) return [];

  if (l2Balance === 0) {
    return [
      <li key={0}>
        To interact with the app's subnet, add <AddNetwork /> to the list of
        networks on your Hiro Wallet.
      </li>,
      <li key={1}>
        Then, go to the <Link to="/subnet-settings/deposit">Manage STX</Link>{" "}
        page to deposit some STX to make transactions on the app.
      </li>,
      <li key={2}>
        The app will take care of sending the transactions to the wanted network
        (subnet or testnet)
      </li>,
    ];
  }

  return [
    <li key={0}>
      You have {(l2Balance / 1e6).toLocaleString()} STX on the Parfait Subnet.
    </li>,
    <li key={1}>This balance can be used to mint a Parfait NFT below</li>,
    <li key={2}>It also possible to buy NFTs listed for sales</li>,
    <li key={3}>
      You NFTs are visible on the <Link to="/my-nfts/">My NFTs</Link> page
    </li>,
  ];
};

export function HomeInstructions({ address }: { address: string }) {
  const [l2Balance, setL2Balance] = useState(0);
  const [loading, setLoading] = useState(true);

  useImmediateInterval(async () => {
    const balance = await getL2Balance(address);
    setL2Balance(Number(balance.balance));
    setLoading(false);
  }, 3000);

  const instructions = getInstructions(loading, l2Balance);

  return <Instructions>{instructions}</Instructions>;
}

export function AddNetwork() {
  return (
    <Popin text="parfait-subnet*">
      <span className="mb-4 inline-block border border-hiro-black p-1">
        *How to add a network
      </span>
      <p className="mb-4">The Subnet network address is {L2_URL}</p>
      <img className="z-50" src={addNetworkImg} />
    </Popin>
  );
}
