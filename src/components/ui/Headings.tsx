import clsx from "clsx";

type HeadingProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

function Heading(props: HeadingProps & { as: React.ElementType }) {
  return (
    <props.as {...props} className={clsx(props.className, "font-aeonik")} />
  );
}

export function H1(props: HeadingProps) {
  return (
    <Heading
      as={"h1"}
      {...props}
      className={clsx(props.className, "bold text-4xl")}
    />
  );
}

export function H2(props: HeadingProps) {
  return (
    <Heading
      as={"h2"}
      {...props}
      className={clsx(props.className, "mb-2 text-3xl leading-loose")}
    />
  );
}

export function H3(props: HeadingProps) {
  return (
    <Heading
      as={"h3"}
      {...props}
      className={clsx(props.className, " text-2xl leading-loose")}
    />
  );
}

export function H4(props: HeadingProps) {
  return (
    <Heading
      as={"h4"}
      {...props}
      className={clsx(props.className, "mb-2 text-xl")}
    />
  );
}

export function H5(props: HeadingProps) {
  return (
    <Heading
      as={"h5"}
      {...props}
      className={clsx(props.className, "mb-1 text-lg")}
    />
  );
}

export function H6(props: HeadingProps) {
  return (
    <Heading
      as={"h6"}
      {...props}
      className={clsx(props.className, "text-lg")}
    />
  );
}
