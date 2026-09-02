#!/usr/bin/env node
/**
 * Copy the static SPA client (dist/client) to the repo root so GitHub Pages
 * (branch master, path /) can serve it at /practice-savings-calculator/.
 */
import { copyFileSync, cpSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
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

for (const name of ["assets", "__grok", "favicon.svg", ".nojekyll", "_shell.html"]) {
  const src = join(client, name);
  const dst = join(root, name);
  if (!existsSync(src)) continue;
  cpSync(src, dst, { recursive: true });
}
console.log("published dist/client to repo root for GitHub Pages");
