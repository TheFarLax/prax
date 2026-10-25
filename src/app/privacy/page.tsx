import { LegalPage } from "@/components/legal-page";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata(
  "Privacy information",
  "Privacy information for the Praxis website and the availability of the browser's privacy notice.",
  "/privacy",
);

export default function PrivacyPage() {
  return <LegalPage kind="privacy" />;
}
