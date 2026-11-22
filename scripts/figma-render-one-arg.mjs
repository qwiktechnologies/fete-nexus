import { mkdir, writeFile, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const fileKey = "MjvQRztJ36WtMcbnsMlagp";

const presets = {
  hero: { nodeId: "10:800", out: "public/figma/home/hero.png" },
  "collage-main": { nodeId: "26:169", out: "public/figma/home/collage-main.png" },
  "collage-fleet": { nodeId: "26:187", out: "public/figma/home/collage-fleet.png" },
  logo: { nodeId: "81:34", out: "public/figma/brand/logo.png" },
  "about-fleet": { nodeId: "53:48", out: "public/figma/about/fleet.png" },
  "about-crew": { nodeId: "53:87", out: "public/figma/about/crew.png" },
};

async function loadToken() {
  const raw = await readFile(path.join(root, ".env.local"), "utf8");
  const line = raw.split(/\r?\n/).find((l) => l.startsWith("FIGMA_TOKEN="));
  return line.slice("FIGMA_TOKEN=".length).trim();
}

const key = process.argv[2] ?? "hero";
const preset = presets[key];
if (!preset) {
  console.error("Usage: node figma-render-one-arg.mjs", Object.keys(presets).join("|"));
  process.exit(1);
}

const token = await loadToken();
const dest = path.join(root, preset.out);
await mkdir(path.dirname(dest), { recursive: true });

const res = await fetch(
  `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(preset.nodeId)}&format=png&scale=2`,
  { headers: { "X-Figma-Token": token } },
);
const data = await res.json();
if (!res.ok) {
  console.error(data);
  process.exit(1);
}
const url = data.images?.[preset.nodeId];
if (!url) {
  console.error("no url");
  process.exit(1);
}
await writeFile(dest, Buffer.from(await (await fetch(url)).arrayBuffer()));
console.log("saved", preset.out, (await stat(dest)).size);