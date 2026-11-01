// A static server for trying the plugin in the Studio: serves a folder with CORS, so https://netcomposer.art/studio/
// can fetch it from this machine. Run: npm run serve (the plugin/ folder on port 5990).
//   node tools/serve.mjs [folder] [port]
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "plugin");
const port = Number(process.argv[3] ?? 5990);
const TYPES = { ".json": "application/json", ".js": "text/javascript; charset=utf-8", ".md": "text/plain; charset=utf-8" };

createServer((req, res) => {
  const headers = {
    "access-control-allow-origin": "*",
    // Chrome asks before a public page (netcomposer.art) reaches localhost; this header lets the request through.
    "access-control-allow-private-network": "true",
    "cache-control": "no-store",
  };
  if (req.method === "OPTIONS") return res.writeHead(204, { ...headers, "access-control-allow-methods": "GET" }).end();
  const file = normalize(join(root, decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname)));
  if (!file.startsWith(root) || !existsSync(file) || statSync(file).isDirectory()) return res.writeHead(404, headers).end("not found");
  res.writeHead(200, { ...headers, "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(port, "127.0.0.1", () => {
  console.log(`Serving ${root} at http://localhost:${port}/`);
  console.log(`In the Studio: Inserts > Add > Load plugin from URL… > http://localhost:${port}/plugin.json`);
});
