import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  children: React.ReactNode;
};

export function Container({ className, children }: Props) {
  return (
    <div className={cn("mx-auto w-full max-w-[860px] px-5 sm:px-6", className)}>
      {children}
    </div>
  );
}
