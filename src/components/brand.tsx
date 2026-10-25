import Image from "next/image";
import Link from "next/link";

export function Wordmark({
  className = "",
  linked = true,
  priority = false,
}: {
  className?: string;
  linked?: boolean;
  priority?: boolean;
}) {
  const mark = (
    <span className={`wordmark ${className}`}>
      <Image
        className="brand-ink"
        src="/brand/praxis-wordmark-dark.webp"
        width={820}
        height={113}
        alt="PRAXIS"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        unoptimized
      />
      <Image
        className="brand-paper"
        src="/brand/praxis-wordmark-light.webp"
        width={820}
        height={113}
        alt=""
        aria-hidden="true"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        unoptimized
      />
    </span>
  );
  return linked ? (
    <Link
      href="/"
      prefetch={false}
      className="brand-link"
      aria-label="Praxis home"
    >
      {mark}
    </Link>
  ) : (
    mark
  );
}

export function BrandSymbol({
  light = false,
  className = "",
  priority = false,
}: {
  light?: boolean;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={`/brand/praxis-symbol-${light ? "light" : "dark"}.webp`}
      alt=""
      aria-hidden="true"
      width={625}
      height={650}
      className={className}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      unoptimized
    />
  );
}

export function BrandScene({ compact = false }: { compact?: boolean }) {
  return (
    <figure className={`brand-scene ${compact ? "brand-scene-compact" : ""}`}>
      <div
        className="brand-scene-art"
        role="img"
        aria-label="Praxis brand illustration: the supplied Praxis symbol surrounded by flowing violet ribbons. This is not a product screenshot."
      >
        <div className="ribbon ribbon-one" />
        <div className="ribbon ribbon-two" />
        <div className="ribbon ribbon-three" />
        <div className="scene-floor" />
        <div className="scene-logo">
          <BrandSymbol light priority={!compact} />
          <Image
            className="scene-wordmark"
            src="/brand/praxis-wordmark-light.webp"
            alt=""
            aria-hidden="true"
            width={820}
            height={113}
            unoptimized
          />
        </div>
        <span className="scene-attribution">From Xasri</span>
      </div>
      <figcaption>Praxis brand illustration</figcaption>
    </figure>
  );
}
