import Link from "next/link";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container>
      <section className="py-20">
        <h1>404</h1>
        <p className="mt-4 max-w-2xl">
          ページが見つかりませんでした。
        </p>
        <div className="mt-8">
          <Link href="/" className="btn">
            Homeへ戻る
          </Link>
        </div>
      </section>
    </Container>
  );
}
