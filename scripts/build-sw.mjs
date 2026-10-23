import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)],
    );
}
const assets = walk("dist")
  .filter(
    (p) =>
      (!p.endsWith("sw.js") &&
        !p.includes("/legacy/") &&
        !p.endsWith(".html")) ||
      p === "dist/index.html",
  )
  .map((p) => p.replace(/^dist\//, ""));
const version = createHash("sha256")
  .update(
    assets
      .map((p) => fs.readFileSync(`dist/${p}`))
      .reduce((a, b) => Buffer.concat([a, b]), Buffer.alloc(0)),
  )
  .digest("hex")
  .slice(0, 12);
fs.writeFileSync(
  "dist/sw.js",
  `const CACHE='olh-${version}';const SHELL=${JSON.stringify(["./", ...assets])};
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('olh-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin||!u.pathname.startsWith(new URL(self.registration.scope).pathname))return;e.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(e.request);if(cached)return cached;try{const response=await fetch(e.request);if(response.ok&&response.type==='basic')await cache.put(e.request,response.clone());return response;}catch{if(e.request.mode==='navigate')return (await cache.match('./'))||Response.error();return Response.error();}})());});
`,
);
console.log(`Offline cache ${version}: ${assets.length + 1} shell resources.`);
