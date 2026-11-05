import { mkdir, writeFile } from "fs/promises";
import path from "path";

const allowed = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export async function saveJobPhotos(files: File[]) {
  if (files.length > 6) return { error: "You can add up to 6 photographs." as const, urls: [] as string[] };
  const urls: string[] = [];
  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });

  for (const file of files) {
    const extension = allowed.get(file.type);
    if (!extension) return { error: "Photographs must be JPG, PNG or WebP." as const, urls };
    if (file.size > 5 * 1024 * 1024) return { error: "Each photograph must be under 5MB." as const, urls };
    const name = `${crypto.randomUUID()}.${extension}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(directory, name), bytes);
    urls.push(`/uploads/${name}`);
  }

  return { urls };
}

export function photosFromForm(formData: FormData) {
  return formData
    .getAll("images")
    .filter((file): file is File => file instanceof File && file.size > 0);
}
