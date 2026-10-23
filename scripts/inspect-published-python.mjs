import { chromium, devices } from "@playwright/test";
import fs from "node:fs";
import { createHash } from "node:crypto";
const url =
  "https://swapnild007.github.io/Open-learning-hub/python-curriculum.html";
const browser = await chromium.launch({
  proxy: { server: process.env.HTTPS_PROXY },
});
const page = await browser.newPage({
  ...devices["Pixel 7"],
  ignoreHTTPSErrors: true,
});
try {
  const response = await page.goto(url);
  const html = await response.text();
  const evidence = {
    url,
    checkedAt: new Date().toISOString(),
    status: response.status(),
    lastModified: response.headers()["last-modified"],
    sha256: createHash("sha256").update(html).digest("hex"),
    matchesRepositoryStaticFile:
      html === fs.readFileSync("python-curriculum.html", "utf8"),
    runButtons: await page.getByRole("button", { name: /run/i }).count(),
    editors: await page
      .locator('.cm-editor, textarea[aria-label="Python code editor"]')
      .count(),
    selfAttestedPractice: await page
      .getByRole("checkbox", { name: /attempted the practice/ })
      .count(),
    codeSample: await page.locator("pre.code").first().textContent(),
  };
  fs.writeFileSync(
    "docs/python/published-comparison.json",
    JSON.stringify(evidence, null, 2) + "\n",
  );
  await page.screenshot({
    path: "docs/python/screenshots/published-android-static.png",
  });
  console.log(evidence);
} finally {
  await browser.close();
}
