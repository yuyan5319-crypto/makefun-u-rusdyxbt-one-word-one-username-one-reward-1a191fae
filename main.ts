// SPDX-License-Identifier: MIT
// silver-puffin-43 — one word, one username, one reward.
//
// Entry for make.fun's "One Word, One Username, One Reward" bounty.
// The program writes the entrant's own make.fun handle — a single word,
// nothing else — to /output/entry.txt, exactly as the competition asks.
//
// Why this word: the judge's first criterion is that the entry is a real
// make.fun username, the entrant's own handle sent as one word. Anything
// that is not the entrant's own handle loses to one that is. So the only
// honest, rules-fitting entry is the handle itself: silver-puffin-43.
// A silver puffin: small, quick, a little improbable — a handle its owner
// would happily wear, and one that sticks after a single look.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The entrant's own make.fun username, the one word this entry sends.
export const USERNAME = "silver-puffin-43";

// The competition gate: /output/entry.txt must be UTF-8 text of 1 to 30
// characters, not only white space. Our word is 16 characters, no spaces.
export const MAX_ENTRY_CHARS = 30;

export function validateEntry(word: string): void {
  if (word.length < 1 || word.length > MAX_ENTRY_CHARS) {
    throw new Error(
      `entry must be 1 to ${MAX_ENTRY_CHARS} characters, got ${word.length}`,
    );
  }
  if (word.trim().length === 0) {
    throw new Error("entry must not be only white space");
  }
  if (/\s/.test(word)) {
    throw new Error("entry must be a single word with no spaces");
  }
}

export function entryPath(): string {
  // The grader runs the program with /output mounted; honour an override
  // so the same code can be exercised locally without root.
  return process.env.ENTRY_OUTPUT ?? "/output/entry.txt";
}

export function main(): void {
  validateEntry(USERNAME);
  const path = entryPath();
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, USERNAME, "utf8");
  // Read the file back and confirm it is byte-exact: the gate scores the
  // file, not the intent, so a silent short write must fail loudly here.
  const written = readFileSync(path, "utf8");
  if (written !== USERNAME) {
    throw new Error(`verification failed: ${path} holds ${JSON.stringify(written)}`);
  }
  console.log(`wrote ${USERNAME.length}-character entry to ${path}`);
}

main();
