import Link from "next/link";
import { BrandSymbol } from "@/components/brand";
import { Icon } from "@/components/icon";

export default function NotFound() {
  return (
    <section className="container not-found">
      <BrandSymbol />
      <span>404</span>
      <h1>A different direction.</h1>
      <p>We couldn’t find that page. Let’s get you back to Praxis.</p>
      <Link className="btn btn-primary" href="/">
        Back to the browser
        <Icon name="arrowRight" size={19} />
      </Link>
    </section>
  );
}
