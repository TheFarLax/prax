"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Icon } from "./icon";
import { Wordmark } from "./brand";
import { OverviewTrigger } from "./overview";
import { keepDialogFocus } from "@/lib/dialog-focus";

const links = [
  { label: "Browser", href: "/#browser" },
  { label: "Xasri AI", href: "/xasri-ai" },
  { label: "Features", href: "/features" },
];

export function Header() {
  const pathname = usePathname();
  const header = useRef<HTMLElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const mobileMenu = useRef<HTMLDialogElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const previousOverflow = useRef("");

  useEffect(() => {
    if (!sentinel.current) return;
    const menuNode = mobileMenu.current;
    const observer = new IntersectionObserver(([entry]) => {
      header.current?.classList.toggle("is-scrolled", !entry.isIntersecting);
    });
    observer.observe(sentinel.current);
    const desktop = window.matchMedia("(min-width: 900px)");
    const closeOnDesktop = () => {
      if (desktop.matches) mobileMenu.current?.close();
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      observer.disconnect();
      desktop.removeEventListener("change", closeOnDesktop);
      if (menuNode?.open)
        document.body.style.overflow = previousOverflow.current;
    };
  }, []);

  function closeMenu() {
    mobileMenu.current?.close();
  }
  function openMenu() {
    if (mobileMenu.current?.open) return;
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobileMenu.current?.showModal();
    menuTrigger.current?.setAttribute("aria-expanded", "true");
  }
  function onMenuClose() {
    document.body.style.overflow = previousOverflow.current;
    menuTrigger.current?.setAttribute("aria-expanded", "false");
    menuTrigger.current?.focus();
  }

  return (
    <>
      <div className="nav-sentinel" ref={sentinel} aria-hidden="true" />
      <header className="site-header" ref={header}>
        <div className="nav-inner container">
          <Wordmark priority />
          <nav className="desktop-nav" aria-label="Main navigation">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <OverviewTrigger className="nav-demo" compact />
            <Link
              href="/download"
              prefetch={false}
              className="btn btn-small btn-primary nav-download"
            >
              Download <Icon name="arrowDown" size={16} />
            </Link>
            <button
              ref={menuTrigger}
              onClick={openMenu}
              type="button"
              className="icon-button menu-toggle"
              aria-label="Open navigation"
              aria-expanded="false"
              aria-controls="mobile-navigation"
            >
              <Icon name="menu" size={24} />
            </button>
          </div>
        </div>
      </header>
      <dialog
        ref={mobileMenu}
        id="mobile-navigation"
        className="mobile-menu"
        aria-labelledby="mobile-menu-title"
        onClose={onMenuClose}
        onKeyDown={keepDialogFocus}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <div className="mobile-menu-content">
          <div className="mobile-menu-top">
            <span id="mobile-menu-title">Explore Praxis</span>
            <button
              type="button"
              className="icon-button"
              onClick={closeMenu}
              aria-label="Close navigation"
            >
              <Icon name="close" size={26} />
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={closeMenu}>
                {link.label}
                <Icon name="arrowUpRight" size={25} />
              </Link>
            ))}
            <Link href="/support" onClick={closeMenu}>
              Support & FAQ
              <Icon name="arrowUpRight" size={25} />
            </Link>
          </nav>
          <Link
            className="btn btn-primary"
            href="/download"
            onClick={closeMenu}
          >
            Download Praxis
            <Icon name="download" />
          </Link>
          <p className="mobile-menu-note">
            A more capable browser. From Xasri.
          </p>
        </div>
      </dialog>
    </>
  );
}
