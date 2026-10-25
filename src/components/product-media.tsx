"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProductScreenshot, ProductVideo } from "@/lib/product";
import { Icon } from "./icon";
import { keepDialogFocus } from "@/lib/dialog-focus";

export type PublicScreenshot = Omit<
  ProductScreenshot,
  "evidence" | "capturedAt"
>;
type PublicVideo = Omit<ProductVideo, "evidence">;

export function ProductMedia({
  shot,
  mobileShot,
  priority = false,
}: {
  shot: PublicScreenshot;
  mobileShot?: PublicScreenshot;
  priority?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef("");
  const [zoom, setZoom] = useState(false);
  const [error, setError] = useState(false);
  const [viewShot, setViewShot] = useState(shot);

  useEffect(() => {
    const node = dialog.current;
    return () => {
      if (node?.open) document.body.style.overflow = previousOverflow.current;
    };
  }, []);

  function openImage() {
    if (dialog.current?.open) return;
    setViewShot(
      mobileShot && window.matchMedia("(max-width: 639px)").matches
        ? mobileShot
        : shot,
    );
    setZoom(false);
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.showModal();
  }

  return (
    <figure className="product-media">
      {error ? (
        <p className="media-error" role="status">
          This product image is temporarily unavailable.
        </p>
      ) : (
        <div
          className={`product-image-wrap ${mobileShot ? "has-mobile-capture" : ""}`}
        >
          <Image
            className="desktop-capture"
            src={shot.src}
            width={shot.width}
            height={shot.height}
            alt={shot.alt}
            fetchPriority={priority ? "high" : "auto"}
            sizes="(max-width: 768px) 100vw, 1200px"
            onError={() => setError(true)}
          />
          {mobileShot && (
            <Image
              className="mobile-capture"
              src={mobileShot.src}
              width={mobileShot.width}
              height={mobileShot.height}
              alt={mobileShot.alt}
              sizes="(max-width: 640px) 100vw, 1px"
              onError={() => setError(true)}
            />
          )}
        </div>
      )}
      <figcaption>
        <span>{shot.caption}</span>
        {!error && (
          <button
            ref={opener}
            type="button"
            className="media-expand"
            onClick={openImage}
          >
            <Icon name="expand" size={17} />
            <span>View fullscreen</span>
          </button>
        )}
      </figcaption>
      <dialog
        ref={dialog}
        className={`image-modal ${zoom ? "is-zoomed" : ""}`}
        aria-label={viewShot.caption}
        onClose={() => {
          document.body.style.overflow = previousOverflow.current;
          opener.current?.focus();
        }}
        onKeyDown={keepDialogFocus}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="image-modal-bar">
          <p>{viewShot.caption}</p>
          <div>
            <button
              type="button"
              className="text-link"
              aria-pressed={zoom}
              onClick={() => setZoom(!zoom)}
            >
              {zoom ? "Fit to screen" : "Original size"}
              <Icon name="expand" size={18} />
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => dialog.current?.close()}
              aria-label="Close fullscreen image"
            >
              <Icon name="close" size={24} />
            </button>
          </div>
        </div>
        <div className="image-modal-scroll">
          <Image
            src={viewShot.src}
            width={viewShot.width}
            height={viewShot.height}
            alt={viewShot.alt}
            unoptimized
          />
        </div>
      </dialog>
    </figure>
  );
}

export function FeatureVideo({ video }: { video: PublicVideo }) {
  const [failed, setFailed] = useState(false);
  return (
    <figure className="feature-video">
      {failed ? (
        <p role="alert" className="media-error">
          This recording could not be loaded. Its transcript is available below.
        </p>
      ) : (
        <video
          controls
          playsInline
          preload="none"
          poster={video.poster}
          width={video.width}
          height={video.height}
          aria-label={video.title}
          onError={() => setFailed(true)}
        >
          <source src={video.src} type={video.type} />
          <track
            kind="captions"
            src={video.captions}
            srcLang="en"
            label="English"
            default
          />
        </video>
      )}
      <figcaption>
        {video.title}
        {video.editedForLength ? ". Edited for length." : ""}
      </figcaption>
      <details className="transcript">
        <summary>
          Read transcript
          <Icon name="plus" size={18} />
        </summary>
        <p>{video.transcript}</p>
      </details>
    </figure>
  );
}

export function ProductLoop({ video }: { video: PublicVideo }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (
      navigator as Navigator & {
        connection?: {
          saveData?: boolean;
          addEventListener?: (type: string, callback: () => void) => void;
          removeEventListener?: (type: string, callback: () => void) => void;
        };
      }
    ).connection;
    let inView = false;
    const syncPlayback = () => {
      if (
        preference.matches ||
        connection?.saveData ||
        document.hidden ||
        !inView
      )
        node.pause();
      else
        void node.play().catch(() => {
          /* Native controls remain available when autoplay is blocked. */
        });
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    preference.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);
    connection?.addEventListener?.("change", syncPlayback);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
      connection?.removeEventListener?.("change", syncPlayback);
      node.pause();
    };
  }, []);
  return (
    <figure className="product-loop">
      {failed ? (
        <Image
          src={video.poster}
          width={video.width}
          height={video.height}
          alt={video.title}
          preload
        />
      ) : (
        <video
          ref={ref}
          controls
          muted
          loop
          playsInline
          preload="none"
          width={video.width}
          height={video.height}
          poster={video.poster}
          aria-label={video.title}
          onError={() => setFailed(true)}
        >
          <source src={video.src} type={video.type} />
          <track
            kind="captions"
            src={video.captions}
            srcLang="en"
            label="English"
            default
          />
        </video>
      )}
      <figcaption>
        {video.title}
        {video.editedForLength ? ". Edited for length." : ""}
      </figcaption>
    </figure>
  );
}

export function ThemeGallery({
  light,
  dark,
}: {
  light: PublicScreenshot;
  dark: PublicScreenshot;
}) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return (
    <div className="theme-gallery">
      <div
        className="segmented-control"
        role="group"
        aria-label="Product screenshot theme"
      >
        <button
          type="button"
          aria-pressed={theme === "light"}
          onClick={() => setTheme("light")}
        >
          <Icon name="sun" size={17} />
          Light
        </button>
        <button
          type="button"
          aria-pressed={theme === "dark"}
          onClick={() => setTheme("dark")}
        >
          <Icon name="moon" size={17} />
          Dark
        </button>
      </div>
      <div className="gallery-capture" key={theme}>
        <ProductMedia shot={theme === "light" ? light : dark} />
      </div>
    </div>
  );
}
