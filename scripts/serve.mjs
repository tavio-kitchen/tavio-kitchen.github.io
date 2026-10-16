import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(
  new URL(
    process.argv.includes("--dist") ? "../dist/" : "../",
    import.meta.url,
  ),
);
const portFlag = process.argv.indexOf("--port");
const port = Number(
  portFlag >= 0 ? process.argv[portFlag + 1] : process.env.PORT || 5173,
);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};
const publicExtensions = new Set([".png", ".svg", ".woff2"]);

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    const relative =
      pathname === "/"
        ? "index.html"
        : pathname === "/menu" || pathname === "/menu/"
          ? "menu.html"
          : pathname === "/our-story" || pathname === "/our-story/"
            ? "our-story.html"
            : pathname === "/visit-us" || pathname === "/visit-us/"
              ? "visit-us.html"
              : pathname.replace(/^\/+/, "");
    const extension = extname(relative);
    const allowed =
      [
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
      ].includes(relative) || publicExtensions.has(extension);
    if (!allowed) {
      response.writeHead(404).end("Not found");
      return;
    }
    const directory =
      process.argv.includes("--dist") || !publicExtensions.has(extension)
        ? root
        : resolve(root, "public");
    const path = resolve(directory, relative);
    if (!path.startsWith(resolve(directory) + sep)) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    const info = await stat(path);
    if (!info.isFile()) {
      response.writeHead(404).end("Not found");
      return;
    }
    const content = await readFile(path);
    response.writeHead(200, {
      "Content-Type": mime[extension] || "application/octet-stream",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch {
    response.writeHead(404).end("Not found");
  }
});
server.listen(port, "127.0.0.1", () =>
  console.log(`Tavio Kitchen: http://localhost:${port}`),
);
server.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
