import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function Prose({ className, children }: Props) {
  return (
    <article
      className={cn(
        "prose prose-zinc max-w-none",
        "prose-headings:font-medium prose-headings:tracking-tight",
        "prose-p:leading-7",
        "prose-a:decoration-zinc-300 hover:prose-a:decoration-zinc-900",
        className
      )}
    >
      {children}
    </article>
  );
}

