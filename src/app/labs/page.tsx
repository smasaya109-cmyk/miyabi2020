import { getLabsGroupedByCategory } from "@/lib/labs";
import LabsTabs from "./LabsTabs";

export const dynamic = "force-static";

export default async function LabsPage() {
  const grouped = await getLabsGroupedByCategory();

  return (
    <main className="mx-auto w-full max-w-[760px] px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Labs
        </h1>
        <p className="mt-3 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
          HTML/CSS/Javascriptの基礎を学ぶことができます。
        </p>
      </header>

      <LabsTabs grouped={grouped} />
    </main>
  );
}
