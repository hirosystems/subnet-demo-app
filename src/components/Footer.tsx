import clsx from "clsx";
import logoUrl from "../assets/images/logo-symbol.svg";

export function Footer() {
  return (
    <footer className="footer flex flex-col justify-between p-10 text-sm md:flex-row">
      <p className="w-full text-hiro-neutral-300 md:w-1/3">
        © {new Date().getFullYear()} Hiro Systems PBC
      </p>

      <p className="w-full md:w-1/3 md:text-center">
        Made by{" "}
        <a
          href="https://docs.hiro.so"
          target="_blank"
          rel="noopener noreferrer"
          className={clsx(
            "h-[36px] w-[36px] border border-hiro-black p-1 pb-1",
            "shadow-button-small shadow-hiro-black",
            "transition-colors duration-150 hover:bg-hiro-sky",
            "-translate-x-0.5 -translate-y-0.5",
            "active:translate-x-0 active:translate-y-0 active:shadow-none",
          )}
        >
          <img
            className="inline -translate-y-0.5"
            width="16px"
            height="12px"
            src={logoUrl}
          />
        </a>{" "}
        on Stacks
      </p>

      <p className="links flex w-full gap-4 md:w-1/3 md:justify-end">
        <a
          href="https://docs.hiro.so/subnets/overview"
          target="_blank"
          rel="noopener noreferrer"
        >
          Docs
        </a>
        <a
          href="https://github.com/hirosystems/stacks-subnets/"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://www.hiro.so/blog/subnets-alpha-is-live-on-testnet"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more
        </a>
      </p>
    </footer>
  );
}
