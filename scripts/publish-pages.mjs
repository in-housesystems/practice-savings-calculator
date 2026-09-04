#!/usr/bin/env node
/**
 * Copy the static SPA client (dist/client) to the repo root so GitHub Pages
 * (branch master, path /) can serve it at /practice-savings-calculator/.
 *
 * Generated directories (`assets/`, leftover `__grok/`) are replaced, not
 * merged, so stale hashed bundles and Grok PWA files cannot remain live.
 */
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const client = join(root, "dist", "client");
const shellPath = join(client, "_shell.html");
if (!existsSync(shellPath)) {
  console.error("missing dist/client/_shell.html — run the production build first");
  process.exit(1);
}
const shell = Buffer.from([...readFileSync(shellPath)].filter((b) => b !== 0));
writeFileSync(join(root, "index.html"), shell);
writeFileSync(join(root, "404.html"), shell);
writeFileSync(shellPath, shell);

for (const name of ["assets", "__grok"]) {
  rmSync(join(root, name), { recursive: true, force: true });
}

for (const name of ["assets", "favicon.svg", ".nojekyll", "_shell.html"]) {
  const src = join(client, name);
  const dst = join(root, name);
  if (!existsSync(src)) continue;
  cpSync(src, dst, { recursive: true });
}

// GitHub Pages needs this so `_shell.html` is not ignored as Jekyll metadata.
writeFileSync(join(root, ".nojekyll"), "");

const snapshotFiles = ["index.html", "404.html"];
for (const name of snapshotFiles) {
  const html = readFileSync(join(root, name), "utf8");
  if (!html.includes("/practice-savings-calculator/assets/")) {
    console.error(`${name} is missing /practice-savings-calculator/assets/ — refusing to publish`);
    process.exit(1);
  }
  if (html.includes("__grok")) {
    console.error(`${name} still references __grok — refusing to publish`);
    process.exit(1);
  }
}
if (existsSync(join(root, "__grok"))) {
  console.error("root __grok/ still present after publish — refusing to leave Grok assets live");
  process.exit(1);
}

console.log("published dist/client to repo root for GitHub Pages");
