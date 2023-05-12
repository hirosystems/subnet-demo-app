import { showConnect } from "@stacks/connect";

import { Button } from "./ui/Button";

import { userSession } from "../stacks/auth";
import splashUrl from "../assets/images/splash.png";
import clsx from "clsx";
import { Popin } from "./ui/Popin";

export function Splash() {
  function signin() {
    showConnect({
      appDetails: {
        name: "subnft",
        icon: "/stacks.svg",
      },
      redirectTo: "/",
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  }
  return (
    <div className="flex h-full grow items-center">
      <main className="text-center">
        <p className="text-lg uppercase text-hiro-gold">Welcome to</p>
        <h1 className="hidden">GalleryParfait</h1>
        <img className="m-auto max-w-[80%]" src={splashUrl} />
        <div className="mb-14 mt-6 uppercase text-hiro-black">
          ~ A <SubnetTuto /> nft marketplace ~
        </div>
        <Button className="h-12" onClick={signin}>
          Connect Wallet
        </Button>
      </main>
    </div>
  );
}

function SubnetTuto() {
  return (
    <Popin text="subnet*">
      <span className="mb-4 inline-block border border-hiro-black p-1">
        *What's a subnet?
      </span>
      <span className="block normal-case">
        Subnets are an L2 blockchain for the Stacks mainchain. If the Stacks
        blockchain is the main network, you can consider subnets as a
        sub-network that helps scale the overall Stacks network.
        <br />
        <br />
        <ul className="ml-3 list-disc">
          <li>Fast blocks</li>
          <li>High throughput</li>
          <li>Low latency</li>
        </ul>
      </span>
    </Popin>
  );
}
