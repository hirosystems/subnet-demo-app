const env = import.meta.env;

export const L1_URL = env.VITE_L1_URL;
export const L2_URL = env.VITE_L2_URL;

export const L1_SUBNET_CONTRACT_ADDR = env.VITE_L1_SUBNET_CONTRACT_ADDR;
export const L1_SUBNET_CONTRACT_NAME = env.VITE_L1_SUBNET_CONTRACT_NAME;
export const L1_SUBNET_PRINCIPAL = `${L1_SUBNET_CONTRACT_ADDR}.${L1_SUBNET_CONTRACT_NAME}`;

export const L2_SUBNET_CONTRACT_ADDR = env.VITE_L2_SUBNET_CONTRACT_ADDR;
export const L2_SUBNET_CONTRACT_NAME = env.VITE_L2_SUBNET_CONTRACT_NAME;
export const L2_SUBNET_PRINCIPAL = `${L2_SUBNET_CONTRACT_ADDR}.${L2_SUBNET_CONTRACT_NAME}`;

export const L1_NFT_CONTRACT_ADDR = env.VITE_L1_NFT_CONTRACT_ADDR;
export const L2_NFT_CONTRACT_ADDR = env.VITE_L2_NFT_CONTRACT_ADDR;

export const NFT_CONTRACT_NAME = env.VITE_NFT_CONTRACT_NAME;
export const NFT_ASSET_NAME = env.VITE_NFT_ASSET_NAME;

export const NFT_ASSET_L1 = `${L1_NFT_CONTRACT_ADDR}.${NFT_CONTRACT_NAME}::${NFT_ASSET_NAME}`;
export const NFT_ASSET_L2 = `${L2_NFT_CONTRACT_ADDR}.${NFT_CONTRACT_NAME}::${NFT_ASSET_NAME}`;

export const MARKETPLACE_CONTRACT_ADDR = env.VITE_MARKETPLACE_CONTRACT_ADDR;
export const MARKETPLACE_CONTRACT_NAME = env.VITE_MARKETPLACE_CONTRACT_NAME;
export const MARKETPLACE_PRINCIPAL = `${MARKETPLACE_CONTRACT_ADDR}.${MARKETPLACE_CONTRACT_NAME}`;
