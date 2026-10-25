import { existsSync } from "node:fs";
import { homedir, release } from "node:os";
import { join } from "node:path";

// Android's Linux compatibility environment cannot run the bundled Chromium
// 156 renderer. Its existing full Chromium 153 build works with the same CDP.
// Normal Linux/macOS/Windows installs use Playwright's bundled browser.
const compatibleAndroidBrowser = join(
  homedir(),
  ".cache/ms-playwright/chromium-1243/chrome-linux-arm64/chrome",
);
export const browserExecutablePath =
  process.env.CHROMIUM_PATH ||
  (release().includes("android") && existsSync(compatibleAndroidBrowser)
    ? compatibleAndroidBrowser
    : undefined);
export const browserArgs = ["--no-sandbox", "--disable-dev-shm-usage"];
