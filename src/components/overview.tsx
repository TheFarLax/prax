"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ProductVideo } from "@/lib/product";
import { BrandSymbol } from "./brand";
import { Icon, type IconName } from "./icon";
import { keepDialogFocus } from "@/lib/dialog-focus";

export type PublicVideo = Omit<ProductVideo, "evidence">;
const OverviewContext = createContext<{
  open: () => void;
  hasVideo: boolean;
} | null>(null);
const chapters: {
  title: string;
  heading: string;
  body: string;
  icon: IconName;
}[] = [
  {
    title: "Browse",
    heading: "It starts with your browser.",
    body: "Praxis is your place to explore the web. Xasri AI brings an assistant into that browsing experience.",
    icon: "browser",
  },
  {
    title: "Ask",
    heading: "Bring your next question.",
    body: "Xasri AI is designed to understand browsing context. Ask Xasri is how you bring a question or instruction to the assistant.",
    icon: "sparkle",
  },
  {
    title: "Act",
    heading: "Put an instruction in motion.",
    body: "Agentic browsing connects instructions to supported browser actions. Available steps and confirmations depend on the release and the request.",
    icon: "cursor",
  },
];

export function ExperienceProvider({
  children,
  tour,
}: {
  children: ReactNode;
  tour?: PublicVideo;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const previousOverflow = useRef("");
  const [chapter, setChapter] = useState(0);
  const [videoError, setVideoError] = useState(false);

  const open = useCallback(() => {
    if (dialog.current?.open) return;
    trigger.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setChapter(0);
    setVideoError(false);
    dialog.current?.showModal();
  }, []);

  function close() {
    dialog.current?.close();
  }
  function onClose() {
    video.current?.pause();
    document.body.style.overflow = previousOverflow.current;
    trigger.current?.focus();
  }

  useEffect(() => {
    const node = dialog.current;
    return () => {
      if (node?.open) document.body.style.overflow = previousOverflow.current;
    };
  }, []);

  function changeChapter(index: number) {
    setChapter(index);
    document.getElementById(`overview-tab-${index}`)?.focus();
  }

  return (
    <OverviewContext.Provider value={{ open, hasVideo: Boolean(tour) }}>
      {children}
      <dialog
        ref={dialog}
        className={`overview-modal ${tour ? "has-video" : ""}`}
        aria-labelledby="overview-title"
        onClose={onClose}
        onKeyDown={keepDialogFocus}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div className="overview-inner">
          <div className="modal-topline">
            <span>
              {tour ? "Praxis in action" : "An introduction to Praxis"}
            </span>
            <button
              type="button"
              className="icon-button"
              onClick={close}
              aria-label="Close introduction"
            >
              <Icon name="close" size={24} />
            </button>
          </div>
          {tour ? (
            <div className="tour-player">
              <h2 id="overview-title">{tour.title}</h2>
              {videoError ? (
                <p className="media-error" role="alert">
                  This video could not be loaded. You can read its transcript
                  below.
                </p>
              ) : (
                <video
                  ref={video}
                  controls
                  playsInline
                  preload="metadata"
                  poster={tour.poster}
                  width={tour.width}
                  height={tour.height}
                  aria-label={tour.title}
                  onError={() => setVideoError(true)}
                >
                  <source src={tour.src} type={tour.type} />
                  <track
                    kind="captions"
                    src={tour.captions}
                    srcLang="en"
                    label="English"
                    default
                  />
                </video>
              )}
              {tour.editedForLength && (
                <p className="media-caption">Edited for length.</p>
              )}
              <details className="transcript">
                <summary>
                  Read the transcript
                  <Icon name="plus" size={18} />
                </summary>
                <p>{tour.transcript}</p>
              </details>
            </div>
          ) : (
            <>
              <div className="overview-graphic" aria-hidden="true">
                <div className="overview-ring" />
                <BrandSymbol light />
                <span className="overview-symbol">
                  <Icon name={chapters[chapter].icon} size={28} />
                </span>
              </div>
              <div className="overview-copy">
                <div
                  className="overview-tabs"
                  role="tablist"
                  aria-label="Introduction chapters"
                >
                  {chapters.map((item, index) => (
                    <button
                      key={item.title}
                      type="button"
                      role="tab"
                      id={`overview-tab-${index}`}
                      aria-controls="overview-panel"
                      aria-selected={chapter === index}
                      tabIndex={chapter === index ? 0 : -1}
                      onClick={() => setChapter(index)}
                      onKeyDown={(event) => {
                        if (
                          ["ArrowRight", "ArrowLeft", "Home", "End"].includes(
                            event.key,
                          )
                        ) {
                          event.preventDefault();
                          changeChapter(
                            event.key === "Home"
                              ? 0
                              : event.key === "End"
                                ? chapters.length - 1
                                : (chapter +
                                    (event.key === "ArrowRight" ? 1 : -1) +
                                    chapters.length) %
                                  chapters.length,
                          );
                        }
                      }}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
                <div
                  role="tabpanel"
                  id="overview-panel"
                  aria-labelledby={`overview-tab-${chapter}`}
                  tabIndex={0}
                  className="overview-panel"
                  key={chapter}
                >
                  <h2 id="overview-title">{chapters[chapter].heading}</h2>
                  <p>{chapters[chapter].body}</p>
                </div>
                <div className="overview-bottom">
                  <p>
                    Interactive introduction.
                    <br />
                    Not a product recording.
                  </p>
                  <Link href="/xasri-ai" className="text-link" onClick={close}>
                    Explore Xasri AI
                    <Icon name="arrowRight" size={18} />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </dialog>
    </OverviewContext.Provider>
  );
}

export function OverviewTrigger({
  className = "btn btn-secondary",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const context = useContext(OverviewContext);
  if (!context) return null;
  return (
    <button type="button" className={className} onClick={context.open}>
      <Icon name={context.hasVideo ? "play" : "plus"} size={18} />
      <span>
        {context.hasVideo
          ? compact
            ? "Watch demo"
            : "Watch Praxis in action"
          : compact
            ? "Meet Praxis"
            : "Meet Praxis"}
      </span>
    </button>
  );
}
