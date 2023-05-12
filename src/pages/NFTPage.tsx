import { ChangeEvent, ReactNode, useState } from "react";
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";

import {
  ClarityValue,
  NonFungibleConditionCode,
  Pc,
  contractPrincipalCV,
  createAssetInfo,
  makeStandardNonFungiblePostCondition,
  noneCV,
  principalCV,
  standardPrincipalCV,
  tupleCV,
  uintCV,
} from "@stacks/transactions";

import {
  callL1SubnetContract,
  callL2MarketplaceContract,
  callL2NftContract,
  callL2SubnetContract,
  callReadOnlyL1NftContract,
  callReadOnlyL2NftContract,
} from "../stacks/callContract";
import { getListingDetails } from "../stacks/apiCalls";
import { userSession } from "../stacks/auth";
import {
  L1_NFT_CONTRACT_ADDR,
  L2_NFT_CONTRACT_ADDR,
  MARKETPLACE_CONTRACT_ADDR,
  MARKETPLACE_CONTRACT_NAME,
  MARKETPLACE_PRINCIPAL,
  NFT_ASSET_L2,
  NFT_ASSET_NAME,
  NFT_CONTRACT_NAME,
} from "../stacks/env";
import { NFTImg } from "../components/NFT";
import { H2, H3, H4, H5 } from "../components/ui/Headings";
import { Button, ButtonSecondary } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Addr } from "../components/ui/Addr";
import { Badge } from "../components/ui/LayerBadge";

type NFTData = {
  id: bigint;
  owner: null | string;
  layer: 1 | 2;
  address: string;
  listingData: null | {
    price: bigint;
    maker: string;
    taker: null | string;
  };
};

export async function NFTLoader({
  params,
}: LoaderFunctionArgs): Promise<NFTData> {
  const id = BigInt(params.nftId!);

  const userData = userSession.loadUserData();
  const address = userData.profile.stxAddress.testnet as string;

  const ownerReqParams = [
    "get-owner",
    [uintCV(id)] as ClarityValue[],
    address,
  ] as const;

  const ownerL2 = await callReadOnlyL2NftContract(...ownerReqParams);
  let ownerL1 = null;
  if (!ownerL2) {
    ownerL1 = await callReadOnlyL1NftContract(...ownerReqParams);
  }

  const layer: Readonly<1 | 2> = ownerL1 ? 1 : 2;
  const rawOwner = ownerL1 || ownerL2;
  const owner = rawOwner ? rawOwner.value : null;

  const forSale = owner === MARKETPLACE_PRINCIPAL;

  let listingData = null;
  if (forSale) {
    const rawListingData = await getListingDetails(
      contractPrincipalCV(L2_NFT_CONTRACT_ADDR, NFT_CONTRACT_NAME),
      uintCV(id),
    );
    if (!rawListingData) throw new Error("wrong listing daata");

    listingData = {
      price: BigInt(rawListingData.value.price.value),
      maker: rawListingData.value.maker.value as string,
      taker: rawListingData.value.taker.value as null | string,
    };
  }
  return { id, owner, layer, address, listingData };
}

type NFTsList = Awaited<ReturnType<typeof NFTLoader>>;

function OwnerInteractionsL2({ id, address }: { id: bigint; address: string }) {
  const [price, setPrice] = useState<number | string>("");
  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setPrice("");
      return;
    }
    setPrice(e.target!.valueAsNumber);
  };

  const [transferAddress, setTransferAddress] = useState<string>("");
  const handleTransferAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTransferAddress(e.target!.value);
  };

  const list = () => {
    setPrice("");
    const postCondition = makeStandardNonFungiblePostCondition(
      address,
      NonFungibleConditionCode.Sends,
      createAssetInfo(L2_NFT_CONTRACT_ADDR, NFT_CONTRACT_NAME, NFT_ASSET_NAME),
      uintCV(id),
    );
    const args = [
      contractPrincipalCV(L2_NFT_CONTRACT_ADDR, NFT_CONTRACT_NAME),
      uintCV(id),
      tupleCV({
        taker: noneCV(),
        price: uintCV(parseInt(price as any) * 1_000_000),
      }),
    ];

    callL2MarketplaceContract("list-asset", args, [postCondition]);
  };

  const transfer = () => {
    setTransferAddress("");
    const postCondition = makeStandardNonFungiblePostCondition(
      address,
      NonFungibleConditionCode.Sends,
      createAssetInfo(L2_NFT_CONTRACT_ADDR, NFT_CONTRACT_NAME, NFT_ASSET_NAME),
      uintCV(id),
    );
    const args = [
      uintCV(id),
      principalCV(address),
      principalCV(transferAddress),
    ];

    callL2NftContract("transfer", args, [postCondition]);
  };

  return (
    <>
      <div className="mt-2">
        <H5>List on marketplace</H5>
        <Form onSubmit={list}>
          <span>
            <Input
              name="list-price"
              placeholder="Price"
              className="rounded"
              type="number"
              value={price}
              onChange={handlePriceChange}
              small
            />{" "}
            STX
          </span>
          <ButtonSecondary type="submit" disabled={price === ""}>
            List
          </ButtonSecondary>
        </Form>
      </div>

      <div className="mt-2">
        <H5>Transfer to address</H5>
        <Form onSubmit={transfer}>
          <Input
            name="stx-address"
            placeholder="STX Address"
            className="mr-2 w-full rounded"
            type="text"
            value={transferAddress}
            onChange={handleTransferAddressChange}
            small
          />
          <ButtonSecondary
            className="shrink-0 flex-grow"
            type="submit"
            disabled={!transferAddress}
          >
            Transfer
          </ButtonSecondary>
        </Form>
      </div>
    </>
  );
}

