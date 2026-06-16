#!/usr/bin/env node
/**
 * Norco College Course Catalog Parser
 *
 * Usage:
 *   node scripts/parse-catalog.mjs path/to/catalog.pdf > catalog.json
 *
 * Requires pdftotext (poppler-utils). On macOS: brew install poppler
 * On Replit / Linux: already available.
 *
 * Outputs JSON array of { code, title, units, prerequisite, description }
 * Upload the output file in Admin → Course Catalog to update the app.
 */
import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve } from "path";

const pdfPath = process.argv[2];
if (!pdfPath) {
  console.error("Usage: node scripts/parse-catalog.mjs path/to/catalog.pdf");
  process.exit(1);
}

const absPath = resolve(pdfPath);
if (!existsSync(absPath)) {
  console.error(`File not found: ${absPath}`);
  process.exit(1);
}

process.stderr.write(`Extracting text from ${absPath}...\n`);
const text = execSync(`pdftotext "${absPath}" -`, { maxBuffer: 50 * 1024 * 1024 }).toString();
const lines = text.split("\n");

const CODE_RE = /^([A-Z]{2,6})-([A-Z]?\d+[A-Z]?\d*[A-Z]?)$/;
const courses = [];
let i = 0;

while (i < lines.length) {
  const raw = lines[i].trim();
  if (!CODE_RE.test(raw)) { i++; continue; }

  const code = raw;
  i++;

  while (i < lines.length && lines[i].trim() === "") i++;
  if (i >= lines.length) break;
  const titleLine = lines[i].trim();
  if (/^\d+\.\d+/.test(titleLine) || CODE_RE.test(titleLine)) continue;
  const title = titleLine;
  i++;

  while (i < lines.length && lines[i].trim() === "") i++;
  if (i >= lines.length) break;
  const unitsLine = lines[i].trim();
  const unitsMatch = unitsLine.match(/^([\d.]+(?:[-\u2013][\d.]+)?)\s+Units?/i);
  if (!unitsMatch) continue;
  const units = parseFloat(unitsMatch[1].split(/[-\u2013]/)[0]);
  i++;

  const blockLines = [];
  while (i < lines.length) {
    const bl = lines[i].trim();
    if (CODE_RE.test(bl)) break;
    if (/^\d{1,4}$/.test(bl) && blockLines.length > 3) { i++; continue; }
    blockLines.push(lines[i]);
    i++;
    const joined = blockLines.join(" ");
    if (/\(Letter grade|Pass\/No Pass only\)/.test(joined)) break;
  }

  const block = blockLines.join("\n");
  const prereqM = block.match(/Prerequisite:\s*([\s\S]+?)(?=\n(?:Advisory:|Description:|Limitation|$))/);
  const descM = block.match(/Description:\s*([\s\S]+)/);
  const prerequisite = prereqM ? prereqM[1].replace(/\s+/g, " ").trim() : "";
  const description = descM ? descM[1].replace(/\s+/g, " ").trim().replace(/\s*\d{1,4}\s*$/, "") : "";

  if (!title) continue;
  courses.push({ code, title, units, prerequisite, description });
}

process.stderr.write(`Parsed ${courses.length} courses.\n`);
process.stdout.write(JSON.stringify(courses, null, 2) + "\n");
