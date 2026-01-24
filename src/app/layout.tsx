import type { Metadata } from "next";
import "./globals.css";
import { SkipLink } from "@/components/SkipLink";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { site } from "@/lib/site"
import { FloatingMenu } from "@/components/layout/FloatingMenu";
import { PageTransition } from "@/components/layout/PageTransition";


export const metadata: Metadata = {
  title: {
    default: `${site.name} — miyabi2020.com`,
    template: `%s — ${site.name}`
  },
  description: site.description
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  const mainTop = site.ui.showHeader ? "" : "pt-22 sm:pt-24";
  return (
    <html lang="ja">
      <body >
        <SkipLink />
        {site.ui.showHeader ? <SiteHeader /> : null}

        <div className="min-h-dvh flex flex-col">
          <main className={`flex-1 ${mainTop} pb-18 sm:pb-22`}>
            <PageTransition>{children}</PageTransition>
          </main>

          <SiteFooter />
          <FloatingMenu />
        </div>
      </body>
    </html>
  );
}
