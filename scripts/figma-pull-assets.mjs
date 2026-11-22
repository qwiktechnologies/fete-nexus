import { mkdir, writeFile, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const fileKey = "MjvQRztJ36WtMcbnsMlagp";

const nodeFiles = {
  "10:800": "public/figma/home/hero.png",
  "26:169": "public/figma/home/collage-main.png",
  "26:187": "public/figma/home/collage-fleet.png",
  "81:34": "public/figma/brand/logo.png",
  "53:48": "public/figma/about/fleet.png",
  "53:87": "public/figma/about/crew.png",
};

async function loadToken() {
  const raw = await readFile(path.join(root, ".env.local"), "utf8");
  const line = raw.split(/\r?\n/).find((l) => l.startsWith("FIGMA_TOKEN="));
  if (!line) throw new Error("FIGMA_TOKEN missing");
  return line.slice("FIGMA_TOKEN=".length).trim();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function download(url, dest) {
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await (await fetch(url)).arrayBuffer()));
}

async function main() {
  const token = await loadToken();
  const homeRefs = JSON.parse(await readFile(path.join(root, "public/figma/home/refs.json"), "utf8"));
  let aboutRefs = [];
  try {
    aboutRefs = JSON.parse(await readFile(path.join(root, "figma-cache/about/images.json"), "utf8"));
  } catch {
  }
  const refs = [...homeRefs, ...aboutRefs];

  const imagesRes = await fetch(`https://api.figma.com/v1/files/${fileKey}/images`, {
    headers: { "X-Figma-Token": token },
  });
  if (!imagesRes.ok) throw new Error(await imagesRes.text());
  const imagesPayload = await imagesRes.json();
  const map = imagesPayload.meta?.images ?? {};

  let ok = 0;
  for (const ref of refs) {
    const rel = nodeFiles[ref.id];
    if (!rel) continue;
    const url = map[ref.imageRef];
    if (!url) {
      console.warn("no url for", ref.id);
      continue;
    }
    const dest = path.join(root, rel);
    await download(url, dest);
    const s = await stat(dest);
    console.log("ok", rel, s.size);
    ok++;
  }

  if (ok >= Object.keys(nodeFiles).length) {
    console.log("done, fill downloads:", ok, "(skipped render API)");
    return;
  }

  for (const [nodeId, rel] of Object.entries(nodeFiles)) {
    const dest = path.join(root, rel);
    let size = 0;
    try {
      size = (await stat(dest)).size;
    } catch {
      size = 0;
    }
    if (size > 80_000) continue;

    console.log("render", rel, "in 90s...");
    await sleep(90000);
    const res = await fetch(
      `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(nodeId)}&format=png&scale=2`,
      { headers: { "X-Figma-Token": token } },
    );
    const data = await res.json();
    if (!res.ok) {
      console.error(rel, data);
      continue;
    }
    const url = data.images?.[nodeId];
    if (!url) continue;
    await download(url, dest);
    console.log("rendered", rel, (await stat(dest)).size);
  }

  console.log("done, fill downloads:", ok);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});