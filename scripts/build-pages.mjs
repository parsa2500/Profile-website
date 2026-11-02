import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const adminSrc = path.join(root, "src", "app", "admin");
const adminTmp = path.join(root, ".admin-static-backup");
const outDir = path.join(root, "out");
const nextDir = path.join(root, ".next");

function restoreAdmin() {
  if (fs.existsSync(adminTmp)) {
    if (fs.existsSync(adminSrc)) {
      fs.rmSync(adminSrc, { recursive: true, force: true });
    }
    fs.renameSync(adminTmp, adminSrc);
  }
}

process.on("exit", restoreAdmin);
process.on("SIGINT", () => {
  restoreAdmin();
  process.exit(1);
});
process.on("SIGTERM", () => {
  restoreAdmin();
  process.exit(1);
});
process.on("uncaughtException", (error) => {
  console.error(error);
  restoreAdmin();
  process.exit(1);
});

if (!fs.existsSync(adminSrc)) {
  console.error("Expected src/app/admin to exist before static export.");
  process.exit(1);
}

if (fs.existsSync(adminTmp)) {
  fs.rmSync(adminTmp, { recursive: true, force: true });
}

fs.renameSync(adminSrc, adminTmp);
console.log("Moved src/app/admin aside for static export.");

if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log("Cleared .next cache for static export.");
}

const env = {
  ...process.env,
  STATIC_EXPORT: "1",
  NEXT_PUBLIC_BASE_PATH: "/Profile-website",
  NEXT_PUBLIC_SITE_URL: "https://parsa2500.github.io/Profile-website",
};

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
const result = spawnSync(npmCmd, ["run", "build"], {
  cwd: root,
  env,
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (result.status !== 0) {
  restoreAdmin();
  process.exit(result.status || 1);
}

if (!fs.existsSync(outDir)) {
  console.error("Static export did not produce an out/ directory.");
  restoreAdmin();
  process.exit(1);
}

fs.writeFileSync(path.join(outDir, ".nojekyll"), "");

const indexHtml = `<!DOCTYPE html>
<html lang="fa">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0;url=./fa/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Auto team</title>
    <link rel="canonical" href="./fa/" />
  </head>
  <body>
    <p><a href="./fa/">Auto team</a></p>
  </body>
</html>
`;

fs.writeFileSync(path.join(outDir, "index.html"), indexHtml);

const fa = path.join(outDir, "fa", "index.html");
const en = path.join(outDir, "en", "index.html");
if (!fs.existsSync(fa) || !fs.existsSync(en)) {
  console.error("Missing locale index.html under out/fa or out/en.");
  restoreAdmin();
  process.exit(1);
}

console.log("Static Pages build ready in out/");
restoreAdmin();
console.log("Restored src/app/admin.");
