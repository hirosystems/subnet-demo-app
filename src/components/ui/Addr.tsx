import { useCopyToClipboard } from "react-use";

export function Addr({ address: principal }: { address: string }) {
  const [, copyToClipboard] = useCopyToClipboard();
  const [address, contract] = principal.split(".");
  const short = `${address.slice(0, 4)}...${address.slice(address.length - 4)}`;
  return (
    <span
      title={address}
      onClick={() => copyToClipboard(address)}
      className="cursor-copy"
    >
      {contract ? `${short}.${contract}` : short}
    </span>
  );
}
