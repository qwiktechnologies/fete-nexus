import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const fileKey = "MjvQRztJ36WtMcbnsMlagp";
const outDir = path.join(root, "figma-cache", "home");

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
  if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

function collectText(node, list = []) {
  if (!node) return list;
  if (node.type === "TEXT" && node.characters) {
    list.push({
      id: node.id,
      name: node.name,
      text: node.characters.trim(),
      style: node.style,
    });
  }
  for (const child of node.children ?? []) collectText(child, list);
  return list;
}

function collectImageFills(node, list = []) {
  if (!node) return list;
  const hasImage = node.fills?.some((f) => f.type === "IMAGE");
  if (hasImage && (node.type === "RECTANGLE" || node.type === "FRAME" || node.type === "VECTOR")) {
    list.push({ id: node.id, name: node.name, type: node.type });
  }
  for (const child of node.children ?? []) collectImageFills(child, list);
  return list;
}

async function main() {
  const token = await loadToken();
  await mkdir(outDir, { recursive: true });

  const file = await figmaGet(token, `/files/${fileKey}/nodes?ids=${encodeURIComponent("2:5")}&depth=10`);
  const home = file.nodes?.["2:5"]?.document;
  if (!home) throw new Error("Home page node missing");

  const texts = collectText(home).filter((t) => t.text.length > 0);
  const images = collectImageFills(home);

  await writeFile(path.join(outDir, "texts.json"), JSON.stringify(texts, null, 2));
  await writeFile(path.join(outDir, "images.json"), JSON.stringify(images, null, 2));
  console.log("texts", texts.length, "images", images.length);

  const publicDir = path.join(root, "public", "figma", "home");
  await mkdir(publicDir, { recursive: true });

  const exportNodes = [
    { id: "2:5", file: "hero-section.png" },
    { id: "8:751", file: "hero-photo.png" },
    { id: "26:112", file: "who-we-are.png" },
    { id: "15:3", file: "services-section.png" },
  ];

  for (const item of exportNodes) {
    await sleep(6000);
    const img = await figmaGet(token, `/images/${fileKey}?ids=${encodeURIComponent(item.id)}&format=png&scale=2`);
    const url = img.images?.[item.id];
    if (!url) {
      console.warn("skip", item.file);
      continue;
    }
    const png = await fetch(url);
    await writeFile(path.join(publicDir, item.file), Buffer.from(await png.arrayBuffer()));
    console.log("saved", item.file);
  }

  for (let i = 0; i < Math.min(images.length, 8); i++) {
    const item = images[i];
    await sleep(6000);
    const safe = item.name.replace(/[^\w.-]+/g, "_").slice(0, 40);
    const img = await figmaGet(token, `/images/${fileKey}?ids=${encodeURIComponent(item.id)}&format=png&scale=2`);
    const url = img.images?.[item.id];
    if (!url) continue;
    const png = await fetch(url);
    await writeFile(path.join(publicDir, `${safe}-${item.id.replace(":", "-")}.png`), Buffer.from(await png.arrayBuffer()));
    console.log("asset", safe);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});