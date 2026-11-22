import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const fileKey = "MjvQRztJ36WtMcbnsMlagp";
const outDir = path.join(root, "public", "figma");

const exports = [
  { id: "2:5", name: "home-full.png" },
  { id: "8:751", name: "hero-team.png" },
  { id: "53:47", name: "about-fleet.png" },
  { id: "53:88", name: "about-mover.png" },
  { id: "26:112", name: "who-we-are-collage.png" },
];

async function loadToken() {
  const raw = await readFile(path.join(root, ".env.local"), "utf8");
  const line = raw.split(/\r?\n/).find((l) => l.startsWith("FIGMA_TOKEN="));
  if (!line) throw new Error("FIGMA_TOKEN missing");
  return line.slice("FIGMA_TOKEN=".length).trim();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function figmaGet(token, urlPath) {
  const res = await fetch(`https://api.figma.com/v1${urlPath}`, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) throw new Error(`${res.status} ${urlPath}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

async function main() {
  const token = await loadToken();
  await mkdir(outDir, { recursive: true });

  for (const item of exports) {
    await sleep(3500);
    const nodeId = encodeURIComponent(item.id);
    const img = await figmaGet(token, `/images/${fileKey}?ids=${nodeId}&format=png&scale=2`);
    const url = img.images?.[item.id];
    if (!url) {
      console.warn("skip", item.name);
      continue;
    }
    const png = await fetch(url);
    const buf = Buffer.from(await png.arrayBuffer());
    await writeFile(path.join(outDir, item.name), buf);
    console.log("ok", item.name);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});