#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const htmlPath = path.join(repoRoot, 'index.html');
const publicDir = path.join(repoRoot, 'public');
const feedPath = path.join(publicDir, 'data', 'dashboard-feed.json');

function fail(message) {
  console.error(`[dashboard] ${message}`);
  process.exit(1);
}

function resolvePublicAsset(rawAsset) {
  const assetPath = rawAsset.split(/[?#]/, 1)[0];
  if (!assetPath) return null;
  if (assetPath.startsWith('/')) {
    return path.join(publicDir, assetPath.slice(1));
  }
  if (assetPath.startsWith('./data/') || assetPath.startsWith('data/')) {
    return path.join(publicDir, assetPath.replace(/^\.\//, ''));
  }
  return path.resolve(repoRoot, assetPath);
}

async function assertFileExists(filePath, source) {
  try {
    await fs.access(filePath);
  } catch {
    fail(`missing asset referenced by ${source}: ${filePath}`);
  }
}

function assertInlineScriptSyntax(html) {
  const inlineScriptPattern = /<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let inlineScripts = 0;
  for (const match of html.matchAll(inlineScriptPattern)) {
    inlineScripts += 1;
    try {
      new Function(match[1]);
    } catch (error) {
      fail(`inline script #${inlineScripts} has invalid JavaScript: ${error.message}`);
    }
  }
  if (inlineScripts === 0) {
    fail('index.html has no inline script blocks to validate');
  }
}

async function validateHtml() {
  const html = await fs.readFile(htmlPath, 'utf8');
  if (html.includes('__dashboard-config.js')) {
    fail('index.html must not load __dashboard-config.js; EdgeOne fallback returns HTML for that path');
  }
  if (!html.includes('window.__AUTO_REFRESH_MS__')) {
    fail('index.html missing inline window.__AUTO_REFRESH_MS__ config');
  }
  if (!html.includes('id="repoTable"')) {
    fail('repository table must keep id="repoTable" for stable audits');
  }

  const attrPattern = /<[^>]+\b(?:src|href)=["']([^"']+)["']/gi;
  const checkedAssets = [];
  for (const match of html.matchAll(attrPattern)) {
    const rawAsset = match[1].trim();
    if (
      !rawAsset ||
      rawAsset.includes('${') ||
      rawAsset.startsWith('#') ||
      /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(rawAsset)
    ) {
      continue;
    }
    const filePath = resolvePublicAsset(rawAsset);
    if (!filePath) continue;
    if (!filePath.startsWith(repoRoot) && !filePath.startsWith(publicDir)) {
      fail(`asset escapes repository: ${rawAsset}`);
    }
    await assertFileExists(filePath, rawAsset);
    checkedAssets.push(rawAsset);
  }

  assertInlineScriptSyntax(html);
  console.log(`[dashboard] html valid: ${checkedAssets.length} local asset references`);
}

async function validateFeed() {
  let payload;
  try {
    payload = JSON.parse(await fs.readFile(feedPath, 'utf8'));
  } catch (error) {
    fail(`invalid dashboard feed: ${error.message}`);
  }

  if (!payload.generatedAt) {
    fail('dashboard feed missing generatedAt');
  }
  if (!payload.summary || typeof payload.summary.total !== 'number') {
    fail('dashboard feed missing summary.total');
  }
  if (!Array.isArray(payload.repositories)) {
    fail('dashboard feed repositories must be an array');
  }
  if (payload.summary.total !== payload.repositories.length) {
    fail(`summary.total(${payload.summary.total}) != repositories.length(${payload.repositories.length})`);
  }

  for (const repo of payload.repositories) {
    if (!repo.fullName || typeof repo.fullName !== 'string') {
      fail('repository item missing fullName');
    }
    if (!Array.isArray(repo.platforms) || repo.platforms.length === 0) {
      fail(`repository ${repo.fullName} missing platforms`);
    }
    try {
      const url = new URL(repo.primaryUrl);
      if (!['http:', 'https:'].includes(url.protocol)) {
        fail(`repository ${repo.fullName} primaryUrl must be http(s): ${repo.primaryUrl}`);
      }
    } catch {
      fail(`repository ${repo.fullName} primaryUrl invalid: ${repo.primaryUrl}`);
    }
  }

  console.log(`[dashboard] feed valid: ${payload.summary.total} repositories`);
}

await validateHtml();
await validateFeed();
