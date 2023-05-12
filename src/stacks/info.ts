import { BlocksApi, Configuration } from "@stacks/blockchain-api-client";

export async function getLastBlock(networkUrl: string) {
  const api = new BlocksApi(new Configuration({ basePath: networkUrl }));
  const blocks = await api.getBlockList({ limit: 1 });
  return blocks.results.length === 1 ? blocks.results[0] : null;
}
