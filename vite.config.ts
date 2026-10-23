import { defineConfig } from "vite";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? sources(`${dir}/${entry.name}`)
      : [`${dir}/${entry.name}`],
  );
}
const buildId = createHash("sha256")
  .update(
    [...sources("src"), "public/python-worker.js"]
      .sort()
      .map((file) => file + readFileSync(file, "utf8"))
      .join("\n"),
  )
  .digest("hex")
  .slice(0, 12);
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  base: "./",
  define: { "import.meta.env.OLH_BUILD_ID": JSON.stringify(buildId) },
  plugins: [react(), tailwindcss()],
  test: { environment: "node", include: ["tests/**/*.test.ts"] },
} as Parameters<typeof defineConfig>[0]);
