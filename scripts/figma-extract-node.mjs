import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const fileKey = "MjvQRztJ36WtMcbnsMlagp";
const nodeId = process.argv[2] ?? "53:8";
const slug = process.argv[3] ?? "about";

async function loadToken() {
  const raw = await readFile(path.join(root, ".env.local"), "utf8");
  const line = raw.split(/\r?\n/).find((l) => l.startsWith("FIGMA_TOKEN="));
  return line.slice("FIGMA_TOKEN=".length).trim();
}

function collectText(node, list = []) {
  if (node?.type === "TEXT" && node.characters) {
    list.push({ id: node.id, name: node.name, text: node.characters.replace(/\r/g, "").trim() });
  }
  for (const child of node.children ?? []) collectText(child, list);
  return list;
}

function collectImageFills(node, list = []) {
  for (const fill of node.fills ?? []) {
    if (fill.type === "IMAGE" && fill.imageRef) list.push({ id: node.id, name: node.name, imageRef: fill.imageRef });
  }
  for (const child of node.children ?? []) collectImageFills(child, list);
  return list;
}

async function main() {
  const token = await loadToken();
  const out = path.join(root, "figma-cache", slug);
  await mkdir(out, { recursive: true });

  const enc = encodeURIComponent(nodeId);
  const res = await fetch(`https://api.figma.com/v1/files/${fileKey}/nodes?ids=${enc}&depth=12`, {
    headers: { "X-Figma-Token": token },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  const doc = data.nodes?.[nodeId]?.document;
  if (!doc) throw new Error("node missing");

  const texts = collectText(doc).filter((t) => t.text.length > 0);
  const images = collectImageFills(doc);
  await writeFile(path.join(out, "texts.json"), JSON.stringify(texts, null, 2));
  await writeFile(path.join(out, "images.json"), JSON.stringify(images, null, 2));
  console.log("texts", texts.length, "images", images.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});