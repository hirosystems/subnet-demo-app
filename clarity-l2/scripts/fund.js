import {
  makeContractCall,
  AnchorMode,
  broadcastTransaction,
  getNonce,
  uintCV,
  principalCV,
  PostConditionMode,
} from "@stacks/transactions";
import { StacksTestnet, HIRO_MOCKNET_DEFAULT } from "@stacks/network";

async function main() {
  const network = new StacksTestnet({ url: HIRO_MOCKNET_DEFAULT });
  const senderKey =
    "f9d7206a47f14d2870c163ebab4bf3e70d18f5d14ce1031f3902fbbc894fe4c701";
  const deployerAddr = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
  const nonce = await getNonce(
    "ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND",
    network,
  );

  const txOptions = {
    contractAddress: deployerAddr,
    contractName: "subnet-v1-2",
    functionName: "deposit-stx",
    functionArgs: [
      uintCV(200 * 1_000_000),
      principalCV("ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND"),
    ],
    senderKey,
    validateWithAbi: false,
    network,
    anchorMode: AnchorMode.Any,
    fee: 10000,
    nonce,
    postConditionMode: PostConditionMode.Allow,
  };

  const transaction = await makeContractCall(txOptions);

  const txid = await broadcastTransaction(transaction, network);

  console.log(txid);
}

main();
