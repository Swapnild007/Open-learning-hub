import { chromium } from "@playwright/test";
import { pythonLessons } from "../src/python/lessons.ts";
import fs from "node:fs";
const base = process.env.PREVIEW_URL || "http://127.0.0.1:4173";
for (let attempt = 0; attempt < 100; attempt++) {
  try {
    if ((await fetch(base)).ok) break;
  } catch {
    /* Server starting. */
  }
  await new Promise((resolve) => setTimeout(resolve, 100));
}
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH, args: ["--no-sandbox"] }
    : {},
);
fs.mkdirSync("docs/python/screenshots", { recursive: true });
try {
  for (const [name, viewport, theme] of [
    ["desktop", { width: 1536, height: 1100 }, "light"],
    ["android", { width: 393, height: 851 }, "light"],
    ["desktop-dark", { width: 1536, height: 1100 }, "dark"],
  ]) {
    const page = await browser.newPage({ viewport });
    if (theme === "dark") {
      await page.goto(`${base}/#/settings`);
      await page
        .getByRole("combobox", { name: "Theme", exact: true })
        .selectOption(theme);
    }
    await page.goto(`${base}/#/python/variables`);
    await page.locator(".python-academy").waitFor();
    if (name === "android")
      await page
        .getByRole("group", { name: "Lesson workspace" })
        .getByRole("button", { name: "Code", exact: true })
        .click();
    const editor = page.locator(".python-lab .cm-content");
    await editor.click();
    await editor.press("ControlOrMeta+a");
    await page.keyboard.insertText(pythonLessons[0].exercises[0].solution);
    await page
      .getByRole("button", { name: "Check exercise", exact: true })
      .click();
    await page
      .getByText("✓ Behavior checks passed.", { exact: true })
      .waitFor({ timeout: 60000 });
    const selector =
      name === "android" ? ".python-mobile-tabs" : ".python-workspace";
    const offset = name === "android" ? 72 : 100;
    await page.evaluate(
      ([s, y]) =>
        globalThis.scrollTo(
          0,
          globalThis.document.querySelector(s).getBoundingClientRect().top +
            globalThis.scrollY -
            y,
        ),
      [selector, offset],
    );
    await page.screenshot({
      path: `docs/python/screenshots/${name}-python-studio.png`,
    });
    if (name === "android") {
      await page
        .getByLabel("Python stdout", { exact: true })
        .scrollIntoViewIfNeeded();
      await page.screenshot({
        path: "docs/python/screenshots/android-python-output.png",
      });
      await page.locator(".python-lab").screenshot({
        path: "docs/python/screenshots/android-python-lab-full.png",
      });
      await editor.click();
      await editor.press("ControlOrMeta+a");
      await page.keyboard.insertText('if True\n    print("missing colon")');
      await page.getByRole("button", { name: "Run code", exact: true }).click();
      await page
        .getByLabel("Python stderr", { exact: true })
        .filter({ hasText: "SyntaxError" })
        .waitFor({ timeout: 60000 });
      await page
        .getByLabel("Python stderr", { exact: true })
        .scrollIntoViewIfNeeded();
      await page.screenshot({
        path: "docs/python/screenshots/android-python-syntax-error.png",
      });
      await page
        .getByRole("group", { name: "Lesson workspace" })
        .getByRole("button", { name: "Notes", exact: true })
        .click();
      await page
        .getByLabel("Personal notes", { exact: true })
        .fill(
          "My first program: names bind to values.\n84 contacts × 5 minutes ÷ 60 = 7 hours.",
        );
      await page.reload();
      await page.locator(".python-academy").waitFor();
      await page
        .getByRole("group", { name: "Lesson workspace" })
        .getByRole("button", { name: "Notes", exact: true })
        .click();
      await page.locator(".python-notes").scrollIntoViewIfNeeded();
      await page.screenshot({
        path: "docs/python/screenshots/android-python-notes-reloaded.png",
      });
    }
    await page.close();
  }
} finally {
  await browser.close();
}
