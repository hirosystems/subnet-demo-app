import { ContractCallRegularOptions, openContractCall } from "@stacks/connect";
import { StacksNetwork, StacksMocknet } from "@stacks/network";
import {
  ClarityValue,
  PostCondition,
  PostConditionMode,
  callReadOnlyFunction,
  cvToValue,
} from "@stacks/transactions";

import {
  L1_URL,
  L2_URL,
  L1_SUBNET_CONTRACT_ADDR,
  L1_SUBNET_CONTRACT_NAME,
  L2_SUBNET_CONTRACT_ADDR,
  L2_SUBNET_CONTRACT_NAME,
  L1_NFT_CONTRACT_ADDR,
  NFT_CONTRACT_NAME,
  L2_NFT_CONTRACT_ADDR,
  MARKETPLACE_CONTRACT_ADDR,
  MARKETPLACE_CONTRACT_NAME,
} from "./env";

const l1Network = new StacksMocknet({ url: L1_URL });
const l2Network = new StacksMocknet({ url: L2_URL }); // localhost:13999

export async function callContract(
  network: StacksNetwork,
  options: Pick<
    ContractCallRegularOptions,
    | "contractAddress"
    | "contractName"
    | "functionName"
    | "functionArgs"
    | "postConditions"
    | "postConditionMode"
  >,
) {
  const txOptions: ContractCallRegularOptions = {
    ...options,
    network,
  };

  await openContractCall(txOptions);
}

export function callL1SubnetContract(
  functionName: string,
  functionArgs: ClarityValue[],
  postConditions?: PostCondition[],
) {
  return callContract(l1Network, {
    contractAddress: L1_SUBNET_CONTRACT_ADDR,
    contractName: L1_SUBNET_CONTRACT_NAME,
    functionName,
    functionArgs,
    postConditionMode: PostConditionMode.Deny,
    postConditions,
  });
}

export function callL2SubnetContract(
  functionName: string,
  functionArgs: ClarityValue[],
  postConditions?: PostCondition[],
) {
  return callContract(l2Network, {
    contractAddress: L2_SUBNET_CONTRACT_ADDR,
    contractName: L2_SUBNET_CONTRACT_NAME,
    functionName,
    functionArgs,
    postConditionMode: PostConditionMode.Deny,
    postConditions,
  });
}

export function callL1NftContract(
  functionName: string,
  functionArgs: ClarityValue[],
  postConditions?: PostCondition[],
) {
  return callContract(l1Network, {
    contractAddress: L1_NFT_CONTRACT_ADDR,
    contractName: NFT_CONTRACT_NAME,
    functionName,
    functionArgs,
    postConditionMode: PostConditionMode.Deny,
    postConditions,
  });
}

export async function callReadOnlyL1NftContract(
  functionName: string,
  functionArgs: ClarityValue[],
  senderAddress: string,
) {
  try {
    const clarityValue = await callReadOnlyFunction({
      network: l1Network,
      contractAddress: L1_NFT_CONTRACT_ADDR,
      contractName: NFT_CONTRACT_NAME,
      functionName,
      functionArgs,
      senderAddress,
    });

    return cvToValue(clarityValue).value;
  } catch {
    return null;
  }
}

export function callL2NftContract(
  functionName: string,
  functionArgs: ClarityValue[],
  postConditions?: PostCondition[],
) {
  return callContract(l2Network, {
    contractAddress: L2_NFT_CONTRACT_ADDR,
    contractName: NFT_CONTRACT_NAME,
    functionName,
    functionArgs,
    postConditionMode: PostConditionMode.Deny,
    postConditions,
  });
}

export async function callReadOnlyL2NftContract(
  functionName: string,
  functionArgs: ClarityValue[],
  senderAddress: string,
) {
  try {
    const clarityValue = await callReadOnlyFunction({
      network: l2Network,
      contractAddress: L2_NFT_CONTRACT_ADDR,
      contractName: NFT_CONTRACT_NAME,
      functionName,
      functionArgs,
      senderAddress,
    });

    return cvToValue(clarityValue).value;
  } catch {
    return null;
  }
}

export function callL2MarketplaceContract(
  functionName: string,
  functionArgs: ClarityValue[],
  postConditions?: PostCondition[],
) {
  return callContract(l2Network, {
    contractAddress: MARKETPLACE_CONTRACT_ADDR,
    contractName: MARKETPLACE_CONTRACT_NAME,
    functionName,
    functionArgs,
    postConditionMode: PostConditionMode.Deny,
    postConditions,
  });
}
