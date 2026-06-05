#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), {recursive: true});
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function main() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'dashboard-external-'));
  await fs.mkdir(path.join(tempRoot, 'scripts'), {recursive: true});
  await fs.copyFile(
    path.join(repoRoot, 'scripts', 'local-dashboard-build.mjs'),
    path.join(tempRoot, 'scripts', 'local-dashboard-build.mjs'),
  );

  await writeJson(path.join(tempRoot, 'data', 'github-repositories.json'), [
    {
      id: 1,
      name: 'owned',
      nameWithOwner: 'htazq/owned',
      description: 'owned repo',
      isPrivate: true,
      isFork: false,
      isArchived: false,
      primaryLanguage: {name: 'JavaScript'},
      updatedAt: '2026-05-01T00:00:00Z',
      url: 'https://github.com/htazq/owned',
    },
  ]);
  await writeJson(path.join(tempRoot, 'data', 'cnb-authenticated-repositories.json'), []);
  await writeJson(path.join(tempRoot, 'data', 'github-self-created-latest-commits.json'), [
    {
      repository: 'other/project',
      visibility: 'public',
      language: 'TypeScript',
      sha: 'abc1234567890',
      shortSha: 'abc1234',
      date: '2026-06-01T12:00:00Z',
      authorName: 'htazq',
      message: 'fix: contribute upstream patch',
      url: 'https://github.com/other/project/commit/abc1234567890',
    },
  ]);
  await writeJson(path.join(tempRoot, 'data', 'github-authored-prs.json'), [
    {
      title: 'fix: contribute upstream patch',
      number: 42,
      url: 'https://github.com/other/project/pull/42',
      state: 'merged',
      merged: true,
      mergedAt: '2026-06-01T12:30:00Z',
      createdAt: '2026-06-01T11:00:00Z',
      updatedAt: '2026-06-01T12:30:00Z',
      repository: {
        name: 'project',
        nameWithOwner: 'other/project',
      },
    },
  ]);
  await writeJson(path.join(tempRoot, 'public', 'data', 'repo-category-rules.json'), {
    categories: [{name: '其他', keywords: []}],
    overrides: {},
  });

  const result = spawnSync(process.execPath, ['scripts/local-dashboard-build.mjs', '--public'], {
    cwd: tempRoot,
    env: {
      ...process.env,
      LOCAL_DASHBOARD_USE_API: '0',
      GH_OWNER: 'htazq',
      CNB_USER: 'htazq',
    },
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  const feed = JSON.parse(await fs.readFile(path.join(tempRoot, 'public', 'data', 'dashboard-feed.json'), 'utf8'));
  const external = feed.repositories.find((repo) => repo.fullName === 'other/project');
  const privateOwned = feed.repositories.find((repo) => repo.fullName === 'htazq/owned');
  const maskedOwned = feed.repositories.find((repo) => repo.fullName.startsWith('htazq/private-'));

  assert.ok(external, 'external contribution repository should be included');
  assert.equal(external.isExternalContribution, true);
  assert.equal(external.latestCommit?.sha, 'abc1234567890');
  assert.equal(external.contribution?.latest?.number, 42);
  assert.equal(privateOwned, undefined, 'public feed should not expose private repository names');
  assert.ok(maskedOwned, 'public feed should retain private repositories only as masked aliases');
  assert.equal(feed.source.github.repos, 2);
}

await main();
