import { copyFile, cp, mkdir, writeFile } from "node:fs/promises";

await mkdir(new URL("../dist/", import.meta.url), { recursive: true });
for (const file of [
  "index.html",
  "menu.html",
  "our-story.html",
  "visit-us.html",
  "styles.css",
  "menu.css",
  "our-story.css",
  "visit-us.css",
  "visit-us.js",
  "business-details.js",
  "app.js",
]) {
  await copyFile(
    new URL(`../${file}`, import.meta.url),
    new URL(`../dist/${file}`, import.meta.url),
  );
}
await cp(
  new URL("../public/", import.meta.url),
  new URL("../dist/", import.meta.url),
  { recursive: true },
);
await writeFile(new URL("../dist/.nojekyll", import.meta.url), "");
// Support the same extension-free addresses as the local preview server.
for (const page of ["menu", "our-story", "visit-us"]) {
  await mkdir(new URL(`../dist/${page}/`, import.meta.url), { recursive: true });
  await copyFile(
    new URL(`../${page}.html`, import.meta.url),
    new URL(`../dist/${page}/index.html`, import.meta.url),
  );
}
console.log("Built all four Tavio Kitchen pages to dist/.");
