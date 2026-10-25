"use client";

import { Icon } from "./icon";

export function ThemeSwitch() {
  function toggleTheme() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("praxis-website-theme", next);
    } catch {
      /* Theme remains usable when storage is unavailable. */
    }
    window.dispatchEvent(new Event("praxis-theme-change"));
  }

  return (
    <button
      type="button"
      className="theme-switch"
      onClick={toggleTheme}
      aria-label="Website theme: switch between light and dark"
      title="Switch website theme"
    >
      <span className="theme-light-icon">
        <Icon name="sun" size={18} />
      </span>
      <span className="theme-dark-icon">
        <Icon name="moon" size={18} />
      </span>
      <span>Website theme</span>
    </button>
  );
}
