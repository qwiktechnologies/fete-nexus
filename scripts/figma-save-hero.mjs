import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const fileKey = "MjvQRztJ36WtMcbnsMlagp";
const outDir = path.join(root, "public", "figma", "home");

async function loadToken() {
  const raw = await readFile(path.join(root, ".env.local"), "utf8");
  const line = raw.split(/\r?\n/).find((l) => l.startsWith("FIGMA_TOKEN="));
  return line.slice("FIGMA_TOKEN=".length).trim();
}

function findImageRef(node, refs = []) {
  for (const fill of node.fills ?? []) {
    if (fill.type === "IMAGE" && fill.imageRef) refs.push({ id: node.id, name: node.name, imageRef: fill.imageRef });
  }
  for (const child of node.children ?? []) findImageRef(child, refs);
  return refs;
}

async function main() {
  const token = await loadToken();
  await mkdir(outDir, { recursive: true });

  const nodes = await fetch(`https://api.figma.com/v1/files/${fileKey}/nodes?ids=2%3A5&depth=12`, {
    headers: { "X-Figma-Token": token },
  }).then((r) => r.json());

  const doc = nodes.nodes?.["2:5"]?.document;
  const refs = findImageRef(doc);
  await writeFile(path.join(outDir, "refs.json"), JSON.stringify(refs, null, 2));

  const map = await fetch(`https://api.figma.com/v1/files/${fileKey}/images`, {
    headers: { "X-Figma-Token": token },
  }).then((r) => r.json());

  const names = {
    "10:800": "hero.png",
    "26:169": "collage-main.png",
    "26:187": "collage-fleet.png",
  };

  console.log("refs", refs.length, "fill map", Object.keys(map.images ?? {}).length);

  for (const item of refs) {
    const url = map.images?.[item.imageRef];
    if (!url) {
      console.warn("missing", item.id, item.imageRef?.slice(0, 8));
      continue;
    }
    const file = names[item.id] ?? `asset-${item.id.replace(":", "-")}.png`;
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    await writeFile(path.join(outDir, file), buf);
    console.log("saved", file);
  }
}

main().catch(console.error);