import Link from "next/link";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="eyebrow text-gold-600">404</p>
      <h1 className="dash-title mt-3">That page has moved on</h1>
      <Link href="/" className="btn-secondary mt-6">
        Back home
      </Link>
    </Container>
  );
}