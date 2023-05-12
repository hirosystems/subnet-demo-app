import { NavLink, NavLinkProps, Outlet } from "react-router-dom";

import { H3 } from "../../components/ui/Headings";
import clsx from "clsx";

export function MyNFTs() {
  return (
    <div>
      <div className="m-auto mb-6 flex justify-around md:w-2/3">
        <MenuLink to="/my-nfts/">All</MenuLink>
        <MenuLink to="/my-nfts/l1">On Stacks Tesnet</MenuLink>
        <MenuLink to="/my-nfts/l2">On Parfait Subnet</MenuLink>
      </div>

      <Outlet />
    </div>
  );
}

function MenuLink(
  props: NavLinkProps & React.RefAttributes<HTMLAnchorElement>,
) {
  return (
    <NavLink
      {...props}
      className={({ isActive }) =>
        clsx(
          "w-1/3",
          "rounded-[2px] py-[10px] text-center ",
          "transition-all duration-100",
          isActive ? "text-hiro-black underline" : "text-hiro-neutral-300",
        )
      }
    />
  );
}
