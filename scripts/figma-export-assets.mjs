import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const fileKey = "MjvQRztJ36WtMcbnsMlagp";

async function loadToken() {
  const raw = await readFile(path.join(root, ".env.local"), "utf8");
  const line = raw.split(/\r?\n/).find((l) => l.startsWith("FIGMA_TOKEN="));
  if (!line) throw new Error("FIGMA_TOKEN missing in .env.local");
  return line.slice("FIGMA_TOKEN=".length).trim();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function collectImageFills(node, list = []) {
  for (const fill of node.fills ?? []) {
    if (fill.type === "IMAGE" && fill.imageRef) {
      list.push({ nodeId: node.id, name: node.name, imageRef: fill.imageRef });
    }
  }
  for (const child of node.children ?? []) collectImageFills(child, list);
  return list;
}

async function fetchJson(token, url) {
  const res = await fetch(url, { headers: { "X-Figma-Token": token } });
  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${url}\n${text.slice(0, 400)}`);
  return JSON.parse(text);
}

async function downloadUrl(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download ${res.status} ${dest}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
}

async function renderNode(token, nodeId, dest) {
  const data = await fetchJson(
    token,
    `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(nodeId)}&format=png&scale=2`,
  );
  const url = data.images?.[nodeId];
  if (!url) throw new Error(`no render url for ${nodeId}`);
  await downloadUrl(url, dest);
}

async function main() {
  const token = await loadToken();
  const homeDir = path.join(root, "public", "figma", "home");
  const brandDir = path.join(root, "public", "figma", "brand");
  await mkdir(homeDir, { recursive: true });
  await mkdir(brandDir, { recursive: true });

  const file = await fetchJson(token, `https://api.figma.com/v1/files/${fileKey}?depth=12`);
  const imageMap = file.images ?? {};
  const home = file.document?.children?.find((n) => n.name === "Home page") ?? file.document;
  const fills = collectImageFills(home);

  await writeFile(path.join(homeDir, "fills-debug.json"), JSON.stringify({ mapKeys: Object.keys(imageMap).length, fills }, null, 2));

  const byNode = {
    "10:800": "hero.png",
    "26:169": "collage-main.png",
    "26:187": "collage-fleet.png",
    "81:34": "../brand/logo.png",
  };

  const logoRef = "9e1b8580da4ac70a6fe10e42e2e0573a46d58b12";

  if (imageMap[logoRef]) {
    await downloadUrl(imageMap[logoRef], path.join(brandDir, "logo.png"));
    console.log("logo from imageRef");
  }

  for (const item of fills) {
    const rel = byNode[item.nodeId];
    if (!rel) continue;
    const dest = path.join(homeDir, rel.includes("/") ? rel.replace("../brand/", "") : rel);
    if (rel.includes("brand")) {
      await mkdir(brandDir, { recursive: true });
    }
    const url = imageMap[item.imageRef];
    if (url) {
      await downloadUrl(url, dest.includes("brand") ? path.join(brandDir, "logo.png") : path.join(homeDir, rel));
      console.log("fill", rel);
      continue;
    }
    console.warn("render fallback", item.nodeId, rel);
    await sleep(120000);
    await renderNode(token, item.nodeId, path.join(homeDir, rel.includes("/") ? "logo-tmp.png" : rel));
    console.log("rendered", rel);
  }

  if (!imageMap[logoRef]) {
    await sleep(120000);
    await renderNode(token, "81:34", path.join(brandDir, "logo.png"));
    console.log("rendered logo");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});