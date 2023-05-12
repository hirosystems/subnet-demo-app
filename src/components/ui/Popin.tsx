import clsx from "clsx";
import { ReactNode } from "react";

type PopinProps = {
  text: string;
  children: ReactNode | ReactNode[];
};

export function Popin({ text, children }: PopinProps) {
  return (
    <span className="group relative inline-block cursor-pointer text-left underline hover:bg-hiro-mint">
      {text}
      <span
        className={clsx(
          "z-50",
          "custom-backdrop",
          "absolute left-[-150px] top-[-216px] w-[460px] border border-hiro-black p-5 text-xs backdrop-blur-sm md:left-[76px] md:top-[-216px]",
          "hidden group-hover:inline-block",
        )}
      >
        {children}
      </span>
    </span>
  );
}
