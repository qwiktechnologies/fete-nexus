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

const jobs = [
  ["10:800", "hero.png"],
  ["26:169", "collage-main.png"],
  ["26:187", "collage-fleet.png"],
  ["81:34", "logo-figma.png"],
];

async function main() {
  const token = await loadToken();
  await mkdir(outDir, { recursive: true });

  for (const [id, file] of jobs) {
    await new Promise((r) => setTimeout(r, 65000));
    const res = await fetch(
      `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(id)}&format=png&scale=2`,
      { headers: { "X-Figma-Token": token } },
    );
    const body = await res.json();
    if (!res.ok) throw new Error(`${file} ${res.status} ${JSON.stringify(body)}`);
    const url = body.images?.[id];
    if (!url) throw new Error(`no url ${file}`);
    await writeFile(path.join(outDir, file), Buffer.from(await (await fetch(url)).arrayBuffer()));
    console.log("ok", file);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});