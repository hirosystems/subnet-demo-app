import { NavLink, NavLinkProps, Outlet, useLoaderData } from "react-router-dom";
import { useState } from "react";
import { deserializeCV, Pc, principalCV, uintCV } from "@stacks/transactions";
import { UserData } from "@stacks/connect";

import {
  getPendingSTXWithdrawals,
  STXWithdrawEvent,
} from "../../stacks/apiCalls";
import { callL1SubnetContract } from "../../stacks/callContract";
import { L2_URL, L1_SUBNET_PRINCIPAL } from "../../stacks/env";
import { H2, H4 } from "../../components/ui/Headings";
import { Button, ButtonSecondary } from "../../components/ui/Button";
import { useImmediateInterval } from "../../lib/hooks";
import clsx from "clsx";
import { Instructions } from "../../components/ui/Instructions";
import { AddNetwork } from "../../components/HomeInstructions";

export function Subnet() {
  const { profile } = useLoaderData() as UserData;
  const address = profile.stxAddress.testnet;

  const [pendingStxWithdrawals, setPendingStxWithdrawals] = useState<
    STXWithdrawEvent[]
  >([]);

  useImmediateInterval(async () => {
    const pendingWithdrawals = await getPendingSTXWithdrawals(address);
    setPendingStxWithdrawals(pendingWithdrawals);
  }, 5_000);

  const confirmWithdraw = async (w: STXWithdrawEvent) => {
    const res = await fetch(
      `${L2_URL}/v2/withdrawal/stx/${w.withdrawalHeight}/${w.sender}/${w.withdrawalId}/${w.amount}`,
    );
    const merkleEntry = await res.json();
    const cvMerkleEntry = {
      withdrawalRoot: deserializeCV(merkleEntry.withdrawal_root),
      withdrawalLeafHash: deserializeCV(merkleEntry.withdrawal_leaf_hash),
      siblingHashes: deserializeCV(merkleEntry.sibling_hashes),
    };

    const pc = Pc.principal(L1_SUBNET_PRINCIPAL).willSendEq(w.amount).ustx();
    callL1SubnetContract(
      "withdraw-stx",
      [
        uintCV(w.amount),
        principalCV(address),
        uintCV(w.withdrawalId),
        uintCV(w.withdrawalHeight),
        cvMerkleEntry.withdrawalRoot,
        cvMerkleEntry.withdrawalLeafHash,
        cvMerkleEntry.siblingHashes,
      ],
      [pc],
    );
  };

  return (
    <div>
      <Instructions>
        <li key={0}>
          To interact with the app's subnet, add <AddNetwork /> to the list of
          networks on your Hiro Wallet.
        </li>
        <li key={1}>
          On this page you can deposit STX on the Subnet and withdraw from it.
        </li>
        <li key={2}>Soon, it will be handled in the Wallet instead.</li>
      </Instructions>
      <div className="m-auto mb-36 mt-14 max-w-[318px]">
        <div className="m-auto flex w-full justify-around rounded-[3px] border border-hiro-neutral-200 p-[6px]">
          <MenuLink to={"deposit"}>Deposit</MenuLink>
          <MenuLink to={"withdraw"}>Withdraw</MenuLink>
        </div>
        <Outlet />

        {!!pendingStxWithdrawals.length && (
          <div className="mt-6 max-w-sm">
            <H4>Pending STX Withdrawals</H4>
            {pendingStxWithdrawals.map((w) => (
              <div
                key={`${w.withdrawalHeight}-${w.withdrawalId.toString()}`}
                className="mt-4 flex items-center justify-between gap-2 rounded border border-hiro-neutral-200 p-3"
              >
                <span>{parseFloat(w.amount.toString()) / 1e6} STX</span>
                <ButtonSecondary
                  type="button"
                  onClick={() => confirmWithdraw(w)}
                >
                  Confirm
                </ButtonSecondary>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MenuLink(
  props: NavLinkProps & React.RefAttributes<HTMLAnchorElement>,
) {
  return (
    <NavLink
      {...props}
      className={({ isActive }) =>
        clsx(
          "w-full rounded-[2px] py-[10px] text-center",
          "transition-all duration-200",
          isActive
            ? "bg-hiro-neutral-100 text-hiro-black"
            : "text-hiro-neutral-300",
        )
      }
    />
  );
}
