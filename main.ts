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

// Syllable shape (5-7-5): each line must carry its expected count.
// A lone letter counts as one syllable (its spoken name), so "a.m."
// counts as two; a silent trailing "e" does not add a syllable.
function countWordSyllables(word) {
  const letters = word.toLowerCase().replace(/[^a-z]/g, "");
  if (letters.length === 0) return 0;
  if (letters.length === 1) return 1;
  const groups = letters.match(/[aeiouy]+/g) ?? [];
  let count = groups.length;
  if (letters.endsWith("e") && count > 1) count -= 1;
  return Math.max(count, 1);
}

function countSyllablesInLine(line) {
  return line
    .split(/\s+/)
    .flatMap((word) => word.match(/[a-z]+/gi) ?? [])
    .reduce((total, token) => total + countWordSyllables(token), 0);
}

const expectedShape = [5, 7, 5];
for (let i = 0; i < lines.length; i++) {
  const count = countSyllablesInLine(lines[i]);
  if (count !== expectedShape[i]) {
    console.error(
      `haiku line ${i + 1} must have ${expectedShape[i]} syllables, got ${count}`,
    );
    process.exit(1);
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), haiku, "utf8");
console.log(`wrote ${body.length}-character haiku to ${join(outDir, "entry.txt")}`);
