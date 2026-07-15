#!/usr/bin/env node
/**
 * update-progress.mjs
 *
 * Reads the root README.md, counts completed/total exercises per part,
 * updates the progress-summary table and each <details> summary count,
 * then writes the file back.
 *
 * Usage:  node scripts/update-progress.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const README_PATH = resolve(__dirname, '..', 'README.md');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fail(msg) {
  console.error(`\nERROR: ${msg}\n`);
  process.exit(1);
}

/**
 * Parse a checkbox line and return the exercise part number (0-7) if it
 * matches a tracked exercise, or null otherwise.
 *
 * Matches lines like:
 *   - [ ] **[1.1: Course Information, step 1](...)**
 *   - [x] **[4.5\*: Helper Functions...](...)** — Optional
 *   - [ ] **[Exercise 6.16](...)**
 *   - [x] **[7.11: Zustand, Step 1](...)**
 *
 * Returns { part: number, completed: boolean } or null.
 */
function parseExerciseLine(line) {
  // Must start with "- [ ]" or "- [x]"
  const checkboxMatch = line.match(/^-\s+\[([ xX])\]\s+/);
  if (!checkboxMatch) return null;

  const completed = checkboxMatch[1].toLowerCase() === 'x';

  // Look for exercise number patterns inside the link text or bare:
  //   [N.M: title], [N.M\*: title], [N.M title], Exercise N.M
  // Strategy: find the first occurrence of "N.M" where N is 0-7.
  // Exclude matches inside URLs (after "http" or after "/part").
  const stripped = line
    .replace(/https?:\/\/[^\s)"]*/g, '')   // remove URLs
    .replace(/\/en\/part\d[^\s)"']*/g, ''); // remove path fragments

  const numMatch = stripped.match(/\b([0-7])\.(\d+)\b/);
  if (!numMatch) return null;

  return { part: parseInt(numMatch[1], 10), completed };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

let content = readFileSync(README_PATH, 'utf8');

// Verify required markers exist
if (!content.includes('<!-- progress-summary:start -->')) {
  fail('Could not find <!-- progress-summary:start --> marker in README.md');
}
if (!content.includes('<!-- progress-summary:end -->')) {
  fail('Could not find <!-- progress-summary:end --> marker in README.md');
}

// ── Count exercises per part ────────────────────────────────────────────────

// We count inside each <details> block so that alternative exercise lines
// (7.11 Zustand AND 7.11 React Query) are treated as separate checkboxes.
const partStats = {};
for (let p = 0; p <= 7; p++) {
  partStats[p] = { completed: 0, total: 0 };
}

// Track which detail block we are in
let inDetails = false;
let currentDetailPart = null;

const lines = content.split('\n');
for (const line of lines) {
  if (line.startsWith('<details>')) {
    inDetails = true;
    currentDetailPart = null;
    continue;
  }
  if (line.startsWith('</details>')) {
    inDetails = false;
    currentDetailPart = null;
    continue;
  }

  if (!inDetails) continue;

  // Detect which part this <details> belongs to from the <summary> line
  if (line.includes('<summary>') && currentDetailPart === null) {
    const partMatch = line.match(/Part\s+([0-7])\b/);
    if (partMatch) currentDetailPart = parseInt(partMatch[1], 10);
  }

  const ex = parseExerciseLine(line);
  if (ex !== null && currentDetailPart !== null) {
    // Only count exercises that match the part of the enclosing <details>
    if (ex.part === currentDetailPart) {
      partStats[currentDetailPart].total += 1;
      if (ex.completed) partStats[currentDetailPart].completed += 1;
    }
  }
}

// ── Build updated progress table ─────────────────────────────────────────────

const partTopics = {
  0: 'Fundamentals of Web apps',
  1: 'Introduction to React',
  2: 'Communicating with server',
  3: 'Programming a server with NodeJS and Express',
  4: 'Testing Express servers, user administration',
  5: 'Testing React apps',
  6: 'Advanced state management',
  7: 'React router, custom hooks, styling app with CSS',
};

let totalCompleted = 0;
let totalExercises = 0;
for (let p = 0; p <= 7; p++) {
  totalCompleted += partStats[p].completed;
  totalExercises += partStats[p].total;
}

const tableRows = [];
tableRows.push('| Part | Topic | Completed | Total | Progress |');
tableRows.push('| ---- | ----- | --------: | ----: | -------: |');

for (let p = 0; p <= 7; p++) {
  const { completed, total } = partStats[p];
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  tableRows.push(`| ${p} | ${partTopics[p]} | ${completed} | ${total} | ${pct}% |`);
}

const totalPct = totalExercises > 0 ? Math.round((totalCompleted / totalExercises) * 100) : 0;
tableRows.push(`| **Total** | | **${totalCompleted}** | **${totalExercises}** | **${totalPct}%** |`);

const newTable = tableRows.join('\n');

// Replace content between markers
content = content.replace(
  /<!-- progress-summary:start -->[\s\S]*?<!-- progress-summary:end -->/,
  `<!-- progress-summary:start -->\n${newTable}\n<!-- progress-summary:end -->`
);

// ── Update each <details> summary count ─────────────────────────────────────

content = content.replace(
  /(<summary><strong>Part (\d) [^<]+<\/strong> — )\d+\/\d+(<\/summary>)/g,
  (match, prefix, partStr, suffix) => {
    const p = parseInt(partStr, 10);
    if (p >= 0 && p <= 7) {
      const { completed, total } = partStats[p];
      return `${prefix}${completed}/${total}${suffix}`;
    }
    return match;
  }
);

// ── Write back ───────────────────────────────────────────────────────────────

writeFileSync(README_PATH, content, 'utf8');

// ── Terminal report ───────────────────────────────────────────────────────────

console.log('\n📊 Full Stack Open — Progress Report');
console.log('─'.repeat(60));
console.log(`${'Part'.padEnd(6)} ${'Topic'.padEnd(47)} ${'Done'.padStart(4)} ${'Total'.padStart(5)} ${'%'.padStart(4)}`);
console.log('─'.repeat(60));

for (let p = 0; p <= 7; p++) {
  const { completed, total } = partStats[p];
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const topic = partTopics[p].length > 45
    ? partTopics[p].slice(0, 42) + '...'
    : partTopics[p];
  console.log(
    `Part ${p}  ${topic.padEnd(47)} ${String(completed).padStart(4)} ${String(total).padStart(5)} ${String(pct + '%').padStart(4)}`
  );
}

console.log('─'.repeat(60));
const totalPctFinal = totalExercises > 0 ? Math.round((totalCompleted / totalExercises) * 100) : 0;
console.log(
  `${'TOTAL'.padEnd(54)} ${String(totalCompleted).padStart(4)} ${String(totalExercises).padStart(5)} ${String(totalPctFinal + '%').padStart(4)}`
);
console.log('─'.repeat(60));
console.log('\n✅ README.md updated successfully.\n');
