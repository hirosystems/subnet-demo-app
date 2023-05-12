import { Link, NavLink } from "react-router-dom";

import { ReactNode } from "react";
import { ButtonSecondary } from "./ui/Button";
import { Badge } from "./ui/LayerBadge";

type NFTProps = {
  id: bigint;
  layer: 1 | 2;
  children?: ReactNode;
  subText?: string;
  noLink?: boolean;
};

function getBgColor(id?: bigint) {
  if (!id) return "bg-neutral-300";
  if (id % 4n === 3n) return "bg-hiro-gold";
  if (id % 4n === 2n) return "bg-hiro-mint";
  if (id % 4n === 1n) return "bg-hiro-sky";
  return "bg-hiro-pink";
}

export function NFTImg({ id }: { id: bigint }) {
  // the nft associated image handled here
  // in the real world, it should be handled at the smart-contract level
  // with get-token-uri returning the image from a service like ipfs
  const nftType = id % 4n;

  return (
    <div className="flex aspect-square w-full justify-center rounded-lg">
      <img src={`/nft/GP-0${nftType}.jpg`} />
    </div>
  );
}

export function NFT({ id, children, layer, subText, noLink }: NFTProps) {
  const titleClassName = "mt-2 block font-sprat text-2xl text-hiro-black mb-2";
  return (
    <div className="w-full rounded-[7px] border border-hiro-neutral-200 p-[15px]">
      <NFTImg id={id} />
      <p className={titleClassName}>Parfait #{id.toString()}</p>

      <div className="mb-[10px]">
        <Badge layer={layer} />
      </div>

      {subText ? (
        <div className="flex items-center justify-between">
          {subText && <p className="text-sm">{subText}</p>}
          {children}
        </div>
      ) : (
        <div className="flex justify-end">{children}</div>
      )}

      {!noLink && (
        <Link to={`/nft/${id}`}>
          <ButtonSecondary className="w-full">See details</ButtonSecondary>
        </Link>
      )}
    </div>
  );
}
