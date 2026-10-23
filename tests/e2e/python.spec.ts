import { test, expect, type Page } from "@playwright/test";
import { pythonLessons } from "../../src/python/lessons";
async function setCode(page: Page, code: string) {
  await codeTab(page);
  const editor = page.locator(".python-lab .cm-content");
  await editor.click();
  await editor.press("ControlOrMeta+a");
  await editor.pressSequentially("", { delay: 0 });
  await page.keyboard.insertText(code);
}
async function codeTab(page: Page) {
  await expect(page.locator(".python-academy")).toBeVisible();
  const tabs = page.getByRole("group", { name: "Lesson workspace" });
  if (await tabs.isVisible())
    await tabs.getByRole("button", { name: "Code", exact: true }).click();
}
async function readTab(page: Page) {
  await expect(page.locator(".python-academy")).toBeVisible();
  const tabs = page.getByRole("group", { name: "Lesson workspace" });
  if (await tabs.isVisible())
    await tabs.getByRole("button", { name: "Read", exact: true }).click();
}
async function check(page: Page) {
  await page
    .getByRole("button", { name: "Check exercise", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Run code", exact: true }),
  ).toBeEnabled({ timeout: 60000 });
}
test("six representative Python journeys execute wrong code, correct solutions, recall gates and notes", async ({
  page,
}) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const lesson of pythonLessons) {
    await page.goto(`/#/python/${lesson.id}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      lesson.title,
    );
    await expect(
      page.getByRole("button", {
        name: "Complete Python chapter",
        exact: true,
      }),
    ).toBeDisabled();
    await codeTab(page);
    await check(page);
    await expect(page.locator(".python-lab")).not.toContainText(
      "✓ Behavior checks passed.",
    );
    for (let i = 0; i < lesson.exercises.length; i++) {
      await page.getByLabel("Choose a practice task").selectOption(String(i));
      await setCode(page, lesson.exercises[i].solution);
      await check(page);
      await expect(page.locator(".python-lab")).toContainText(
        "✓ Behavior checks passed.",
      );
    }
    await readTab(page);
    const q = lesson.recall[0];
    await page
      .getByRole("radio", {
        name: q.options[(q.correct + 1) % q.options.length],
        exact: true,
      })
      .check();
    await page.getByRole("button", { name: "Check recall answer" }).click();
    await expect(
      page.getByRole("button", {
        name: "Complete Python chapter",
        exact: true,
      }),
    ).toBeDisabled();
    await page
      .getByRole("radio", { name: q.options[q.correct], exact: true })
      .check();
    await page.getByRole("button", { name: "Check recall answer" }).click();
    await page
      .getByRole("button", { name: "Complete Python chapter", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Chapter completed" }),
    ).toBeDisabled();
  }
  const tabs = page.getByRole("group", { name: "Lesson workspace" });
  if (await tabs.isVisible())
    await tabs.getByRole("button", { name: "Notes", exact: true }).click();
  await page
    .getByLabel("Personal notes", { exact: true })
    .fill(
      "My own note: aggregate the denominator. <img src=x onerror=alert(1)>",
    );
  await page.reload();
  if (await tabs.isVisible())
    await tabs.getByRole("button", { name: "Notes", exact: true }).click();
  await expect(page.getByLabel("Personal notes", { exact: true })).toHaveValue(
    /aggregate the denominator/,
  );
  await expect(page.locator("img[src=x]")).toHaveCount(0);
  const downloadPromise = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export notebook", exact: true })
    .click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    "python-notebook.json",
  );
  await codeTab(page);
  await setCode(page, 'raise ValueError("invalid observation")');
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Run code", exact: true }),
  ).toBeEnabled({ timeout: 60000 });
  await expect(page.getByLabel("Python stderr", { exact: true })).toContainText(
    "ValueError: invalid observation",
  );
  await expect(page.getByLabel("Python stderr", { exact: true })).toContainText(
    "learner.py",
  );
  await readTab(page);
  await expect(
    page.getByRole("button", { name: "Complete Python chapter", exact: true }),
  ).toBeDisabled();
  expect(errors).toEqual([]);
});
test("worker timeout, stop, fresh globals and offline notes survive without external execution", async ({
  page,
  context,
}) => {
  test.setTimeout(120000);
  await page.goto("/#/python/variables");
  await codeTab(page);
  await setCode(page, "while True:\n    pass");
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await expect(page.getByLabel("Python stderr", { exact: true })).toContainText(
    "Time limit exceeded",
    { timeout: 60000 },
  );
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await page
    .getByRole("button", { name: "Stop execution", exact: true })
    .click();
  await expect(page.getByLabel("Python stderr", { exact: true })).toContainText(
    "Execution stopped",
  );
  await setCode(page, "secret = 42\nprint(secret)");
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await expect(page.getByLabel("Python stdout", { exact: true })).toHaveText(
    "42",
    { timeout: 60000 },
  );
  await setCode(page, "print(secret)");
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await expect(page.getByLabel("Python stderr", { exact: true })).toContainText(
    "NameError",
    { timeout: 60000 },
  );
  const tabs = page.getByRole("group", { name: "Lesson workspace" });
  if (await tabs.isVisible())
    await tabs.getByRole("button", { name: "Notes", exact: true }).click();
  await page
    .getByLabel("Personal notes", { exact: true })
    .fill("Offline prediction");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.reload();
  if (await tabs.isVisible())
    await tabs.getByRole("button", { name: "Notes", exact: true }).click();
  await expect(page.getByLabel("Personal notes", { exact: true })).toHaveValue(
    "Offline prediction",
  );
  await codeTab(page);
  await setCode(page, "print(sum([2, 3, 5]))");
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await expect(page.getByLabel("Python stdout", { exact: true })).toHaveText(
    "10",
    { timeout: 60000 },
  );
  await page.goto("/#/python/pandas");
  await codeTab(page);
  await setCode(page, "import pandas as pd\nprint(pd.Series([2, 3]).sum())");
  await page.getByRole("button", { name: "Run code", exact: true }).click();
  await expect(page.getByLabel("Python stdout", { exact: true })).toHaveText(
    "5",
    { timeout: 60000 },
  );
  await context.setOffline(false);
});
test("corrupt notebook is preserved; validated backup import restores notes", async ({
  page,
}) => {
  await page.goto("/#/python");
  await page.evaluate(() => localStorage.setItem("olh.python.v1", "{broken"));
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("preserved");
  await page.goto("/#/python/variables");
  const tabs = page.getByRole("group", { name: "Lesson workspace" });
  if (await tabs.isVisible())
    await tabs.getByRole("button", { name: "Notes", exact: true }).click();
  await page
    .getByLabel("Personal notes", { exact: true })
    .fill("In memory only");
  expect(await page.evaluate(() => localStorage.getItem("olh.python.v1"))).toBe(
    "{broken",
  );
  await page
    .getByLabel("Import Python notebook", { exact: true })
    .setInputFiles({
      name: "bad.json",
      mimeType: "application/json",
      buffer: Buffer.from("{bad"),
    });
  await expect(page.getByRole("alert")).toContainText("Import rejected");
  expect(await page.evaluate(() => localStorage.getItem("olh.python.v1"))).toBe(
    "{broken",
  );
  page.once("dialog", (d) => d.accept());
  await page
    .getByLabel("Import Python notebook", { exact: true })
    .setInputFiles({
      name: "backup.json",
      mimeType: "application/json",
      buffer: Buffer.from(
        JSON.stringify({
          version: 1,
          notes: { variables: "Recovered note" },
          code: {},
          passed: [],
          recall: [],
          completed: [],
          lastLesson: "variables",
        }),
      ),
    });
  await expect(page.getByLabel("Personal notes", { exact: true })).toHaveValue(
    "Recovered note",
  );
  await page.reload();
  if (await tabs.isVisible())
    await tabs.getByRole("button", { name: "Notes", exact: true }).click();
  await expect(page.getByLabel("Personal notes", { exact: true })).toHaveValue(
    "Recovered note",
  );
});

test("Python studio is responsive, keyboard reachable and accessible in both themes", async ({
  page,
}) => {
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  test.setTimeout(90000);
  for (const theme of ["light", "dark"]) {
    await page.goto("/#/settings");
    await page
      .getByRole("combobox", { name: "Theme", exact: true })
      .selectOption(theme);
    await page.goto("/#/python/variables");
    await expect(page.locator(".python-academy")).toBeVisible();
    const tabs = page.getByRole("group", { name: "Lesson workspace" });
    const workspaces = (await tabs.isVisible())
      ? ["Read", "Code", "Notes"]
      : ["Read"];
    for (const tab of workspaces) {
      if (await tabs.isVisible())
        await tabs.getByRole("button", { name: tab, exact: true }).click();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      const result = await new AxeBuilder({ page })
        .include(".python-academy")
        .analyze();
      expect(
        result.violations.filter((v) =>
          ["serious", "critical"].includes(v.impact || ""),
        ),
      ).toEqual([]);
    }
  }
  await codeTab(page);
  const editor = page.locator(".python-lab .cm-content");
  await editor.focus();
  await editor.press("Escape");
  await editor.press("Tab");
  await expect(editor).not.toBeFocused();
});

test("beginner examples are highlighted and editable; exact streams, syntax errors and behavior gates work", async ({
  page,
}, testInfo) => {
  test.setTimeout(120000);
  await page.goto("/#/course/python");
  await page.getByRole("link", { name: "Start the beginner lesson" }).click();
  await expect(page.getByLabel("Python build", { exact: true })).toContainText(
    /Studio build [a-f0-9]{12}/,
  );
  await expect(
    page.locator(".python-prose .py-token-string").first(),
  ).toBeVisible();
  const example = pythonLessons[0].examples[0];
  await expect(
    page.locator(".python-prose .cm-content").first().locator(".cm-line"),
  ).toHaveText(example.code.split("\n"));
  await page
    .getByRole("button", { name: "Open example 1 in the coding lab" })
    .click();
  await expect(page.locator(".python-lab .cm-content .cm-line")).toHaveText(
    example.code.split("\n"),
  );
  const run = async () => {
    await page.getByRole("button", { name: "Run code", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Run code", exact: true }),
    ).toBeEnabled({ timeout: 60000 });
  };
  await run();
  expect(
    await page.getByLabel("Python stdout", { exact: true }).textContent(),
  ).toBe("Workload: 10.00 hours\n");
  await setCode(
    page,
    'import sys\nprint("नमस्ते", end="")\nprint(" warning", file=sys.stderr, end="")',
  );
  await run();
  expect(
    await page.getByLabel("Python stdout", { exact: true }).textContent(),
  ).toBe("नमस्ते");
  expect(
    await page.getByLabel("Python stderr", { exact: true }).textContent(),
  ).toBe(" warning");
  await setCode(page, 'print("before failure")\nraise ValueError("try again")');
  await run();
  expect(
    await page.getByLabel("Python stdout", { exact: true }).textContent(),
  ).toBe("before failure\n");
  await expect(page.getByLabel("Python stderr", { exact: true })).toContainText(
    "ValueError: try again",
  );
  await setCode(page, 'if True\n    print("missing colon")');
  await run();
  await expect(page.getByLabel("Python stderr", { exact: true })).toContainText(
    "SyntaxError",
  );
  await expect(page.getByLabel("Python stderr", { exact: true })).toContainText(
    "learner.py",
  );
  await page.screenshot({
    path: testInfo.outputPath("beginner-syntax-error.png"),
  });
  await page.getByLabel("Choose a practice task").selectOption("0");
  // Correct-looking stdout alone cannot satisfy the numeric behavior check.
  await setCode(page, 'hours = 0\nprint("Workload: 7.00 hours")');
  await check(page);
  await expect(page.getByLabel("Python stderr", { exact: true })).toContainText(
    "AssertionError",
  );
  await expect(page.locator(".python-lab")).not.toContainText(
    "✓ Behavior checks passed.",
  );
  // A different implementation passes without matching the reference source.
  await setCode(
    page,
    'contacts, minutes_per_contact = 84, 5\nhours = sum([minutes_per_contact] * contacts) / 60\nprint("Workload: {:.2f} hours".format(hours))',
  );
  await check(page);
  await expect(page.locator(".python-lab")).toContainText(
    "✓ Behavior checks passed.",
  );
  await page.screenshot({
    path: testInfo.outputPath("beginner-behavior-pass.png"),
  });
  await readTab(page);
  await expect(
    page.getByRole("button", { name: "Complete Python chapter", exact: true }),
  ).toBeDisabled();
  await expect(page.getByRole("checkbox")).toHaveCount(0);
  const tabs = page.getByRole("group", { name: "Lesson workspace" });
  if (await tabs.isVisible())
    await tabs.getByRole("button", { name: "Notes", exact: true }).click();
  await page
    .getByLabel("Personal notes", { exact: true })
    .fill("My first program: names bind to values.");
  await page.reload();
  await expect(page.locator(".python-academy")).toBeVisible();
  if (await tabs.isVisible())
    await tabs.getByRole("button", { name: "Notes", exact: true }).click();
  await expect(page.getByLabel("Personal notes", { exact: true })).toHaveValue(
    "My first program: names bind to values.",
  );
  await codeTab(page);
  expect(await page.locator(".python-lab .cm-content").textContent()).toContain(
    "sum([minutes_per_contact] * contacts)",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
});

test("preserved static Python URLs clearly lead to the executable studio", async ({
  page,
}) => {
  for (const path of [
    "/python-curriculum.html",
    "/legacy/python-curriculum.html",
  ]) {
    await page.goto(path);
    await expect(page.getByLabel("Archived Python reader")).toContainText(
      "does not execute Python",
    );
    await page
      .getByRole("link", { name: "Open the executable beginner lesson →" })
      .click();
    await expect(page.locator(".python-academy")).toBeVisible();
    await codeTab(page);
    await expect(
      page.getByRole("button", { name: "Run code", exact: true }),
    ).toBeEnabled();
  }
});
