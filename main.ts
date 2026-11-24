// Seventeen Syllables of Debugging — writes the haiku to /output/entry.txt.
// Node 22, standard library only. The entry is three lines, 5-7-5 syllables,
// at most 200 characters, plain text.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const haiku = readFileSync(new URL("./entry.txt", import.meta.url), "utf8");
const body = haiku.trim();
const lines = body.split("\n");

if (lines.length !== 3) {
  console.error(`haiku must be exactly three lines, got ${lines.length}`);
  process.exit(1);
}
if (body.length < 1 || body.length > 200) {
  console.error(`entry must be 1-200 characters, got ${body.length}`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), haiku, "utf8");
console.log(`wrote ${body.length}-character haiku to ${join(outDir, "entry.txt")}`);
