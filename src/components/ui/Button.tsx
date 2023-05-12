import clsx from "clsx";

export function Button(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) {
  return (
    <button
      {...props}
      className={clsx(
        "font-sprat",
        "inline-block min-w-[8rem] border bg-hiro-neutral-200 px-8 py-1 text-lg transition-colors",
        "text-hiro-black",
        "active:translate-x-0 active:translate-y-0 active:shadow-none",
        !props.disabled
          ? "-translate-x-0.5 -translate-y-0.5 border-hiro-black shadow-button shadow-hiro-black hover:bg-hiro-sky"
          : "border-hiro-gray2 opacity-60",
        props.className,
      )}
    />
  );
}

export function ButtonSmall(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) {
  return (
    <button
      {...props}
      className={clsx(
        props.className,
        "font-sprat text-base",
        "inline-block min-w-[6rem] border bg-hiro-neutral-100 px-2 py-1 transition-colors",
        "border-hiro-black text-hiro-black",
        "active:translate-x-0 active:translate-y-0",
        "shadow-button shadow-hiro-black",
        !props.disabled ? "-translate-x-0.5 -translate-y-0.5 " : "opacity-60",
        !props.disabled && "hover:bg-hiro-neutral-200",
      )}
    />
  );
}

export function ButtonSecondary(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) {
  return (
    <button
      {...props}
      className={clsx(
        props.className,
        "font-aeonik",
        "min-w-[4rem] rounded border border-hiro-neutral-200 px-4 py-1 text-sm transition-colors",
        props.disabled ? "opacity-60" : "hover:bg-hiro-sky",
      )}
    />
  );
}
