/**
 * Production Node.js HTTP wrapper for the TanStack Start Cloudflare Workers SSR build.
 * Serves static client assets from dist/client/ and SSR from dist/server/index.mjs.
 */
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { resolve, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const STATIC_DIR = resolve(__dirname, "dist/client");
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js":   "text/javascript",
  ".mjs":  "text/javascript",
  ".css":  "text/css",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif":  "image/gif",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".json": "application/json",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
  ".txt":  "text/plain",
};

// Load the SSR worker (Cloudflare Workers fetch-handler format)
const { default: worker } = await import("./dist/server/index.mjs");

const ctx = {
  waitUntil(_p) {},
  passThroughOnException() {},
};

const server = createServer(async (req, res) => {
  try {
    // --- Serve static files from dist/client/ ---
    const pathname = new URL(req.url, "http://localhost").pathname;
    const candidate = resolve(STATIC_DIR, "." + pathname);

    // Security: ensure candidate is inside STATIC_DIR
    if (candidate.startsWith(STATIC_DIR)) {
      if (existsSync(candidate) && statSync(candidate).isFile()) {
        const mime = MIME[extname(candidate).toLowerCase()] ?? "application/octet-stream";
        res.writeHead(200, { "Content-Type": mime });
        createReadStream(candidate).pipe(res);
        return;
      }
    }

    // --- SSR via the Cloudflare Workers fetch handler ---
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks);

    const url = new URL(req.url, `http://localhost:${PORT}`);
    const request = new Request(url.toString(), {
      method: req.method,
      headers: new Headers(
        Object.entries(req.headers)
          .filter(([, v]) => v != null)
          .map(([k, v]) => [k, Array.isArray(v) ? v.join(", ") : String(v)])
      ),
      body: !["GET", "HEAD"].includes(req.method ?? "GET") && body.length ? body : null,
      // @ts-ignore — Node fetch supports duplex: "half" for streaming
      duplex: "half",
    });

    const response = await worker.fetch(request, {}, ctx);

    const outHeaders = {};
    response.headers.forEach((value, key) => { outHeaders[key] = value; });
    res.writeHead(response.status, outHeaders);

    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }
    res.end();
  } catch (err) {
    console.error("[server-node] unhandled error:", err);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "text/plain" });
    }
    res.end("Internal Server Error");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
