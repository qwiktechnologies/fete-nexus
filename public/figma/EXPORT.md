# Figma assets (Home frame `2:5`)

If the API rate limit blocks auto-export, export these from Figma and save **exact filenames**:

| File | Figma layer |
|------|-------------|
| `home/hero.png` | **Header Image** (hero photo) |
| `home/collage-main.png` | Large photo in **Who we are** |
| `home/collage-fleet.png` | Fleet / depot photo |
| `brand/logo.png` | **FETE NEXUS Logo for web_page** in header |

Export at **2x PNG**, then hard-refresh the site.

Or run one at a time (wait ~2 min between):

```bash
node scripts/figma-render-one-arg.mjs hero
node scripts/figma-render-one-arg.mjs logo
node scripts/figma-render-one-arg.mjs collage-main
node scripts/figma-render-one-arg.mjs collage-fleet
```

## About frame `53:8`

| File | Figma layer |
|------|-------------|
| `about/fleet.png` | **Fete Nexus fleet** (hero) |
| `about/crew.png` | **Careful handling by the removals team** |

```bash
node scripts/figma-render-one-arg.mjs about-fleet
node scripts/figma-render-one-arg.mjs about-crew
```