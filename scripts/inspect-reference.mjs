import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const proxyUrl = new URL(process.env.HTTPS_PROXY || process.env.https_proxy);
const browser = await chromium.launch({
  headless: true,
  proxy: {
    server: proxyUrl.origin,
    username: decodeURIComponent(proxyUrl.username),
    password: decodeURIComponent(proxyUrl.password),
  },
  args: ["--remote-debugging-port=9222"],
});
const observations = [];
for (const width of [390, 1440]) {
  const page = await browser.newPage({
    viewport: { width, height: 900 },
    ignoreHTTPSErrors: true,
  });
  try {
    await page.goto("https://www.allcsnotes.com/courses/playwright", {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
    await page.screenshot({
      path: `/tmp/reference-${width}.png`,
      fullPage: false,
    });
    if (width === 1440) {
      const { execFile } = await import("node:child_process");
      const { promisify } = await import("node:util");
      const targets = await (
        await fetch("http://127.0.0.1:9222/json/list")
      ).json();
      const target = targets.find((t) => t.url === page.url());
      if (target) {
        try {
          const { stdout } = await promisify(execFile)(
            "npx",
            [
              "--yes",
              "rea-agents",
              "capture-web-screenshot",
              "http://127.0.0.1:9222",
              target.id,
              "--allowed-origins",
              '["https://www.allcsnotes.com"]',
              "--format",
              "json",
            ],
            { maxBuffer: 5000000, timeout: 45000 },
          );
          await fs.writeFile("/tmp/rea-reference-evidence.json", stdout);
          observations.push({
            rea: "Screenshot capture command completed; raw evidence retained separately.",
          });
        } catch (e) {
          observations.push({ reaError: String(e).slice(0, 500) });
        }
      }
    }
    observations.push({
      width,
      url: page.url(),
      title: await page.title(),
      headings: await page.locator("h1,h2,h3").allTextContents(),
      buttons: (await page.getByRole("button").allTextContents()).slice(0, 25),
      links: (await page.getByRole("link").allTextContents()).slice(0, 25),
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    });
  } catch (e) {
    observations.push({ width, error: String(e) });
  }
  await page.close();
}
await fs.writeFile(
  "docs/reference-observations.json",
  JSON.stringify(observations, null, 2),
);
await browser.close();
