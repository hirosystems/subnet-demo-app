import {
  makeContractCall,
  AnchorMode,
  contractPrincipalCV,
  broadcastTransaction,
  getNonce,
} from "@stacks/transactions";
import { StacksTestnet, HIRO_MOCKNET_DEFAULT } from "@stacks/network";

async function main() {
  const network = new StacksTestnet({ url: HIRO_MOCKNET_DEFAULT });
  const senderKey =
    "753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601";
  const deployerAddr = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM";
  const userAddr = "ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND";
  const nonce = await getNonce(deployerAddr, network);

  const txOptions = {
    contractAddress: deployerAddr,
    contractName: "subnet-v1-2",
    functionName: "register-new-nft-contract",
    functionArgs: [
      contractPrincipalCV(deployerAddr, "parfait-nft"),
      contractPrincipalCV(userAddr, "parfait-nft"),
    ],
    senderKey,
    validateWithAbi: false,
    network,
    anchorMode: AnchorMode.Any,
    fee: 10000,
    nonce: nonce + 1n,
  };

  const transaction = await makeContractCall(txOptions);

  const txid = await broadcastTransaction(transaction, network);

  console.log(txid);
}

main();
