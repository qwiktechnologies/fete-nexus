import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const fileKey = "MjvQRztJ36WtMcbnsMlagp";
const outDir = path.join(root, "figma-cache");

async function loadToken() {
  const envPath = path.join(root, ".env.local");
  const raw = await readFile(envPath, "utf8");
  const line = raw.split(/\r?\n/).find((l) => l.startsWith("FIGMA_TOKEN="));
  if (!line) throw new Error("FIGMA_TOKEN missing in .env.local");
  return line.slice("FIGMA_TOKEN=".length).trim();
}

async function figmaGet(token, urlPath) {
  const res = await fetch(`https://api.figma.com/v1${urlPath}`, {
    headers: { "X-Figma-Token": token },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${urlPath}: ${body.slice(0, 400)}`);
  }
  return res.json();
}

function walkNames(node, list = [], depth = 0) {
  if (!node) return list;
  if (node.name && (node.type === "FRAME" || node.type === "COMPONENT" || node.type === "SECTION")) {
    list.push({ id: node.id, name: node.name, type: node.type, depth });
  }
  for (const child of node.children ?? []) walkNames(child, list, depth + 1);
  return list;
}

function collectImageNodes(node, list = []) {
  if (!node) return list;
  if (node.type === "RECTANGLE" && node.fills?.some((f) => f.type === "IMAGE")) {
    list.push({ id: node.id, name: node.name });
  }
  if (node.type === "FRAME" && node.name?.toLowerCase().includes("hero")) {
    list.push({ id: node.id, name: node.name, frame: true });
  }
  for (const child of node.children ?? []) collectImageNodes(child, list);
  return list;
}

function extractColors(node, set = new Set()) {
  if (!node) return set;
  for (const fill of node.fills ?? []) {
    if (fill.type === "SOLID" && fill.color) {
      const { r, g, b } = fill.color;
      const hex = [r, g, b]
        .map((c) => Math.round(c * 255).toString(16).padStart(2, "0"))
        .join("");
      set.add(`#${hex}`);
    }
  }
  for (const child of node.children ?? []) extractColors(child, set);
  return set;
}

async function main() {
  const token = await loadToken();
  await mkdir(outDir, { recursive: true });

  const file = await figmaGet(token, `/files/${fileKey}?depth=4`);
  const frames = walkNames(file.document);
  const colors = [...extractColors(file.document)].sort();
  await writeFile(path.join(outDir, "frames.json"), JSON.stringify(frames, null, 2));
  await writeFile(path.join(outDir, "colors.json"), JSON.stringify(colors, null, 2));
  await writeFile(
    path.join(outDir, "summary.json"),
    JSON.stringify({ name: file.name, lastModified: file.lastModified, frameCount: frames.length }, null, 2),
  );

  const topFrames = frames.filter((f) => f.depth <= 2).slice(0, 12);
  for (const frame of topFrames) {
    const nodeId = encodeURIComponent(frame.id);
    const img = await figmaGet(token, `/images/${fileKey}?ids=${nodeId}&format=png&scale=1`);
    const url = img.images?.[frame.id];
    if (!url) continue;
    const png = await fetch(url);
    const buf = Buffer.from(await png.arrayBuffer());
    const safe = frame.name.replace(/[^\w.-]+/g, "_").slice(0, 60);
    await writeFile(path.join(outDir, `${safe}-${frame.id.replace(":", "-")}.png`), buf);
    console.log("saved", safe);
  }

  console.log("frames", frames.length, "colors", colors.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});