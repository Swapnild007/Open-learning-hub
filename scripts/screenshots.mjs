import { chromium, devices } from "@playwright/test";
import { spawn } from "node:child_process";
const server = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "preview",
    "--host",
    "127.0.0.1",
    "--port",
    "4173",
  ],
  { stdio: "pipe" },
);
await new Promise((resolve, reject) => {
  server.stdout.on("data", (d) => {
    if (d.toString().includes("4173")) resolve();
  });
  server.on("exit", (c) => reject(Error(`Preview exited ${c}`)));
});
const browser = await chromium.launch();
try {
  for (const mode of ["desktop", "android"]) {
    const page = await browser.newPage(
      mode === "desktop"
        ? { viewport: { width: 1440, height: 1000 } }
        : { ...devices["Pixel 7"] },
    );
    for (const route of [
      "home",
      "catalog",
      "paths",
      "course/wfm",
      "lesson/wfm-1",
      "practice",
      "projects",
      "project/wfm",
      "progress",
      "bookmarks",
      "search",
      "settings",
    ]) {
      await page.goto(`http://127.0.0.1:4173/#/${route}`);
      await page.locator("h1").first().waitFor();
      await page.screenshot({
        path: `docs/screenshots/${mode}-${route.replaceAll("/", "-")}.png`,
        fullPage: !["catalog", "projects"].includes(route),
      });
    }
    await page.close();
  }
} finally {
  await browser.close();
  server.kill();
}
