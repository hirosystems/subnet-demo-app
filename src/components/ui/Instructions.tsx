import { ReactNode } from "react";

export function Instructions({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  return (
    <div className="mb-6 border border-hiro-black bg-hiro-gray-08 px-[22px] py-[18px] text-sm">
      <p className="mb-4 inline-block border border-hiro-black px-[6px] py-1 uppercase">
        *Instructions*
      </p>
      <ul className="instruction-text mb-1 flex flex-col gap-2 leading-5">
        {children}
      </ul>
    </div>
  );
}
