"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Release } from "@/lib/product";
import { BrandSymbol } from "./brand";
import { Icon } from "./icon";

export type PublicRelease = Omit<Release, "evidence">;

export function DownloadPanel({ releases }: { releases: PublicRelease[] }) {
  const [selected, setSelected] = useState(releases[0]?.id ?? "");
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState("");
  const release = releases.find((item) => item.id === selected) ?? releases[0];

  useEffect(() => {
    const agent = navigator.userAgent.toLowerCase();
    const platform = /android/.test(agent)
      ? "android"
      : /iphone|ipad/.test(agent)
        ? "ios"
        : /win/.test(agent)
          ? "windows"
          : /mac/.test(agent)
            ? "macos"
            : /linux/.test(agent)
              ? "linux"
              : null;
    const suggested = releases.find((item) => item.platform === platform);
    if (suggested) {
      // Suggest a platform without changing the selection or starting a download.
      const frame = requestAnimationFrame(() =>
        setSuggestion(suggested.platformLabel),
      );
      return () => cancelAnimationFrame(frame);
    }
  }, [releases]);

  async function copyChecksum() {
    if (!release?.sha256) return;
    try {
      await navigator.clipboard.writeText(release.sha256);
      setCopyMessage("Checksum copied.");
    } catch {
      setCopyMessage(
        "Copy is unavailable. Select the checksum below to copy it manually.",
      );
    }
  }

  if (!release)
    return (
      <div className="download-unavailable" id="release-availability">
        <div className="availability-art" aria-hidden="true">
          <BrandSymbol />
          <div className="availability-orbit" />
        </div>
        <div className="availability-copy">
          <span className="status-label">
            <Icon name="info" size={17} />
            Release availability
          </span>
          <h2>A little more to come.</h2>
          <p>
            Praxis downloads are not available on this site yet. When a release
            is available, you’ll find its platforms, version, and installation
            details here.
          </p>
          <div className="availability-links">
            <Link className="text-link" href="/xasri-ai">
              Get to know Xasri AI
              <Icon name="arrowRight" size={18} />
            </Link>
            <Link href="/support#downloads" className="muted-link">
              Download questions
            </Link>
          </div>
        </div>
      </div>
    );

  return (
    <div className="release-panel" id="release-availability">
      <div className="release-heading">
        <BrandSymbol />
        <div>
          <h2>Praxis for {release.platformLabel}</h2>
          <p>
            Version {release.version} · {release.architecture}
          </p>
        </div>
      </div>
      <label htmlFor="release-platform">
        Choose your platform and architecture
      </label>
      <select
        id="release-platform"
        value={release.id}
        onChange={(event) => {
          setSelected(event.target.value);
          setCopyMessage("");
        }}
      >
        {releases.map((item) => (
          <option key={item.id} value={item.id}>
            {item.platformLabel} / {item.architecture} / {item.version}
          </option>
        ))}
      </select>
      {suggestion && (
        <p className="release-suggestion">
          Suggested for this device: {suggestion}. You can choose another
          available platform.
        </p>
      )}
      <dl className="release-details">
        <div>
          <dt>System requirements</dt>
          <dd>{release.requirements}</dd>
        </div>
        <div>
          <dt>File</dt>
          <dd>
            {release.fileName} ({release.fileSize})
          </dd>
        </div>
        <div>
          <dt>Published</dt>
          <dd>
            <time dateTime={release.publishedAt}>
              {new Intl.DateTimeFormat("en", {
                dateStyle: "long",
                timeZone: "UTC",
              }).format(new Date(release.publishedAt))}
            </time>
          </dd>
        </div>
      </dl>
      <a
        className="btn btn-primary"
        href={release.url}
        download={release.fileName}
        rel="noopener"
      >
        Download Praxis
        <Icon name="download" />
      </a>
      <div className="installation">
        <h3>Getting set up</h3>
        <ol>
          {release.installation.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
      {release.sha256 && (
        <details className="checksum">
          <summary>
            Verify this download
            <Icon name="chevron" size={18} />
          </summary>
          <p>SHA-256</p>
          <code>{release.sha256}</code>
          <button type="button" className="text-link" onClick={copyChecksum}>
            Copy checksum
            <Icon name="copy" size={17} />
          </button>
          <p role="status">{copyMessage}</p>
        </details>
      )}
    </div>
  );
}
