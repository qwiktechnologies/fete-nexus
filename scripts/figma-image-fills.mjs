import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const fileKey = "MjvQRztJ36WtMcbnsMlagp";
const outDir = path.join(root, "public", "figma", "home");

async function loadToken() {
  const raw = await readFile(path.join(root, ".env.local"), "utf8");
  const line = raw.split(/\r?\n/).find((l) => l.startsWith("FIGMA_TOKEN="));
  if (!line) throw new Error("FIGMA_TOKEN missing");
  return line.slice("FIGMA_TOKEN=".length).trim();
}

async function main() {
  const token = await loadToken();
  await mkdir(outDir, { recursive: true });

  const meta = await fetch(`https://api.figma.com/v1/files/${fileKey}/images`, {
    headers: { "X-Figma-Token": token },
  });
  if (!meta.ok) throw new Error(await meta.text());
  const { images } = await meta.json();

  const wanted = {
    hero: "10:800",
    collageMain: "26:169",
    collageFleet: "26:187",
  };

  for (const [name, nodeId] of Object.entries(wanted)) {
    await new Promise((r) => setTimeout(r, 8000));
    const render = await fetch(
      `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(nodeId)}&format=png&scale=2`,
      { headers: { "X-Figma-Token": token } },
    );
    if (!render.ok) {
      console.warn(name, await render.text());
      continue;
    }
    const data = await render.json();
    const url = data.images?.[nodeId];
    if (!url) {
      console.warn("no url", name);
      continue;
    }
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    await writeFile(path.join(outDir, `${name}.png`), buf);
    console.log("saved", name);
  }

  await writeFile(path.join(outDir, "fills.json"), JSON.stringify(images, null, 2));
  let i = 0;
  for (const [ref, url] of Object.entries(images ?? {})) {
    if (i >= 6) break;
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    await writeFile(path.join(outDir, `fill-${ref.slice(0, 12)}.png`), buf);
    console.log("fill", ref.slice(0, 12));
    i++;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});