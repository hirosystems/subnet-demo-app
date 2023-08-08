import {
  AnchorMode,
  makeContractDeploy,
  broadcastTransaction,
} from "@stacks/transactions";
import { StacksTestnet } from "@stacks/network";
import { readFileSync } from "fs";

async function main() {
  const senderKey =
    "f9d7206a47f14d2870c163ebab4bf3e70d18f5d14ce1031f3902fbbc894fe4c701";
  const networkUrl = "http://localhost:30443";
  // const senderKey =
  //   "38d5e877eaa95c651e0415d7a6ec32bfdd71e0530b60e1411fcc2420fd9746c701";
  // const networkUrl = "https://api.subnets.testnet.hiro.so";
  const network = new StacksTestnet({ url: networkUrl });
  network.chainId = 1426085120;

  const contractName = process.argv[2];
  const contractFilename = process.argv[3];
  const nonce = parseInt(process.argv[4]);

  const codeBody = readFileSync(contractFilename, { encoding: "utf-8" });

  const transaction = await makeContractDeploy({
    codeBody,
    contractName,
    senderKey,
    network,
    anchorMode: AnchorMode.Any,
    fee: 10000,
    nonce,
  });

  const txid = await broadcastTransaction(transaction, network);

  console.log(txid);
}

main();
