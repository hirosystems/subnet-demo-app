import { UserData } from "@stacks/connect";
import { Link, NavLink, NavLinkProps } from "react-router-dom";
import clsx from "clsx";

import titleUrl from "../assets/images/title.png";
import titleIconUrl from "../assets/images/title-icon.png";

import { userSession } from "../stacks/auth";
import { Button, ButtonSmall } from "./ui/Button";
import { H1 } from "./ui/Headings";
import { Addr } from "./ui/Addr";
import { useImmediateInterval } from "../lib/hooks";
import { getL2Balance } from "../stacks/apiCalls";
import { useState } from "react";
import { getLastBlock } from "../stacks/info";
import { L2_URL } from "../stacks/env";
import { Block } from "@stacks/stacks-blockchain-api-types";

type HeaderProps = {
  isLoggedIn: boolean;
  userData: UserData;
};

export function Header({ isLoggedIn, userData }: HeaderProps) {
  const [l2Balance, setL2Balance] = useState(0);
  const [lastBlockInfo, setLastBlockInfo] = useState<Block | null>(null);

  const address = userData.profile.stxAddress.testnet;

  useImmediateInterval(async () => {
    const l2Info = await getL2Balance(address);
    const block = await getLastBlock(L2_URL);

    setL2Balance(parseFloat(l2Info.balance) / 1_000_000);

    if (!lastBlockInfo || (block && block?.height > lastBlockInfo.height)) {
      setLastBlockInfo(block);
    }
  }, 5_000);

  useImmediateInterval(async () => {}, 10_000);

  function signout() {
    userSession.signUserOut();
    window.location.replace("/");
  }

  return (
    <>
      <header className="mb-1 mt-8 flex items-center justify-between rounded-md bg-hiro-neutral-0 p-4">
        <div className="flex items-center gap-4 md:gap-12">
          <H1>
            <Link to="/">
              <span className="hidden">SubNFT</span>
              <img
                className="hidden h-[15px] w-[103px] sm:block md:h-[30px] md:w-[206px]"
                src={titleUrl}
              />
              <img
                className="block h-[15px] w-[15px] sm:hidden"
                src={titleIconUrl}
              />
            </Link>
          </H1>
          <MenuLink className="hover:underline" to="/">
            Marketplace
          </MenuLink>
          <MenuLink className="hover:underline" to="/my-nfts/">
            My NFTs
          </MenuLink>
          <MenuLink className="hover:underline" to="/subnet-settings">
            Manage STX
          </MenuLink>
        </div>

        <div className="flex items-center justify-end gap-4">
          <ButtonSmall onClick={signout}>Sign Out</ButtonSmall>
        </div>
      </header>

      <section className="mb-1 rounded-md bg-hiro-neutral-0 p-4 text-sm text-hiro-neutral-300">
        <div className="flex flex-col justify-center rounded-md lg:flex-row lg:text-left">
          <span>
            Connected with{" "}
            <span className="text-hiro-black">
              <Addr address={address} />
            </span>
          </span>

          <span className="mx-4 hidden lg:inline-block">/</span>

          <span>
            Balance on Subnet:{" "}
            <span className="text-hiro-black">
              {l2Balance.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </span>{" "}
            STX
          </span>

          <span className="mx-4 hidden lg:inline-block">/</span>

          <span>
            Last Subnet block height:{" "}
            <span className="text-hiro-black">
              {!!lastBlockInfo && lastBlockInfo.height}
            </span>
          </span>
        </div>
      </section>
    </>
  );
}

function MenuLink(
  props: NavLinkProps & React.RefAttributes<HTMLAnchorElement>,
) {
  return (
    <NavLink
      end={false}
      {...props}
      className={clsx("navlink text-sm lg:text-base")}
    />
  );
}
