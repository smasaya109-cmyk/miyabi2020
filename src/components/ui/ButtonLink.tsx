import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

type Props = Omit<ComponentProps<typeof Link>, "className"> & {
  className?: string;
  variant?: Variant;
  size?: Size;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const base =
  // calm + cool: 余白/角/フォーカス/影を丁寧に
  "no-underline inline-flex items-center justify-center gap-2 rounded-2xl font-medium tracking-tight transition " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white " +
  "active:translate-y-[1px] select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-zinc-900 text-zinc-50 shadow-sm shadow-zinc-900/20 ring-1 ring-inset ring-white/10 " +
    "hover:bg-zinc-800 hover:shadow-md hover:shadow-zinc-900/25",
  secondary:
    "border border-zinc-200/80 bg-white/70 text-zinc-900 shadow-sm shadow-zinc-900/5 " +
    "hover:bg-white hover:border-zinc-300/80 hover:shadow-md hover:shadow-zinc-900/10",
  ghost:
    "text-zinc-900 hover:bg-zinc-900/5",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-sm px-5 py-2.5",
  lg: "text-sm px-6 py-3",
};

export function ButtonLink({
  variant = "secondary",
  size = "md",
  className,
  ...props
}: Props) {
  return (
    <Link
      {...props}
      className={cn(base, variants[variant], sizes[size], className)}
    />
  );
}
