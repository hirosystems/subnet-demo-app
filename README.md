# Subnet Demo App

The project demonstrates some of the capabilities of subnets through a simple NFT marketplace where minting, listing and offers happen on L2.

Flow:

- NFTs exchanges can happen on a subnet (L2)
  - Users can deposit their NFTs on the subnet
  - Then, they can receive offers or list their NFTs
- At any time, users can deposit or withdraw STX and NFTs on or from the subnet


## Project structure

- `./src` webapp
- `./clarity-l1` NFT contract to be deployed on stacks L1
- `./clarity-l2` NFT and marketplace contracts to be deployed on L2

Note: the `clarity-l2` contracts have to be deployed manually, be can still be checked and tested with `clarinet`.
Clarinet full support for subnets is in the roadmap. However, the `clarity-l2` contract can be deployed manually, then checked and tested with `clarinet`.

## Start project locally

#### Clarinet integrate

In the `./clarity-l1` folder run the following command:

```sh
clarinet integrate
```

Wait a few of minutes, as the subnet node is not ready until Stacks block 9.

Go to `clarity-l2/scripts/`.

First, install the script dependencies:

```sh
npm ci
```

Deposit some STX on the subnet by using the following command:

```sh
node ./fund.js
```

Wait a couple minutes for the funds to transfer. Then, publish the l2 contracts.

```sh
node ./publish.js subnet-demo-marketplace ../contracts/subnet-demo-marketplace.clar 0
node ./publish.js parfait-nft ../contracts/parfait-nft-l2.clar 1
```

Register the nft contract on the subnet:

```sh
node ./register.js
```

## Run front app

In the repo root `./` run

```sh
npm ci # install dependencies
npm run dev
```

The `npm run dev` command outputs a local link.

## Add the local subnet to your Hiro Wallet

Add a network to your Hiro wallet. Make sure the *network* and the *key* match. For example, "subnet". 
The URL is `http://localhost:13999`.
