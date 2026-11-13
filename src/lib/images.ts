import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

/** Images bundled in /public/images, offered as suggestions in the editor. */
export async function listImages() {
  try {
    const files = await fs.readdir(path.join(process.cwd(), "public", "images"));
    return files.filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f)).sort().map((f) => `/images/${f}`);
  } catch {
    return [];
  }
}
