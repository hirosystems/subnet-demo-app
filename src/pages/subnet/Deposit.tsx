import { useLoaderData } from "react-router-dom";
import { FormEvent, useState } from "react";
import clsx from "clsx";
import {
  FungibleConditionCode,
  makeStandardSTXPostCondition,
  principalCV,
  uintCV,
} from "@stacks/transactions";
import { UserData } from "@stacks/connect";

import { useImmediateInterval } from "../../lib/hooks";
import { H3 } from "../../components/ui/Headings";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { getL1Balance } from "../../stacks/apiCalls";
import { callL1SubnetContract } from "../../stacks/callContract";

export function Deposit() {
  const { profile } = useLoaderData() as UserData;
  const address = profile.stxAddress.testnet;

  const [l1Balance, setL1Balance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const depositDisabled = !l1Balance;

  useImmediateInterval(async () => {
    const l1Info = await getL1Balance(address);
    setL1Balance(parseFloat(l1Info.balance) / 1_000_000);
    setIsLoading(false);
  }, 10_000);

  const handleSTXDeposit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = e.currentTarget.amountToDeposit.valueAsNumber;
    const ustxValue = BigInt(value * 1_000_000);
    e.currentTarget.reset();

    await callL1SubnetContract(
      "deposit-stx",
      [uintCV(ustxValue), principalCV(address)],
      [
        makeStandardSTXPostCondition(
          address,
          FungibleConditionCode.Equal,
          ustxValue,
        ),
      ],
    );
  };

  return (
    <div className={clsx("text-center", depositDisabled && "opacity-70")}>
      <p className="mt-5 text-sm">
        Deposit STX on
        <br /> GalleryParfait's Subnet
      </p>

      <form onSubmit={handleSTXDeposit}>
        <Input
          name="amountToDeposit"
          id="amountToDeposit"
          title="amount to deposit in STX"
          placeholder="0 STX"
          step="any"
          required
          type="number"
          className="mt-5"
          disabled={depositDisabled}
        />

        <p className="mt-5 text-xs text-hiro-neutral-300">
          Balance available on Stacks Testnet:
          <br />
          {!isLoading && l1Balance !== null ? (
            <span>{l1Balance.toLocaleString()} STX</span>
          ) : (
            "..."
          )}
        </p>

        <Button
          type="submit"
          disabled={depositDisabled}
          className="mt-6 h-12 w-full"
        >
          Deposit STX
        </Button>
      </form>
    </div>
  );
}
