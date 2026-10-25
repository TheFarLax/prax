"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="container not-found">
      <h1>Let’s try that again.</h1>
      <p>
        This page couldn’t be loaded. You can retry or return to the homepage.
      </p>
      <div className="hero-actions">
        <button type="button" onClick={reset} className="btn btn-primary">
          Try again
        </button>
        <Link href="/" className="btn btn-secondary">
          Back to Praxis
        </Link>
      </div>
    </section>
  );
}
