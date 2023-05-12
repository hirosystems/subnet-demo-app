import { useLoaderData } from "react-router-dom";
import { FormEvent, useState } from "react";
import clsx from "clsx";
import { Pc, principalCV, uintCV } from "@stacks/transactions";
import { UserData } from "@stacks/connect";

import { useImmediateInterval } from "../../lib/hooks";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { getL2Balance } from "../../stacks/apiCalls";
import { callL2SubnetContract } from "../../stacks/callContract";

export function Withdraw() {
  const { profile } = useLoaderData() as UserData;
  const address = profile.stxAddress.testnet;

  const [l2Balance, setL2Balance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useImmediateInterval(async () => {
    const l2Info = await getL2Balance(address);
    setL2Balance(parseFloat(l2Info.balance) / 1_000_000);
    setIsLoading(false);
  }, 5_000);

  const withdrawDisabled = !l2Balance;

  const handleSTXWithdraw = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = e.currentTarget.amountToWithdraw.valueAsNumber;
    e.currentTarget.reset();

    const ustxValue = BigInt(value * 1_000_000);
    const pc = Pc.principal(address).willSendEq(ustxValue).ustx();

    await callL2SubnetContract(
      "stx-withdraw?",
      [uintCV(ustxValue), principalCV(address)],
      [pc],
    );
  };

  return (
    <div
      className={clsx("flex-1 text-center", withdrawDisabled && "opacity-70")}
    >
      <p className="mt-5 text-sm">
        Withdraw STX from
        <br /> GalleryParfait's Subnet
      </p>

      <form onSubmit={handleSTXWithdraw}>
        <Input
          name="amountToWithdraw"
          id="amountToWithdraw"
          title="amount to withdraw in STX"
          className="mt-5"
          type="number"
          step="any"
          placeholder="0 STX"
          required
          disabled={withdrawDisabled}
        />

        <p className="mt-5 text-xs text-hiro-neutral-300">
          Balance available on Subnet:
          <br />
          {!isLoading && l2Balance !== null ? (
            <span>{l2Balance.toLocaleString()} STX</span>
          ) : (
            "..."
          )}
        </p>

        <Button
          type="submit"
          disabled={withdrawDisabled}
          className="mt-6 h-12 w-full"
        >
          Withdraw STX
        </Button>
      </form>
    </div>
  );
}
