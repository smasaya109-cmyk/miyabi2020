import { site } from "@/lib/site";
import { ButtonLink } from "@/components/ui/ButtonLink";


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


        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink href="/about" variant="primary" size="lg">
            miyabiとは <span className="opacity-90">→</span>
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary" size="lg">
            Contact <span className="text-zinc-700">→</span>
          </ButtonLink>
        </div>

    </div>
  );
}

