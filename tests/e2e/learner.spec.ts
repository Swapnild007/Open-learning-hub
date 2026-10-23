import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { courses } from "../../src/content/catalog";
const open = async (page: any, path: string) => {
  await page.goto(`/#/${path}`);
  await expect(page.locator("main")).toBeVisible();
};
test("catalog discovery, search and course path work", async ({ page }) => {
  await open(page, "catalog");
  await expect(page.locator(".course-card")).toHaveCount(36);
  await page.getByLabel("Search courses").fill("Python");
  await expect(page.locator(".course-card")).toHaveCount(2);
  await page.getByLabel("Search courses").fill("");
  await page.getByLabel("Filter by track").selectOption("Workforce Management");
  await expect(page.locator(".course-card")).toHaveCount(6);
  await page
    .getByRole("heading", { name: "WFM Foundations", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your course path" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Start learning", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "Define the reporting contract",
      exact: true,
    }),
  ).toBeVisible();
});
test("assessments, assignments, capstone, bookmarks and refresh persistence", async ({
  page,
}) => {
  for (const l of courses[0].lessons) {
    await open(page, `lesson/${l.id}`);
    const done = page.getByRole("button", {
      name: "Complete lesson",
      exact: true,
    });
    await expect(done).toBeDisabled();
    await page
      .getByRole("radio", {
        name: new RegExp(l.distractor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      })
      .check();
    await page
      .getByRole("button", { name: "Check answer", exact: true })
      .click();
    await expect(done).toBeDisabled();
    await page
      .getByRole("radio", {
        name: l.answer,
        exact: true,
      })
      .check();
    await page
      .getByRole("button", { name: "Check answer", exact: true })
      .click();
    await page
      .getByRole("checkbox", {
        name: "I completed the assignment and checked my result.",
      })
      .check();
    await expect(done).toBeEnabled();
    await done.click();
    await expect(
      page.getByRole("button", { name: "Lesson complete", exact: true }),
    ).toBeDisabled();
  }
  await page
    .getByRole("button", { name: "Bookmark lesson", exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Remove bookmark", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await open(page, "project/wfm");
  for (const c of await page.locator("input[type=checkbox]").all())
    await c.check();
  await page
    .getByRole("button", { name: "Record capstone self-review", exact: true })
    .click();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Self-review recorded" }),
  ).toBeDisabled();
  await open(page, "progress");
  await expect(page.getByText("course pilots completed")).toBeVisible();
  await expect(
    page.locator(".stat").filter({ hasText: "course pilots completed" }),
  ).toContainText("1");
});
test("progress export/import restores state; invalid import preserves it", async ({
  page,
}) => {
  await open(page, "lesson/sql-1");
  await page
    .getByRole("button", { name: "Bookmark lesson", exact: true })
    .click();
  await open(page, "settings");
  const promise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export progress", exact: true })
    .click();
  const d = await promise;
  const path = await d.path();
  expect(path).toBeTruthy();
  await page
    .getByRole("button", { name: "Reset progress…", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirm reset", exact: true })
    .click();
  await page
    .getByLabel("Import progress", { exact: true })
    .setInputFiles(path!);
  await expect(page.getByText("Progress imported successfully.")).toBeVisible();
  await page.getByLabel("Import progress", { exact: true }).setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"version":999}'),
  });
  await expect(page.getByRole("status")).toContainText("Import rejected");
  await open(page, "bookmarks");
  await expect(
    page.getByRole("heading", { name: "Select and filter rows", exact: true }),
  ).toBeVisible();
});
test("practice engine executes SQLite and validates safe fallbacks", async ({
  page,
}) => {
  await open(page, "practice");
  await page.getByRole("button", { name: "Run query", exact: true }).click();
  await expect(
    page.getByRole("cell", { name: "CountyCare", exact: true }),
  ).toBeVisible();
  await page
    .getByLabel("SQL editor")
    .fill("SELECT SUM(handled) AS total FROM contacts;");
  await page.getByRole("button", { name: "Run query", exact: true }).click();
  await expect(
    page.getByRole("cell", { name: "390", exact: true }),
  ).toBeVisible();
  await page.getByLabel("SQL editor").fill("DROP TABLE contacts;");
  await page.getByRole("button", { name: "Run query", exact: true }).click();
  await expect(
    page.getByText("Use one read-only SELECT query, up to 1500 characters."),
  ).toBeVisible();
  await page
    .getByLabel("Python editor")
    .fill("def workload(contacts, aht):\n    return contacts * aht / 3600");
  await page
    .getByRole("button", { name: "Validate solution", exact: true })
    .click();
  await expect(
    page.getByText("Correct. 120 × 300 / 3600 = 10 workload hours."),
  ).toBeVisible();
  await page.getByLabel("Shrinkage (%)", { exact: true }).fill("100");
  await expect(page.locator("output")).toContainText("shrinkage below 100%");
});
test("global search indexes explanations and handles empty results", async ({
  page,
}) => {
  await open(page, "search");
  await page.getByLabel("Search all lessons").fill("shrinkage");
  await expect(
    page.getByRole("heading", { name: "Apply shrinkage once", exact: true }),
  ).toBeVisible();
  await page.getByLabel("Search all lessons").fill("zzzzunfindable");
  await expect(page.getByRole("status")).toContainText("0 matching lessons");
});
test("all course and lesson routes resolve without horizontal overflow or console errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const c of courses) {
    await open(page, `course/${c.id}`);
    await expect(
      page.getByRole("heading", {
        name: c.id === "python" ? "Learn Python by running it." : c.title,
        exact: true,
      }),
    ).toBeVisible();
    for (const l of c.lessons) {
      await page.goto(`/#/lesson/${l.id}`);
      await expect(
        page.getByRole("heading", { name: l.title, exact: true }),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});
test("primary pages have no serious accessibility violations in both themes", async ({
  page,
}) => {
  // Twenty-four full-page axe scans need more than the default per-test budget on shared runners.
  test.setTimeout(120000);
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
    await open(page, route);
    for (const theme of ["light", "dark"]) {
      await page.evaluate(
        (t) => (document.documentElement.dataset.theme = t),
        theme,
      );
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        result.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
        `${route} ${theme}`,
      ).toEqual([]);
    }
  }
});
test("mobile menu and keyboard navigation work", async ({ page, isMobile }) => {
  await open(page, "home");
  if (isMobile) {
    await page
      .getByRole("button", { name: "Open navigation", exact: true })
      .click();
    await expect(
      page.getByRole("navigation", { name: "Main navigation" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Catalog 36", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Course catalog", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Open navigation", exact: true }),
    ).toHaveAttribute("aria-expanded", "false");
  }
  await page
    .getByRole("link", { name: "Skip to content", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toHaveCount(1);
});
test("cached lessons, SQL and progress survive offline reload", async ({
  page,
  context,
}) => {
  await open(page, "lesson/wfm-1");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await page
    .getByRole("button", { name: "Bookmark lesson", exact: true })
    .click();
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole("heading", {
      name: "Define the reporting contract",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Remove bookmark", exact: true }),
  ).toBeVisible();
  await page.goto("/#/practice");
  await page.getByRole("button", { name: "Run query", exact: true }).click();
  await expect(
    page.getByRole("cell", { name: "CountyCare", exact: true }),
  ).toBeVisible();
  await context.setOffline(false);
});
test("all 36 pilots permit assessed lesson completion and capstone self-review", async ({
  page,
}) => {
  test.setTimeout(120000);
  for (const c of courses) {
    for (const l of c.lessons) {
      await open(page, `lesson/${l.id}`);
      await page
        .getByRole("radio", {
          name: l.answer,
          exact: true,
        })
        .check();
      await page
        .getByRole("button", { name: "Check answer", exact: true })
        .click();
      await page
        .getByRole("checkbox", {
          name: "I completed the assignment and checked my result.",
        })
        .check();
      await page
        .getByRole("button", { name: "Complete lesson", exact: true })
        .click();
      await expect(
        page.getByRole("button", { name: "Lesson complete", exact: true }),
      ).toBeDisabled();
    }
    await open(page, `project/${c.id}`);
    for (const box of await page.getByRole("checkbox").all()) await box.check();
    await page
      .getByRole("button", { name: "Record capstone self-review", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Self-review recorded", exact: true }),
    ).toBeDisabled();
  }
  await open(page, "progress");
  await expect(
    page.locator(".stat").filter({ hasText: "course pilots completed" }),
  ).toContainText("36");
  await page.reload();
  await expect(
    page.locator(".stat").filter({ hasText: "lessons completed" }),
  ).toContainText("108");
});
test("interactive guide, flashcard, diagram and ordering controls are usable", async ({
  page,
}) => {
  await open(page, "lesson/wfm-1");
  await page.getByRole("button", { name: /ACTIVE RECALL/ }).click();
  await expect(
    page.getByRole("button", { name: /ACTIVE RECALL/ }),
  ).toHaveAttribute("aria-expanded", "true");
  await open(page, "practice");
  await page.getByRole("button", { name: "Next step", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "2 · Calculate effort", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "SQL worker", exact: true }).click();
  await expect(page.locator(".architecture-detail")).toContainText("timeout");
  await page
    .getByRole("button", { name: "Move Validate source data up", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Move Calculate workload up", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Move Calculate workload up", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Check sequence", exact: true })
    .click();
  await expect(
    page.getByText(
      "Correct. Validate inputs before calculation, plan coverage, then compare actual outcomes.",
    ),
  ).toBeVisible();
});
test("malformed local state is preserved and import cannot render hostile markup", async ({
  page,
}) => {
  await open(page, "settings");
  await page.evaluate(() =>
    localStorage.setItem("olh.progress.v2", "{bad json"),
  );
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("could not be loaded");
  await open(page, "lesson/wfm-1");
  await page
    .getByRole("button", { name: "Bookmark lesson", exact: true })
    .click();
  expect(
    await page.evaluate(() => localStorage.getItem("olh.progress.v2")),
  ).toBe("{bad json");
  await open(page, "settings");
  await page.getByLabel("Import progress", { exact: true }).setInputFiles({
    name: "hostile.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        version: 2,
        completed: [],
        assessments: [],
        capstones: [],
        bookmarks: ["<img src=x onerror=alert(1)>"],
        activity: [],
        lastLesson: null,
        theme: "light",
        fontSize: 18,
      }),
    ),
  });
  await expect(page.getByRole("status")).toContainText("Import rejected");
  await expect(page.locator("img[src=x]")).toHaveCount(0);
});
test("settings controls and generated legacy readers preserve usable state", async ({
  page,
  context,
}) => {
  await open(page, "settings");
  await page
    .getByRole("combobox", { name: "Theme", exact: true })
    .selectOption("dark");
  await page
    .getByRole("combobox", { name: "Reading size", exact: true })
    .selectOption("22");
  await page.reload();
  await expect(
    page.getByRole("combobox", { name: "Theme", exact: true }),
  ).toHaveValue("dark");
  await expect(
    page.getByRole("combobox", { name: "Reading size", exact: true }),
  ).toHaveValue("22");
  await page.goto("/#/lesson/wfm-1");
  await expect(page.locator("article.reader")).toHaveCSS("font-size", "22px");
  await page
    .getByRole("button", { name: "Decrease reading size", exact: true })
    .click();
  await expect(page.locator("article.reader")).toHaveCSS("font-size", "21px");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await page.goto("/python-curriculum.html");
  await expect(
    page.getByText("17 guided lessons", { exact: true }),
  ).toBeVisible();
  await expect(page.locator("pre.code")).toContainText(
    'print("Hello, Python!")',
  );
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole("heading", {
      name: "Python and your first program",
      exact: true,
    }),
  ).toBeVisible();
  await context.setOffline(false);
});
