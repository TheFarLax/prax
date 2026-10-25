import Link from "next/link";
import { product } from "@/lib/product";
import { Wordmark } from "./brand";
import { Icon } from "./icon";
import { ThemeSwitch } from "./theme-switch";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-intro">
            <Wordmark />
            <p>
              A browser with more possibility.
              <br />
              From Xasri.
            </p>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            <div>
              <span>Explore</span>
              <Link href="/#browser">Browser</Link>
              <Link href="/xasri-ai">Xasri AI</Link>
              <Link href="/features">Features</Link>
              <Link href="/download">Download</Link>
            </div>
            <div>
              <span>Good to know</span>
              <Link href="/support">Support & FAQ</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              {product.social.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {social.name}
                  <Icon name="arrowUpRight" size={14} />
                </a>
              ))}
            </div>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>PRAXIS, from Xasri</span>
          <ThemeSwitch />
          <a href="#top" className="back-top">
            Back to top
            <Icon name="arrowUpRight" size={16} />
          </a>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          <Wordmark linked={false} />
        </div>
      </div>
    </footer>
  );
}
