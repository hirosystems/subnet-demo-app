import { ReactNode } from "react";

export function NFTGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {children}
    </div>
  );
}
