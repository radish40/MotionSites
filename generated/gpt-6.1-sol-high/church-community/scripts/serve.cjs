const http = require("http"),
  fs = require("fs"),
  path = require("path");
const base = "/motionsites-results/church-community/";
http
  .createServer((req, res) => {
    const url = decodeURIComponent(req.url.split("?")[0]);
    if (!url.startsWith(base)) {
      res.writeHead(302, { Location: base });
      return res.end();
    }
    const rel = url.slice(base.length) || "index.html";
    const file = path.join(process.cwd(), "dist", rel);
    if (!file.startsWith(path.join(process.cwd(), "dist"))) {
      res.writeHead(403);
      return res.end();
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end("Not found");
      }
      const mime = {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".png": "image/png",
        ".ttf": "font/ttf",
        ".ico": "image/x-icon",
        ".json": "application/json",
      };
      res.writeHead(200, {
        "Content-Type": mime[path.extname(file)] || "application/octet-stream",
      });
      res.end(data);
    });
  })
  .listen(4173, "0.0.0.0");
