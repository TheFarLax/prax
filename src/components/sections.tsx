import Link from "next/link";
import { faqs } from "@/content/faq";
import {
  featureOrder,
  features,
  heroLoop,
  releases,
  screenshot,
  videos,
  type ProductScreenshot,
  type ProductVideo,
} from "@/lib/product";
import { AgenticWalkthrough } from "./agentic-walkthrough";
import { BrandScene, BrandSymbol } from "./brand";
import { FaqList } from "./faq";
import { Icon } from "./icon";
import { OverviewTrigger } from "./overview";
import {
  FeatureVideo,
  ProductLoop,
  ProductMedia,
  ThemeGallery,
} from "./product-media";

function publicShot(shot: ProductScreenshot) {
  return {
    id: shot.id,
    src: shot.src,
    width: shot.width,
    height: shot.height,
    alt: shot.alt,
    caption: shot.caption,
    platform: shot.platform,
    build: shot.build,
    authentic: shot.authentic,
    theme: shot.theme,
  };
}

function publicVideo(video: ProductVideo) {
  return {
    id: video.id,
    title: video.title,
    src: video.src,
    type: video.type,
    poster: video.poster,
    width: video.width,
    height: video.height,
    captions: video.captions,
    transcript: video.transcript,
    duration: video.duration,
    editedForLength: video.editedForLength,
    build: video.build,
    authentic: video.authentic,
  };
}

export function Hero() {
  const home = screenshot("home-desktop");
  const mobile = screenshot("home-mobile");
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="container hero-content">
        <div className="hero-eyebrow hero-enter">
          The browser, with more possibility.
          <span className="eyebrow-line" />
          From Xasri
        </div>
        <h1 id="hero-heading" className="hero-enter hero-enter-1">
          Your browser.
          <br />
          Ready to do <span>more.</span>
        </h1>
        <p className="hero-description hero-enter hero-enter-2">
          Explore the web, understand what matters, and turn instructions into
          browser actions with Xasri AI.
        </p>
        <div className="hero-actions hero-enter hero-enter-3">
          <Link href="/download" prefetch={false} className="btn btn-primary">
            Download Praxis
            <Icon name="download" size={19} />
          </Link>
          <OverviewTrigger />
        </div>
      </div>
      <div className="container hero-showcase hero-enter hero-enter-4">
        {heroLoop ? (
          <ProductLoop video={publicVideo(heroLoop)} />
        ) : home ? (
          <ProductMedia
            shot={publicShot(home)}
            mobileShot={mobile ? publicShot(mobile) : undefined}
            priority
          />
        ) : (
          <BrandScene />
        )}
      </div>
    </section>
  );
}