function Buy({
  id,
  price,
  address,
}: {
  id: bigint;
  price: bigint;
  address: string;
}) {
  const buy = () => {
    const nftPC = Pc.principal(MARKETPLACE_PRINCIPAL)
      .willSendAsset()
      .nft(NFT_ASSET_L2, uintCV(id));

    const stxPC = Pc.principal(address).willSendEq(price).ustx();

    const args = [
      contractPrincipalCV(L2_NFT_CONTRACT_ADDR, NFT_CONTRACT_NAME),
      uintCV(id),
    ];

    callL2MarketplaceContract("fulfil-listing", args, [nftPC, stxPC]);
  };

  return (
    <Form onSubmit={() => {}}>
      <span className="text-hiro-neutral-400">
        Buy for{" "}
        <span className="text-hiro-black">
          {(price / 1_000_000n).toLocaleString()}STX
        </span>
      </span>
      <ButtonSecondary onClick={buy}>Buy</ButtonSecondary>
    </Form>
  );
}

function CancelListing({ id }: { id: bigint; address: string }) {
  const cancel = () => {
    const pc = Pc.principal(MARKETPLACE_PRINCIPAL)
      .willSendAsset()
      .nft(NFT_ASSET_L2, uintCV(id));

    const args = [
      contractPrincipalCV(L2_NFT_CONTRACT_ADDR, NFT_CONTRACT_NAME),
      uintCV(id),
    ];

    callL2MarketplaceContract("cancel-listing", args, [pc]);
  };

  return (
    <Form onSubmit={() => {}}>
      <span>Cancel listing</span>
      <ButtonSecondary onClick={cancel}>Cancel</ButtonSecondary>
    </Form>
  );
}

export function NFTPage() {
  const { id, owner, layer, listingData, address } =
    useLoaderData() as NFTsList;

  const isSeller =
    layer === 2 && !!listingData && listingData.maker === address;
  const canBuy = layer === 2 && !!listingData && !isSeller;
  const isOwner = owner === address;

  const deposit = () => {
    const postCondition = makeStandardNonFungiblePostCondition(
      address,
      NonFungibleConditionCode.Sends,
      createAssetInfo(L1_NFT_CONTRACT_ADDR, NFT_CONTRACT_NAME, NFT_ASSET_NAME),
      uintCV(id),
    );
    const args = [
      contractPrincipalCV(L1_NFT_CONTRACT_ADDR, NFT_CONTRACT_NAME),
      uintCV(id),
      standardPrincipalCV(address),
    ];

    callL1SubnetContract("deposit-nft-asset", args, [postCondition]);
  };

  const withdraw = () => {
    const postCondition = makeStandardNonFungiblePostCondition(
      address,
      NonFungibleConditionCode.Sends,
      createAssetInfo(L2_NFT_CONTRACT_ADDR, NFT_CONTRACT_NAME, NFT_ASSET_NAME),
      uintCV(id),
    );
    const args = [
      contractPrincipalCV(L2_NFT_CONTRACT_ADDR, NFT_CONTRACT_NAME),
      uintCV(id),
      standardPrincipalCV(address),
    ];

    callL2SubnetContract("nft-withdraw?", args, [postCondition]);
  };

  return (
    <div>
      <div className="mb-2 mt-10 flex flex-col gap-8 sm:flex-row">
        <div className="w-full sm:w-4/5">
          <NFTImg id={id} />
        </div>

        <div className="w-full">
          <H2 className="mb-12 font-sprat text-5xl text-hiro-black">
            Parfait #{id.toString()}
          </H2>

          <div className="mb-10">
            <Informations>
              <span>Owner</span>
              <span>
                {owner ? (
                  <>
                    <Addr address={owner} /> {isOwner && "(you)"}
                  </>
                ) : (
                  "None"
                )}
              </span>
            </Informations>

            {!!listingData ? (
              <Informations>
                <span>Seller:</span>
                <span>
                  <Addr address={listingData.maker} /> {isSeller && "(you)"}
                </span>
              </Informations>
            ) : null}

            <Informations>
              <span>Layer:</span>
              <span>
                <Badge layer={layer} />
              </span>
            </Informations>
          </div>

          {isOwner &&
            (layer === 1 ? (
              <Button className="h-12 w-full" onClick={deposit}>
                Deposit on Subnet
              </Button>
            ) : (
              <Button className="h-12 w-full" onClick={withdraw}>
                Withdraw from Subnet to Tesnet
              </Button>
            ))}

          {layer === 2 && (
            <>
              {(isSeller || canBuy || isOwner) && (
                <H3 className="mb-1 mt-10 font-sprat">Other actions</H3>
              )}

              {isSeller && <CancelListing {...{ id, address, listingData }} />}
              {canBuy && <Buy {...{ id, address, price: listingData.price }} />}

              {isOwner && <OwnerInteractionsL2 {...{ id, address }} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Informations({ children }: { children: ReactNode[] }) {
  return (
    <div className="mb-2 flex justify-between border-b border-b-hiro-neutral-200 py-3">
      {children}
    </div>
  );
}

function Form({
  children,
  onSubmit,
}: {
  children: ReactNode;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        return onSubmit(e);
      }}
      className="flex justify-between rounded border border-hiro-neutral-200 p-3"
    >
      {children}
    </form>
  );
}
