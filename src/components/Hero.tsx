import Link from "next/link";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <div className="pt-12 pb-14 sm:pt-16 sm:pb-16">
      <p className="text-sm text-zinc-600">{site.title}</p>

      <h1 className="mt-3 text-3xl sm:text-4xl font-medium tracking-tight text-zinc-950">
        {site.name}
      </h1>

      <div className="mt-6 max-w-[68ch] space-y-4 text-sm sm:text-base leading-7 sm:leading-8 text-zinc-700">
        {site.intro.map((line) => (
          <p key={line} className="m-0">
            {line}
          </p>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
            href="/about"
            className="no-underline inline-flex items-center justify-center rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-800"
        >
            miyabi.comとは
        </Link>

        <Link
            href="/contact"
            className="no-underline inline-flex items-center justify-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50"
        >
            Contact
        </Link>
      </div>


      {site.links?.length ? (
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          {site.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target={l.url.startsWith("/") ? undefined : "_blank"}
              rel={l.url.startsWith("/") ? undefined : "noreferrer noopener"}
              className="text-zinc-700 hover:text-zinc-950 underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-900"
            >
              {l.label}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