export function BrowserIntroduction() {
  return (
    <section
      className="section browser-intro container"
      id="browser"
      aria-labelledby="browser-heading"
    >
      <div className="intro-title" data-reveal>
        <span className="small-symbol">
          <BrandSymbol />
        </span>
        <h2 id="browser-heading">
          A familiar place.
          <br />
          <span className="muted-heading">A new kind of possibility.</span>
        </h2>
        <p>
          The web is where things begin. Praxis brings browsing and an AI
          assistant together, so your next question can become a next step.
        </p>
      </div>
      <div className="intro-columns" data-reveal>
        <div>
          <Icon name="browser" size={28} />
          <h3>Browse naturally.</h3>
          <p>A browser at the centre of your everyday web.</p>
          <Link href="/features" className="text-link">
            Meet the browser
            <Icon name="arrowRight" size={17} />
          </Link>
        </div>
        <div>
          <Icon name="sparkle" size={28} />
          <h3>Ask in the moment.</h3>
          <p>Xasri AI brings an assistant into the browsing experience.</p>
          <Link href="/xasri-ai" className="text-link">
            Meet Xasri AI
            <Icon name="arrowRight" size={17} />
          </Link>
        </div>
        <div>
          <Icon name="cursor" size={28} />
          <h3>Move things forward.</h3>
          <p>Connect your instructions to supported browser actions.</p>
          <Link href="/#agentic" className="text-link">
            Explore agentic browsing
            <Icon name="arrowRight" size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function AgenticSection() {
  const taskVideo = videos.find((video) => video.id === "agent-task");
  return (
    <section
      className="dark-section section"
      id="agentic"
      aria-labelledby="agentic-heading"
    >
      <div className="container">
        <div className="section-heading" data-reveal>
          <span className="eyebrow">A different way to browse</span>
          <h2 id="agentic-heading">
            From a question
            <br />
            to a completed task.
          </h2>
          <p>
            Agentic browsing connects what you ask with what the browser can do.
            Here’s how the idea fits together.
          </p>
        </div>
        <div data-reveal>
          {taskVideo ? (
            <FeatureVideo video={publicVideo(taskVideo)} />
          ) : (
            <AgenticWalkthrough />
          )}
        </div>
        <div className="section-bottom-link">
          <Link href="/xasri-ai" className="text-link">
            A closer look at Xasri AI
            <Icon name="arrowRight" size={18} />
          </Link>
          <span>Supported actions depend on your Praxis build.</span>
        </div>
      </div>
    </section>
  );
}

export function AssistantSection() {
  const panel = screenshot("assistant-page");
  return (
    <section
      className="section container assistant-section"
      id="xasri"
      aria-labelledby="assistant-heading"
    >
      <div className="assistant-art" data-reveal>
        {panel ? (
          <ProductMedia shot={publicShot(panel)} />
        ) : (
          <div className="assistant-concept">
            <div className="assistant-orbit orbit-one" />
            <div className="assistant-orbit orbit-two" />
            <div className="assistant-centre">
              <Icon name="sparkle" size={48} />
              <span>Xasri AI</span>
            </div>
            <div className="concept-word word-browse">A page to explore.</div>
            <div className="concept-word word-ask">A question to ask.</div>
            <span className="assistant-art-caption">Concept illustration</span>
          </div>
        )}
      </div>
      <div className="assistant-copy" data-reveal>
        <span className="section-kicker">
          <Icon name="sparkle" size={18} />
          Meet Xasri AI
        </span>
        <h2 id="assistant-heading">
          A little help.
          <br />
          Right beside
          <br /> your browsing.
        </h2>
        <p>
          Praxis is the browser. Xasri AI is the assistant you turn to along the
          way, for understanding context and moving through supported tasks.
        </p>
        <div className="assistant-action-label">
          <span>In Praxis, look for</span>
          <strong>
            Ask Xasri
            <Icon name="arrowUpRight" size={16} />
          </strong>
        </div>
        <Link href="/xasri-ai" className="text-link">
          Get to know your assistant
          <Icon name="arrowRight" size={18} />
        </Link>
      </div>
    </section>
  );
}

export function VerifiedFeatureSections() {
  return featureOrder.map((id) => {
    const feature = features.find((item) => item.id === id);
    if (!feature) return null;
    const shots = feature.screenshotIds
      .map((shotId) => screenshot(shotId))
      .filter((shot): shot is ProductScreenshot => Boolean(shot));
    if (!shots.length) return null;
    const video = videos.find((item) => item.id === feature.videoId);
    const light = shots.find((shot) => shot.theme === "light");
    const dark = shots.find((shot) => shot.theme === "dark");
    return (
      <section
        key={id}
        id={id}
        className={`section verified-feature ${id === "developer-tools" ? "dark-section" : ""}`}
        aria-labelledby={`${id}-heading`}
      >
        <div className="container">
          <div className="section-heading" data-reveal>
            <h2 id={`${id}-heading`}>{feature.title}</h2>
            <p>{feature.description}</p>
          </div>
          <div className="verified-feature-layout" data-reveal>
            <div>
              {id === "personalisation" && light && dark ? (
                <ThemeGallery
                  light={publicShot(light)}
                  dark={publicShot(dark)}
                />
              ) : video ? (
                <FeatureVideo video={publicVideo(video)} />
              ) : (
                <ProductMedia shot={publicShot(shots[0])} />
              )}
            </div>
            <div className="verified-feature-details">
              <ul>
                {feature.items.map((item) => (
                  <li key={item}>
                    <Icon name="check" size={18} />
                    {item}
                  </li>
                ))}
              </ul>
              {feature.limitations.map((limit) => (
                <p className="feature-limitation" key={limit}>
                  {limit}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  });
}

export function ControlSection() {
  return (
    <section
      className="control-section container"
      id="control"
      aria-labelledby="control-heading"
    >
      <div className="control-heading" data-reveal>
        <span className="control-icon">
          <Icon name="shield" size={28} />
        </span>
        <h2 id="control-heading">
          Useful intelligence.
          <br />
          Clear expectations.
        </h2>
        <p>
          A more capable browser should be easy to understand. Get to know the
          context, supported actions, and limits of the version you use.
        </p>
        <Link href="/support#privacy" className="text-link">
          Context and privacy questions
          <Icon name="arrowRight" size={18} />
        </Link>
      </div>
      <div className="control-points" data-reveal>
        <div>
          <span>01</span>
          <h3>Know the context.</h3>
          <p>
            Check which information is included before bringing a page into an
            AI request.
          </p>
        </div>
        <div>
          <span>02</span>
          <h3>Understand the action.</h3>
          <p>
            Review what a supported task involves and any confirmation it
            requires.
          </p>
        </div>
        <div>
          <span>03</span>
          <h3>Check the details.</h3>
          <p>
            Read the release information and privacy notice for your installed
            browser.
          </p>
        </div>
      </div>
    </section>
  );
}

export function HomeFaq() {
  const homeFaqs = faqs.filter((item) =>
    ["what-is-praxis", "agentic-browser", "xasri-ai", "downloads"].includes(
      item.id,
    ),
  );
  return (
    <section
      className="section container home-faq"
      aria-labelledby="faq-heading"
    >
      <div data-reveal>
        <h2 id="faq-heading">
          A few good
          <br /> questions.
        </h2>
        <p>
          Get to know Praxis
          <br /> and the idea behind it.
        </p>
        <Link className="text-link" href="/support">
          All questions
          <Icon name="arrowRight" size={18} />
        </Link>
      </div>
      <div data-reveal>
        <FaqList items={homeFaqs} />
      </div>
    </section>
  );
}

export function DownloadSection() {
  return (
    <section className="download-section" aria-labelledby="download-heading">
      <div className="container download-section-inner" data-reveal>
        <div className="download-symbol">
          <BrandSymbol />
        </div>
        <h2 id="download-heading">
          Make room for a<br />
          more capable browser.
        </h2>
        <p>Your next question. Your next idea. Your next step.</p>
        <div className="hero-actions">
          <Link href="/download" className="btn btn-primary">
            Download Praxis
            <Icon name="download" size={19} />
          </Link>
          <OverviewTrigger />
        </div>
        <p className="download-note">
          {releases.length
            ? `${Array.from(new Set(releases.map((release) => release.platformLabel))).join(" · ")}. See download details for versions and requirements.`
            : "Explore release availability and installation information."}
        </p>
      </div>
    </section>
  );
}

export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description: string;
}) {
  return (
    <div className="page-heading container">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
