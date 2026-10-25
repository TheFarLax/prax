import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ExperienceProvider } from "@/components/overview";
import { SiteEffects } from "@/components/site-effects";
import { mainTour } from "@/lib/product";
import { allowIndexing, siteOrigin } from "@/lib/site";
import "./globals.css";

const manrope = localFont({
  src: "../../fonts/manrope-latin-variable.woff2",
  variable: "--font-manrope",
  display: "swap",
  weight: "200 800",
  fallback: ["Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin ?? "http://localhost:3001"),
  title: {
    default: "PRAXIS | Your browser. Ready to do more.",
    template: "%s | PRAXIS",
  },
  description:
    "Meet Praxis, an AI-powered browser from Xasri. Explore the web with Xasri AI and turn instructions into supported browser actions.",
  applicationName: "Praxis",
  robots: {
    index: allowIndexing,
    follow: allowIndexing,
    googleBot: { index: allowIndexing, follow: allowIndexing },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/brand/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/brand/icon-180.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#17171a" },
  ],
};

const themeScript = `(function(){try{var saved=localStorage.getItem('praxis-website-theme');document.documentElement.dataset.theme=saved==='light'||saved==='dark'?saved:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const tour = mainTour ? { ...mainTour, evidence: undefined } : undefined;
  return (
    <html
      lang="en"
      className={manrope.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body id="top">
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ExperienceProvider tour={tour}>
          <Header />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer />
          <SiteEffects />
        </ExperienceProvider>
      </body>
    </html>
  );
}
