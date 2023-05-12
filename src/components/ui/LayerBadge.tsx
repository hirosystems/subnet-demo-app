import clsx from "clsx";

type BadgeProps = {
  layer: 1 | 2;
};

export function Badge({ layer }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-block rounded-full px-4 py-1",
        "text-xs",
        layer === 1 ? "bg-hiro-purple" : "bg-hiro-mint",
      )}
    >
      {layer === 1 ? "stacks-testnet" : "parfait-subnet"}
    </span>
  );
}
