import { LegalPage } from "@/components/legal-page";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Terms information",
  "Information about the availability of terms for the Praxis browser.",
  "/terms",
);

export default function TermsPage() {
  return <LegalPage kind="terms" />;
}
