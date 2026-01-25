import Link from "next/link";
import { Container } from "@/components/Container";

export const metadata = {
  title: "Contact"
};

export default function ContactPage() {
  return (
    <Container>
      <section className="py-14 sm:py-16">
        <h1>Contact</h1>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="card">
            <h2 className="text-lg sm:text-xl">相談したい</h2>
            <p className="mt-2">
              目的・予算感・納期など、わかる範囲で添えてください。
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a className="btn btn-primary" href="mailto:contact@miyabi2020.com">
                メールする
              </a>
              <Link className="btn" href="/showcase">
                先に制作物を見る
              </Link>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg sm:text-xl">想定フロー</h2>
            <ol className="mt-3 list-decimal pl-5 text-zinc-700 space-y-2">
              <li>要件ヒアリング</li>
              <li>見積り/スケジュール</li>
              <li>制作→確認→納品</li>
            </ol>
          </div>
        </div>
      </section>
    </Container>
  );
}
