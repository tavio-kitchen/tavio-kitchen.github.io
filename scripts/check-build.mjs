import { access, readFile } from "node:fs/promises";
import assert from "node:assert/strict";

const output = new URL("../dist/", import.meta.url);
const pages = ["index.html", "menu.html", "our-story.html", "visit-us.html"];
let checkedReferences = 0;

async function checkReference(reference, source) {
  if (!reference || reference.startsWith("#") || /^(?:https?:|data:|mailto:|tel:)/i.test(reference)) return;
  const url = new URL(reference, `https://tavio-kitchen.github.io/${source}`);
  const path = decodeURIComponent(url.pathname).replace(/^\//, "") || "index.html";
  const file = path.endsWith("/") ? `${path}index.html` : path;
  await access(new URL(file, output)).catch(() => {
    throw new Error(`Missing published asset: ${reference} referenced by ${source}`);
  });
  checkedReferences++;
}

for (const page of pages) {
  const html = await readFile(new URL(page, output), "utf8");
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${page} must have one main heading`);
  assert(html.includes("/menu.html") && html.includes("/our-story.html") && html.includes("/visit-us.html"), `${page} must link to all pages`);
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
    await checkReference(match[1], page);
  }
}

for (const file of ["styles.css", "menu.css", "our-story.css", "visit-us.css"]) {
  const css = await readFile(new URL(file, output), "utf8");
  for (const match of css.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)) {
    await checkReference(match[1], file);
  }
}

const visitScript = await readFile(new URL("visit-us.js", output), "utf8");
for (const match of visitScript.matchAll(/from\s+["']([^"']+)["']/g)) {
  await checkReference(match[1], "visit-us.js");
}
for (const page of ["menu", "our-story", "visit-us"]) {
  assert.equal(
    await readFile(new URL(`${page}/index.html`, output), "utf8"),
    await readFile(new URL(`${page}.html`, output), "utf8"),
    `${page} must support its extension-free address`,
  );
}
await access(new URL(".nojekyll", output));
console.log(`Checked all four pages, clean URL aliases and ${checkedReferences} local page/asset references.`);
