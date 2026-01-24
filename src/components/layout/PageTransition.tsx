"use client";

import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // pathname で key を切って、ページ毎に軽いアニメを付与
  return (
    <div key={pathname} className="page-enter motion-reduce:animate-none">
      {children}
    </div>
  );
}
