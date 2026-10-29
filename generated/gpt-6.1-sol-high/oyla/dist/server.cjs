var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_node_path = __toESM(require("node:path"), 1);
var app = (0, import_express.default)();
var base = "/motionsites-results/oyla";
var production = process.env.NODE_ENV === "production";
async function videoProxy(req, res) {
  const share = String(req.query.url || "https://higgsfield.ai/s/keldUFnImRA");
  let url;
  try {
    url = new URL(share);
  } catch {
    return res.status(400).json({ success: false, error: "Invalid share URL" });
  }
  if (url.protocol !== "https:" || url.hostname !== "higgsfield.ai" || !url.pathname.startsWith("/s/")) {
    return res.status(400).json({ success: false, error: "Expected a Higgsfield share URL" });
  }
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1e4) });
    if (!response.ok) throw new Error("Share page unavailable");
    const html = (await response.text()).replace(/\\u002[fF]/g, "/").replace(/\\\//g, "/").replace(/&amp;/g, "&");
    const mp4 = html.match(/https:\/\/[^\s"'<>\\]+\.mp4(?:\?[^\s"'<>\\]*)?/i)?.[0];
    const videoTag = html.match(/<meta[^>]*(?:property|name)=["']og:video(?::url)?["'][^>]*content=["']([^"']+)["']/i)?.[1] || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']og:video(?::url)?["']/i)?.[1];
    const direct = mp4 || videoTag;
    if (!direct || !direct.startsWith("https://")) throw new Error("No direct video URL found");
    res.set("Cache-Control", "public, max-age=300").json({ success: true, url: direct });
  } catch {
    res.status(502).json({ success: false, error: "Video refresh unavailable; use the bundled video." });
  }
}
app.get(["/api/higgsfield-video", `${base}/api/higgsfield-video`], videoProxy);
async function start() {
  if (production) {
    const dist = import_node_path.default.resolve("dist");
    app.use(base, import_express.default.static(dist));
    app.use(import_express.default.static(dist));
    app.get("*", (_req, res) => res.sendFile(import_node_path.default.join(dist, "index.html")));
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  }
  app.listen(3e3, "0.0.0.0", () => console.log("OYLA \xB7 http://localhost:3000" + base + "/"));
}
start();
