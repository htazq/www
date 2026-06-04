#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const outputDir = path.join(repoRoot, 'public', 'data');
const outputJson = path.join(outputDir, 'dashboard-feed.json');
const outputCsv = path.join(outputDir, 'dashboard-feed.csv');
const rulePath = path.join(outputDir, 'repo-category-rules.json');

const GH_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const CNB_TOKEN = process.env.CNB_TOKEN || process.env.CNB_PERSONAL_TOKEN || '';
const GH_OWNER = process.env.GH_OWNER || 'htazq';
const CNB_USER = process.env.CNB_USER || process.env.CNB_USER_ID || 'htazq';
const STALE_DAYS = Number(process.env.STALE_DAYS || '90');
const ACTIVE_DAYS = Number(process.env.ACTIVE_DAYS || '14');
const USE_API = process.env.LOCAL_DASHBOARD_USE_API !== '0';
const INCLUDE_FORKS = process.env.INCLUDE_FORKS === '1';
const GITHUB_SELF_ONLY = process.env.GITHUB_SELF_ONLY === '1';

const githubFallbackPath = path.join(repoRoot, 'data', 'github-repositories.json');
const cnbFallbackPath = path.join(repoRoot, 'data', 'cnb-authenticated-repositories.json');
const githubSelfCreatedCommitsPath = path.join(repoRoot, 'data', 'github-self-created-latest-commits.json');
const githubAuthoredPrsPath = path.join(repoRoot, 'data', 'github-authored-prs.json');

function normalizeRepoKey(inputOwner, inputName) {
  const owner = String(inputOwner || '').trim().toLowerCase();
  const name = String(inputName || '').trim().toLowerCase();
  return `${owner}/${name}`;
}

function parseHttpDate(dateText) {
  if (!dateText) {
    return null;
  }
  const d = new Date(dateText);
  return Number.isNaN(d.valueOf()) ? null : d;
}

function daysSince(dateText) {
  const d = parseHttpDate(dateText);
  if (!d) {
    return Number.MAX_SAFE_INTEGER;
  }
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function toArray(value) {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function toOwnerRepoKey(value) {
  if (!value) {
    return '';
  }
  if (typeof value === 'string') {
    const [owner, name] = value.toLowerCase().split('/');
    return owner && name ? `${owner}/${name}` : '';
  }
  return '';
}

function splitOwnerRepo(value) {
  if (!value) {
    return null;
  }
  const [owner, name] = String(value).split('/');
  if (!owner || !name) {
    return null;
  }
  return {owner, name};
}

function mapStatus(daysSinceActive) {
  if (daysSinceActive <= ACTIVE_DAYS) {
    return 'active';
  }
  if (daysSinceActive <= STALE_DAYS) {
    return 'watch';
  }
  return 'stale';
}

function safeLoadJson(filePath) {
  return fs.readFile(filePath, 'utf8')
    .then((raw) => {
      const normalized = String(raw).replace(/^\uFEFF/, '');
      return JSON.parse(normalized);
    })
    .catch(() => null);
}

async function requestJson(url, headers = {}) {
  const response = await fetch(url, {headers});
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  return {status: response.status, ok: response.ok, payload, headers: response.headers};
}

function makeGitHubHeaders() {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'local-dashboard-builder',
  };
  if (GH_TOKEN) {
    headers.Authorization = `token ${GH_TOKEN}`;
  }
  return headers;
}

function encodeGitHubRepoPath(fullName) {
  const [owner, name] = String(fullName || '').split('/');
  if (!owner || !name) {
    return '';
  }
  return `${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
}

function extractCnbItems(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  if (Array.isArray(payload?.items)) {
    return payload.items;
  }
  if (Array.isArray(payload?.records)) {
    return payload.records;
  }
  if (Array.isArray(payload?.data?.items)) {
    return payload.data.items;
  }
  if (Array.isArray(payload?.data?.records)) {
    return payload.data.records;
  }
  return [];
}

function parseGitHubLinkHeader(header = '') {
  if (!header) {
    return {};
  }
  const links = {};
  for (const part of header.split(',')) {
    const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (!match) {
      continue;
    }
    links[match[2]] = match[1];
  }
  return links;
}

function mergeText(item) {
  const raw = [
    item.name,
    item.description,
    item.fullName,
    item.topics?.join(' '),
    item.language,
    item.site,
    item.license,
    item.tags,
    item.homepage,
    item.path,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return raw;
}

function pickCategory(item, rules) {
  const text = mergeText(item);
  let bestCategory = '其他';
  let bestScore = 0;

  for (const rule of rules.categories) {
    let score = 0;
    for (const keyword of rule.keywords) {
      if (keyword && text.includes(String(keyword).toLowerCase())) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = rule.name;
    }
  }

  const override = rules.overrides?.[normalizeRepoKey(item.owner || item.ownerLogin, item.name)];
  if (override) {
    bestCategory = override;
    bestScore = Math.max(bestScore, 1);
  }

  return {category: bestCategory, confidence: Math.min(bestScore, 5) / 5};
}

function ensureLatest(items) {
  return items
    .map((item) => {
      const lastActiveAt = item.lastActiveAt || item.pushedAt || item.updatedAt;
      const dayGap = daysSince(lastActiveAt);
      return {
        ...item,
        lastActiveAt,
        daysSinceActive: dayGap,
        key: normalizeRepoKey(item.owner, item.name),
        status: mapStatus(dayGap),
        isPrivate: Boolean(item.isPrivate),
      };
    })
    .filter((item) => item.name)
    .sort((a, b) => {
      const aTime = parseHttpDate(a.lastActiveAt)?.getTime() || 0;
      const bTime = parseHttpDate(b.lastActiveAt)?.getTime() || 0;
      return bTime - aTime;
    });
}

function toCsvCell(value) {
  const escaped = String(value ?? '').replace(/"/g, '""');
  return `"${escaped}"`;
}

function writeCsvFeed(items) {
  const headers = [
    'repository',
    'platforms',
    'category',
    'status',
    'days_since_active',
    'is_private',
    'last_active_at',
    'committed_at',
    'latest_pr',
    'url',
  ];
  const rows = [headers.join(',')];
  for (const item of items) {
    rows.push([
      toCsvCell(item.fullName || `${item.owner}/${item.name}`),
      toCsvCell(item.platforms.join(',')),
      toCsvCell(item.category),
      toCsvCell(item.status),
      item.daysSinceActive,
      item.isPrivate ? 'true' : 'false',
      toCsvCell(item.lastActiveAt),
      toCsvCell(item.latestCommit?.committedAt || ''),
      toCsvCell(item.contribution?.latest?.title || ''),
      toCsvCell(item.primaryUrl),
    ].join(','));
  }
  return `${rows.join('\n')}\n`;
}

function mergeRepoMap(items) {
  const repoMap = new Map();

  for (const item of items) {
    const key = normalizeRepoKey(item.owner, item.name);
    if (!repoMap.has(key)) {
      repoMap.set(key, {
        ...item,
        platforms: [item.platform],
        primaryUrl: item.url,
        sources: [
          {
            platform: item.platform,
            isPrivate: item.isPrivate,
            visibility: item.visibility || (item.isPrivate ? 'Private' : 'Public'),
            url: item.url,
            updatedAt: item.lastActiveAt || item.updatedAt || item.pushedAt,
          },
        ],
        metrics: {
          stars: item.stats?.stars || 0,
          forks: item.stats?.forks || 0,
          openIssues: item.stats?.openIssues || 0,
        },
      });
      continue;
    }

    const old = repoMap.get(key);
    old.platforms = old.platforms.includes(item.platform) ? old.platforms : [...old.platforms, item.platform];
    old.sources.push({
      platform: item.platform,
      isPrivate: item.isPrivate,
      visibility: item.visibility || (item.isPrivate ? 'Private' : 'Public'),
      url: item.url,
      updatedAt: item.lastActiveAt || item.updatedAt || item.pushedAt,
    });

    old.metrics.stars += item.stats?.stars || 0;
    old.metrics.forks += item.stats?.forks || 0;
    old.metrics.openIssues += item.stats?.openIssues || 0;

    const itemActiveTime = parseHttpDate(item.lastActiveAt || item.updatedAt || item.pushedAt)?.getTime() || 0;
    const oldActiveTime = parseHttpDate(old.lastActiveAt || old.updatedAt || old.pushedAt)?.getTime() || 0;
    if (itemActiveTime > oldActiveTime) {
      old.lastActiveAt = item.lastActiveAt || item.updatedAt || item.pushedAt;
      old.primaryUrl = item.url;
      old.daysSinceActive = daysSince(old.lastActiveAt);
      old.status = mapStatus(old.daysSinceActive);
    }

    const itemCommit = item.latestCommit;
    if (itemCommit && (!old.latestCommit || new Date(itemCommit.committedAt).getTime() > new Date(old.latestCommit.committedAt).getTime())) {
      old.latestCommit = itemCommit;
    }

    if (item.contribution && (!old.contribution || item.contribution.total > (old.contribution.total || 0))) {
      old.contribution = item.contribution;
    }

    old.isPrivate = old.sources.every((source) => source.isPrivate);
  }

  return Array.from(repoMap.values());
}

function toBoardRepo(item, rules) {
  const {category, confidence} = pickCategory(item, rules);
  return {
    key: item.key,
    owner: item.owner,
    name: item.name,
    fullName: item.fullName,
    category,
    categoryConfidence: Number(confidence.toFixed(2)),
    status: item.status,
    statusText: item.status === 'active' ? '活跃' : item.status === 'watch' ? '关注' : '沉默',
    daysSinceActive: item.daysSinceActive,
    lastActiveAt: item.lastActiveAt,
    latestCommit: item.latestCommit || null,
    contribution: item.contribution || null,
    isPrivate: item.isPrivate,
    description: item.description || '',
    platforms: item.platforms,
    primaryUrl: item.primaryUrl,
    sources: item.sources,
    metrics: item.metrics,
    language: item.language || '',
    topics: item.topics || [],
    homepage: item.homepage || '',
    isExternalContribution: Boolean(item.isExternalContribution),
  };
}

function buildBoard(items, rules, sourceMeta) {
  const normalized = ensureLatest(mergeRepoMap(items));
  const withCategory = normalized.map((item) => {
    const {category, confidence} = pickCategory(item, rules);
    item.category = category;
    item.categoryConfidence = Number(confidence.toFixed(2));
    item.status = mapStatus(item.daysSinceActive);
    return item;
  });

  const categoryCounter = {};
  const statusCounter = {active: 0, watch: 0, stale: 0};
  const sourceCounter = {
    github: {total: 0, private: 0, public: 0},
    cnb: {total: 0, private: 0, public: 0},
  };

  for (const repo of withCategory) {
    categoryCounter[repo.category] = (categoryCounter[repo.category] || 0) + 1;
    statusCounter[repo.status] += 1;
    for (const source of repo.sources) {
      if (!sourceCounter[source.platform]) {
        sourceCounter[source.platform] = {total: 0, private: 0, public: 0};
      }
      sourceCounter[source.platform].total += 1;
      if (source.visibility === 'Private') {
        sourceCounter[source.platform].private += 1;
      } else {
        sourceCounter[source.platform].public += 1;
      }
    }
  }

  const categories = Object.entries(categoryCounter)
    .map(([name, count]) => ({name, count}))
    .sort((a, b) => b.count - a.count);

  return {
    generatedAt: new Date().toISOString(),
    source: {
      github: {
        configured: Boolean(GH_TOKEN),
        usedApi: sourceMeta.githubUsedApi,
        repos: sourceMeta.githubCount,
      },
      cnb: {
        configured: Boolean(CNB_TOKEN),
        usedApi: sourceMeta.cnbUsedApi,
        repos: sourceMeta.cnbCount,
      },
    },
    filters: {
      activeDays: ACTIVE_DAYS,
      staleDays: STALE_DAYS,
      owner: GH_OWNER,
      cnbUser: CNB_USER,
      includeForks: INCLUDE_FORKS,
      githubSelfOnly: GITHUB_SELF_ONLY,
    },
    summary: {
      total: withCategory.length,
      mirrorAcrossPlatforms: withCategory.filter((item) => item.sources.length > 1).length,
      externalContributions: withCategory.filter((item) => item.isExternalContribution).length,
      byCategory: categories,
      byStatus: statusCounter,
      bySource: sourceCounter,
      staleRepos: withCategory.filter((item) => item.status === 'stale').length,
      activeRepos: withCategory.filter((item) => item.status === 'active').length,
      watchRepos: withCategory.filter((item) => item.status === 'watch').length,
    },
    topByStale: withCategory.filter((item) => item.status === 'stale').slice(0, 20),
    repositories: withCategory.map((item) => toBoardRepo(item, rules)),
  };
}

function deSensitizeBoard(originalBoard) {
  const board = JSON.parse(JSON.stringify(originalBoard));
  const categoryCounters = {};
  const keyToObfuscatedName = new Map();
  
  function getObfuscatedName(repo) {
    const key = repo.key;
    if (keyToObfuscatedName.has(key)) {
      return keyToObfuscatedName.get(key);
    }
    const cat = repo.category || '其他';
    categoryCounters[cat] = (categoryCounters[cat] || 0) + 1;
    const catAliasMap = {
      'AI': 'ai',
      '金融': 'finance',
      '脚本': 'script',
      '网站': 'web',
      '工具': 'tool',
      '其他': 'misc'
    };
    const alias = catAliasMap[cat] || 'project';
    const num = String(categoryCounters[cat]).padStart(2, '0');
    const obfuscated = `htazq/private-${alias}-${num}`;
    keyToObfuscatedName.set(key, obfuscated);
    return obfuscated;
  }

  const cleanRepo = (repo) => {
    if (!repo.isPrivate) return;
    const obName = getObfuscatedName(repo);
    repo.key = obName.toLowerCase();
    repo.fullName = obName;
    repo.name = obName.split('/')[1];
    repo.description = '自用资产，已做元数据脱敏保护';
    repo.primaryUrl = repo.platforms.includes('github') 
      ? 'https://github.com/htazq' 
      : 'https://cnb.cool/htazq';
    
    if (repo.latestCommit) {
      repo.latestCommit.message = '最近有代码更新';
      repo.latestCommit.author = 'htazq';
      repo.latestCommit.url = '';
    }
    if (repo.contribution) {
      repo.contribution.latest = repo.contribution.latest ? {
        number: 0,
        title: '已合并分支贡献',
        state: repo.contribution.latest.state || 'merged',
        updatedAt: repo.contribution.latest.updatedAt || '',
        url: ''
      } : null;
    }
    repo.sources = repo.sources.map(src => ({
      ...src,
      url: src.platform === 'github' ? 'https://github.com/htazq' : 'https://cnb.cool/htazq'
    }));
  };

  for (const repo of board.repositories) {
    cleanRepo(repo);
  }
  for (const repo of board.topByStale) {
    cleanRepo(repo);
  }

  return board;
}

function normalizeGitHubFromApi(repo) {
  return {
    platform: 'github',
    platformId: String(repo.id || ''),
    owner: repo.owner.login,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || '',
    visibility: repo.private ? 'Private' : 'Public',
    isPrivate: Boolean(repo.private),
    isFork: Boolean(repo.fork),
    isArchived: Boolean(repo.archived),
    language: repo.language || '',
    topics: toArray(repo.topics),
    createdAt: repo.created_at || '',
    updatedAt: repo.updated_at || '',
    pushedAt: repo.pushed_at || '',
    homepage: repo.homepage || '',
    path: repo.full_name || '',
    license: repo.license?.key || '',
    tags: toArray(repo.topics),
    site: '',
    url: repo.html_url || '',
    cloneUrl: repo.clone_url || '',
    stats: {
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      openIssues: repo.open_issues_count || 0,
    },
  };
}

function normalizeGithubFallback(repo) {
  return {
    platform: 'github',
    platformId: String(repo.id || ''),
    owner: (repo.nameWithOwner || '/').split('/')[0],
    name: repo.name || '',
    fullName: repo.nameWithOwner || '',
    description: repo.description || '',
    visibility: repo.isPrivate ? 'Private' : 'Public',
    isPrivate: Boolean(repo.isPrivate),
    isFork: Boolean(repo.isFork),
    isArchived: Boolean(repo.isArchived),
    language: repo.primaryLanguage?.name || repo.language || '',
    topics: toArray(repo.topics),
    createdAt: repo.createdAt || '',
    updatedAt: repo.updatedAt || '',
    pushedAt: repo.updatedAt || '',
    homepage: repo.homepage || '',
    path: repo.nameWithOwner || '',
    license: '',
    tags: toArray(repo.topics),
    site: '',
    url: repo.url || '',
    cloneUrl: '',
    stats: {stars: 0, forks: 0, openIssues: 0},
    lastActiveAt: repo.updatedAt || '',
  };
}

function normalizeCnbRepo(item) {
  const ownerName = String(item.path || '')
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .toLowerCase();
  const [owner, name] = ownerName.split('/');
  return {
    platform: 'cnb',
    platformId: String(item.id || item.repo_id || ''),
    owner,
    name,
    fullName: ownerName,
    description: item.description || '',
    visibility: item.visibility_level || (item.private ? 'Private' : 'Public'),
    isPrivate: (item.visibility_level || '').toLowerCase() === 'private' || item.private === true,
    isFork: false,
    isArchived: false,
    language: item.languages?.language || item.language || '',
    topics: toArray(item.tags || item.topics),
    createdAt: item.created_at || '',
    updatedAt: item.updated_at || item.last_updated_at || '',
    pushedAt: item.last_updated_at || item.updated_at || '',
    homepage: item.site || '',
    path: item.path || ownerName,
    license: '',
    tags: toArray(item.tags),
    site: item.site || '',
    url: item.web_url || '',
    cloneUrl: '',
    stats: {
      stars: item.star_count || 0,
      forks: item.fork_count || 0,
      openIssues: item.open_issue_count || 0,
    },
  };
}

async function fetchAllGitHubRepos() {
  if (!USE_API) {
    console.warn('[GitHub API] 跳过: USE_API=' + USE_API);
    return [];
  }

  const headers = makeGitHubHeaders();
  const repos = [];
  let next = GH_TOKEN
    ? 'https://api.github.com/user/repos?per_page=100&page=1&sort=updated&direction=desc&affiliation=owner'
    : `https://api.github.com/users/${encodeURIComponent(GH_OWNER)}/repos?per_page=100&page=1&sort=updated&direction=desc`;

  console.log('[GitHub API] 开始调用, GH_OWNER=' + GH_OWNER + ', INCLUDE_FORKS=' + INCLUDE_FORKS + ', GH_TOKEN=' + (GH_TOKEN ? '已设置' : '未设置'));

  while (next) {
    const {ok, payload, headers: responseHeaders, status} = await requestJson(next, headers);
    if (!ok) {
      throw new Error(`GitHub API 请求失败: ${status} ${payload?.message || ''}`.trim());
    }
    const rows = Array.isArray(payload) ? payload : [];
    const normalized = rows
      .filter((repo) => repo?.name && repo?.owner?.login)
      .filter((repo) => repo.owner.login.toLowerCase() === GH_OWNER.toLowerCase())
      .filter((repo) => (INCLUDE_FORKS ? true : !repo.fork))
      .map(normalizeGitHubFromApi)
      .filter((repo) => !GITHUB_SELF_ONLY || !repo.isFork);

    repos.push(...normalized);
    const parsed = parseGitHubLinkHeader(responseHeaders.get('link'));
    next = parsed.next || '';
  }

  return repos;
}

async function fetchGithubLatestCommit(fullName, headers) {
  const repoPath = encodeGitHubRepoPath(fullName);
  if (!repoPath) {
    return null;
  }
  try {
    const {ok, payload} = await requestJson(
      `https://api.github.com/repos/${repoPath}/commits?per_page=1`,
      headers,
    );
    if (!ok || !Array.isArray(payload) || payload.length === 0) {
      return null;
    }
    const commit = payload[0];
    return {
      sha: commit.sha || '',
      message: commit.commit?.message || '',
      committedAt: commit.commit?.committer?.date || commit.commit?.author?.date || '',
      author: commit.commit?.author?.name || '',
      url: commit.html_url || '',
    };
  } catch {
    return null;
  }
}

async function fetchGitHubWithCommits(repositories) {
  if (!USE_API) {
    return repositories;
  }
  const headers = makeGitHubHeaders();
  const result = [];
  for (const repo of repositories) {
    const latestCommit = await fetchGithubLatestCommit(repo.fullName, headers);
    result.push({
      ...repo,
      lastActiveAt: latestCommit?.committedAt || repo.pushedAt || repo.updatedAt,
      latestCommit,
    });
  }
  return result;
}

async function fetchGitHubPrDetail(url, headers) {
  if (!url) {
    return null;
  }
  try {
    const {ok, payload} = await requestJson(url, headers);
    return ok ? payload : null;
  } catch {
    return null;
  }
}

async function fetchGitHubAuthoredPrs() {
  if (!USE_API) {
    return [];
  }

  const headers = makeGitHubHeaders();
  const rows = [];
  let next = `https://api.github.com/search/issues?q=${encodeURIComponent(`author:${GH_OWNER} type:pr`)}&sort=updated&order=desc&per_page=100`;

  console.log('[GitHub PR API] 开始调用, GH_OWNER=' + GH_OWNER + ', GH_TOKEN=' + (GH_TOKEN ? '已设置' : '未设置'));

  while (next && rows.length < 100) {
    const {ok, payload, headers: responseHeaders, status} = await requestJson(next, headers);
    if (!ok) {
      throw new Error(`GitHub PR API 请求失败: ${status} ${payload?.message || ''}`.trim());
    }

    const items = Array.isArray(payload?.items) ? payload.items : [];
    for (const item of items) {
      const repoFullName = String(item.repository_url || '').split('/repos/')[1] || '';
      if (!repoFullName) {
        continue;
      }

      const detail = await fetchGitHubPrDetail(item.pull_request?.url, headers);
      const mergedAt = detail?.merged_at || null;
      const [, repoName = ''] = repoFullName.split('/');

      rows.push({
        title: item.title || '',
        number: item.number,
        url: item.html_url || '',
        state: mergedAt ? 'merged' : (item.state || ''),
        merged: Boolean(mergedAt),
        mergedAt,
        createdAt: item.created_at || '',
        updatedAt: item.updated_at || '',
        repository: {
          name: repoName,
          nameWithOwner: repoFullName,
        },
        repositoryDetails: detail?.base?.repo ? normalizeGitHubFromApi(detail.base.repo) : null,
      });
    }

    const parsed = parseGitHubLinkHeader(responseHeaders.get('link'));
    next = rows.length < 100 ? (parsed.next || '') : '';
  }

  return rows;
}

function normalizeGitHubCommitSearchItem(item) {
  const repo = item.repository || null;
  const repoFullName = repo?.full_name || String(item.html_url || '').split('/commit/')[0].replace('https://github.com/', '');
  if (!repoFullName || !repoFullName.includes('/')) {
    return null;
  }

  const sha = item.sha || '';
  return {
    repository: repoFullName,
    visibility: repo?.private ? 'private' : 'public',
    language: repo?.language || '',
    sha,
    shortSha: sha.slice(0, 7),
    date: item.commit?.committer?.date || item.commit?.author?.date || '',
    authorName: item.commit?.author?.name || item.author?.login || '',
    authorEmail: item.commit?.author?.email || '',
    message: item.commit?.message || '',
    url: item.html_url || '',
    repositoryDetails: repo ? normalizeGitHubFromApi(repo) : null,
  };
}

async function fetchGitHubAuthoredCommits() {
  if (!USE_API) {
    return [];
  }

  const headers = {
    ...makeGitHubHeaders(),
    Accept: 'application/vnd.github.cloak-preview+json',
  };
  const rows = [];
  let next = `https://api.github.com/search/commits?q=${encodeURIComponent(`author:${GH_OWNER}`)}&sort=committer-date&order=desc&per_page=100`;

  console.log('[GitHub Commit API] 开始调用, GH_OWNER=' + GH_OWNER + ', GH_TOKEN=' + (GH_TOKEN ? '已设置' : '未设置'));

  while (next && rows.length < 100) {
    const {ok, payload, headers: responseHeaders, status} = await requestJson(next, headers);
    if (!ok) {
      throw new Error(`GitHub Commit API 请求失败: ${status} ${payload?.message || ''}`.trim());
    }

    const items = Array.isArray(payload?.items) ? payload.items : [];
    for (const item of items) {
      const normalized = normalizeGitHubCommitSearchItem(item);
      if (normalized) {
        rows.push(normalized);
      }
    }

    const parsed = parseGitHubLinkHeader(responseHeaders.get('link'));
    next = rows.length < 100 ? (parsed.next || '') : '';
  }

  return rows;
}

function buildContributionMeta(prRows) {
  const map = new Map();
  for (const item of prRows) {
    const repoKey = toOwnerRepoKey(item.repository?.nameWithOwner || item.repository);
    if (!repoKey) {
      continue;
    }
    if (!map.has(repoKey)) {
      map.set(repoKey, []);
    }
    map.get(repoKey).push(item);
  }

  const out = new Map();
  for (const [key, rows] of map.entries()) {
    const sorted = [...rows].sort((a, b) => String(b.updatedAt || b.createdAt || '').localeCompare(String(a.updatedAt || a.createdAt || '')));
    const latest = sorted[0];
    out.set(key, {
      total: sorted.length,
      opened: sorted.filter((item) => item.state === 'open').length,
      merged: sorted.filter((item) => item.state === 'merged').length,
      closed: sorted.filter((item) => item.state === 'closed' && item.merged !== true).length,
      latest: latest
        ? {
            number: latest.number,
            title: latest.title || '',
            state: latest.state || '',
            updatedAt: latest.updatedAt || latest.createdAt || '',
            url: latest.url || '',
          }
        : null,
    });
  }
  return out;
}

function buildCommitMeta(commitRows) {
  const out = new Map();
  for (const item of commitRows) {
    const repoKey = toOwnerRepoKey(item.repository);
    if (!repoKey) {
      continue;
    }
    const current = out.get(repoKey);
    if (!current || (item.date && (!current.committedAt || item.date > current.committedAt))) {
      out.set(repoKey, {
        sha: item.sha || '',
        shortSha: item.shortSha || '',
        message: item.message || '',
        committedAt: item.date || '',
        author: item.authorName || '',
        url: item.url || '',
      });
    }
  }
  return out;
}

function maxDateText(values) {
  return values
    .filter(Boolean)
    .sort((a, b) => (parseHttpDate(b)?.getTime() || 0) - (parseHttpDate(a)?.getTime() || 0))[0] || '';
}

function addContributionRepoInfo(map, rawFullName, details, fallback = {}) {
  const parsed = splitOwnerRepo(rawFullName);
  if (!parsed) {
    return;
  }
  const key = normalizeRepoKey(parsed.owner, parsed.name);
  if (!map.has(key)) {
    map.set(key, {
      owner: parsed.owner,
      name: parsed.name,
      fullName: `${parsed.owner}/${parsed.name}`,
      details: null,
      visibility: '',
      language: '',
    });
  }

  const info = map.get(key);
  if (!info.details && details) {
    info.details = details;
  }
  if (!info.visibility && fallback.visibility) {
    info.visibility = fallback.visibility;
  }
  if (!info.language && fallback.language) {
    info.language = fallback.language;
  }
}

function buildExternalContributionRepos(commitRows, prRows, commitMap, contributionMap, existingRepos) {
  const existingKeys = new Set(existingRepos.map((repo) => normalizeRepoKey(repo.owner, repo.name)));
  const repoInfo = new Map();

  for (const item of commitRows) {
    addContributionRepoInfo(repoInfo, item.repository, item.repositoryDetails, {
      visibility: item.visibility,
      language: item.language,
    });
  }

  for (const item of prRows) {
    addContributionRepoInfo(repoInfo, item.repository?.nameWithOwner || item.repository, item.repositoryDetails);
  }

  return Array.from(repoInfo.entries())
    .filter(([key]) => !existingKeys.has(key) && !key.startsWith(`${GH_OWNER.toLowerCase()}/`))
    .map(([key, info]) => {
      const details = info.details || null;
      const latestCommit = commitMap.get(key) || null;
      const contribution = contributionMap.get(key) || null;
      const visibility = details?.visibility || (String(info.visibility).toLowerCase() === 'private' ? 'Private' : 'Public');
      const isPrivate = details?.isPrivate ?? visibility.toLowerCase() === 'private';
      const fullName = details?.fullName || info.fullName;
      const lastActiveAt = maxDateText([
        latestCommit?.committedAt,
        contribution?.latest?.updatedAt,
        details?.pushedAt,
        details?.updatedAt,
      ]);

      return {
        platform: 'github',
        platformId: details?.platformId || '',
        owner: details?.owner || info.owner,
        name: details?.name || info.name,
        fullName,
        description: details?.description || '外部贡献项目',
        visibility,
        isPrivate,
        isFork: Boolean(details?.isFork),
        isArchived: Boolean(details?.isArchived),
        language: details?.language || info.language || '',
        topics: details?.topics || [],
        createdAt: details?.createdAt || '',
        updatedAt: details?.updatedAt || lastActiveAt,
        pushedAt: details?.pushedAt || lastActiveAt,
        homepage: details?.homepage || '',
        path: details?.path || fullName,
        license: details?.license || '',
        tags: details?.tags || [],
        site: details?.site || '',
        url: details?.url || `https://github.com/${fullName}`,
        cloneUrl: details?.cloneUrl || '',
        stats: details?.stats || {stars: 0, forks: 0, openIssues: 0},
        lastActiveAt,
        latestCommit,
        contribution,
        isExternalContribution: true,
      };
    })
    .filter((repo) => repo.latestCommit || repo.contribution);
}

async function fetchAllCnbRepos() {
  if (!USE_API || !CNB_TOKEN) {
    console.warn('[CNB API] 跳过: USE_API=' + USE_API + ', CNB_TOKEN=' + (CNB_TOKEN ? '已设置(' + CNB_TOKEN.length + '字符)' : '未设置'));
    return [];
  }

  const headers = {
    Authorization: `Bearer ${CNB_TOKEN}`,
    Accept: 'application/json',
    'User-Agent': 'local-dashboard-builder',
  };

  const endpointList = [
    `https://api.cnb.cool/users/${encodeURIComponent(CNB_USER)}/repos`,
    `https://api.cnb.cool/api/v1/users/${encodeURIComponent(CNB_USER)}/repos`,
    `https://api.cnb.cool/user/repos`,
    `https://api.cnb.cool/api/v1/user/repos`,
  ];

  for (const endpoint of endpointList) {
    try {
      const items = [];
      for (let page = 1; page <= 20; page += 1) {
        const separator = endpoint.includes('?') ? '&' : '?';
        const url = `${endpoint}${separator}type=all&per_page=100&page_size=100&page=${page}`;
        const {ok, payload} = await requestJson(url, headers);
        if (!ok || !payload) {
          break;
        }

        const pageItems = extractCnbItems(payload);
        if (pageItems.length === 0) {
          break;
        }

        items.push(...pageItems);
        if (pageItems.length < 100) {
          break;
        }
      }

      const normalized = items
        .map(normalizeCnbRepo)
        .filter((repo) => repo.owner && repo.name);
      if (normalized.length > 0) {
        return normalized;
      }
    } catch (err) {
      console.error('[CNB API] endpoint 失败:', endpoint, err.message);
      continue;
    }
  }
  return [];
}

function applyEnrichments(repo, commitMap, contributionMap) {
  if (repo.platform !== 'github') {
    return repo;
  }
  const key = normalizeRepoKey(repo.owner, repo.name);
  if (!repo.latestCommit) {
    repo.latestCommit = commitMap.get(key) || null;
    if (repo.lastActiveAt === '') {
      repo.lastActiveAt = repo.latestCommit?.committedAt || repo.pushedAt || repo.updatedAt;
    }
  }
  if (!repo.contribution) {
    repo.contribution = contributionMap.get(key) || null;
  }
  return repo;
}

async function fetchDataFromSources() {
  const sourceMeta = {
    githubUsedApi: false,
    cnbUsedApi: false,
    githubCount: 0,
    cnbCount: 0,
  };

  let githubRepos = [];
  let cnbRepos = [];

  try {
    const apiRepos = await fetchAllGitHubRepos();
    if (apiRepos.length > 0) {
      sourceMeta.githubUsedApi = true;
      githubRepos = apiRepos;
    } else {
      console.warn('[GitHub API] 返回了 0 个仓库 — 可能 token 权限不足或 affiliation=owner 过滤掉了所有结果');
    }
  } catch (err) {
    console.error('[GitHub API] 请求失败，将回退到离线快照:', err.message);
    githubRepos = [];
  }

  if (githubRepos.length === 0) {
    const local = await safeLoadJson(githubFallbackPath);
    if (Array.isArray(local) && local.length > 0) {
      githubRepos = local.filter((repo) => repo?.nameWithOwner).map(normalizeGithubFallback);
      if (!INCLUDE_FORKS) {
        githubRepos = githubRepos.filter((repo) => !repo.isFork);
      }
      if (GITHUB_SELF_ONLY) {
        githubRepos = githubRepos.filter((repo) => !repo.isFork);
      }
    }
  }

  if (USE_API && githubRepos.length > 0) {
    githubRepos = await fetchGitHubWithCommits(githubRepos);
  }

  try {
    const apiRepos = await fetchAllCnbRepos();
    if (apiRepos.length > 0) {
      sourceMeta.cnbUsedApi = true;
      cnbRepos = apiRepos;
    }
  } catch (err) {
    console.error('[CNB API] 请求失败，将回退到离线快照:', err.message);
    cnbRepos = [];
  }

  if (cnbRepos.length === 0) {
    const local = await safeLoadJson(cnbFallbackPath);
    if (Array.isArray(local) && local.length > 0) {
      cnbRepos = local
        .filter((repo) => repo?.path)
        .map(normalizeCnbRepo)
        .filter((repo) => repo.owner && repo.name);
    }
  }

  let commitRows = [];
  try {
    commitRows = await fetchGitHubAuthoredCommits();
  } catch (err) {
    console.error('[GitHub Commit API] 请求失败，将回退到离线快照:', err.message);
  }
  if (commitRows.length === 0) {
    commitRows = (await safeLoadJson(githubSelfCreatedCommitsPath)) || [];
  }

  let prRows = [];
  try {
    prRows = await fetchGitHubAuthoredPrs();
  } catch (err) {
    console.error('[GitHub PR API] 请求失败，将回退到离线快照:', err.message);
  }
  if (prRows.length === 0) {
    prRows = (await safeLoadJson(githubAuthoredPrsPath)) || [];
  }
  const commitMap = buildCommitMeta(Array.isArray(commitRows) ? commitRows : []);
  const contributionMap = buildContributionMeta(Array.isArray(prRows) ? prRows : []);

  githubRepos = githubRepos.map((repo) => applyEnrichments(repo, commitMap, contributionMap));
  githubRepos.push(...buildExternalContributionRepos(
    Array.isArray(commitRows) ? commitRows : [],
    Array.isArray(prRows) ? prRows : [],
    commitMap,
    contributionMap,
    githubRepos,
  ));

  sourceMeta.githubCount = githubRepos.length;
  sourceMeta.cnbCount = cnbRepos.length;

  return {githubRepos, cnbRepos, sourceMeta};
}

async function loadRules() {
  return (
    (await safeLoadJson(rulePath)) || {
      categories: [
        {
          name: 'AI',
          keywords: [
            'agent',
            'llm',
            'ai',
            'rag',
            'openclaw',
            'prompt',
            'copilot',
            'assistant',
            'model',
            'autotrader',
            'deepseek',
            'qwen',
          ],
        },
        {
          name: '金融',
          keywords: [
            'trade',
            'trading',
            'finance',
            'financial',
            'quant',
            'mt5',
            'stock',
            'trader',
            'arbitrage',
            'exchange',
            'market',
            'crypto',
            'sentiment',
          ],
        },
        {
          name: '脚本',
          keywords: ['script', 'scripts', 'cli', 'automation', 'auto', 'tool', 'batch', 'workflow', 'bot', 'chrome'],
        },
        {
          name: '网站',
          keywords: ['blog', 'site', 'web', 'frontend', 'react', 'vue', 'html', 'css', 'vite', 'page', 'portal', 'dashboard'],
        },
        {
          name: '工具',
          keywords: ['tool', 'utils', 'util', 'proxy', 'ip', 'docker', 'monitor', 'image', 'mirror'],
        },
        {
          name: '其他',
          keywords: [],
        },
      ],
      overrides: {},
    }
  );
}

async function main() {
  const rules = await loadRules();
  const {githubRepos, cnbRepos, sourceMeta} = await fetchDataFromSources();
  const originalBoard = buildBoard([...githubRepos, ...cnbRepos], rules, sourceMeta);
  
  // 生成脱敏版 Board
  const publicBoard = deSensitizeBoard(originalBoard);
  const isPublicBuild = process.argv.includes('--public');
  
  // 根据是否为 --public 确定主写入数据
  const activeBoard = isPublicBuild ? publicBoard : originalBoard;
  const csvText = writeCsvFeed(activeBoard.repositories);

  await fs.mkdir(outputDir, {recursive: true});
  
  // 敏感 Token 拦截防护网
  const jsonText = `${JSON.stringify(activeBoard, null, 2)}\n`;
  const sensitiveEnvKeys = ['TOKEN', 'SECRET', 'PASSWORD', 'KEY', 'API_KEY', 'AUTH'];
  const sensitivePatterns = [
    /(?:ghp|gho|ghu|ghs|ghr)_[a-zA-Z0-9_]{20,}/,
    /eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/,
  ];
  
  for (const pattern of sensitivePatterns) {
    if (pattern.test(jsonText)) {
      throw new Error(`[CRITICAL SECURITY ALERT] 检测到敏感 Token 特征字样！已强行拦截以防止任何泄露！匹配正则: ${pattern}`);
    }
  }

  for (const [key, val] of Object.entries(process.env)) {
    const isSensitiveName = sensitiveEnvKeys.some(sk => key.toUpperCase().includes(sk));
    if (isSensitiveName && val && val.trim().length > 5) {
      if (jsonText.includes(val)) {
        throw new Error(`[CRITICAL SECURITY ALERT] 发现 JSON 内容中包含了敏感环境变量 process.env.${key} 的值！已强力拦截以确保数据安全！`);
      }
    }
  }

  // 写入主文件 (如果 --public, 写入脱敏版; 否则写入包含私有信息的完整版)
  await fs.writeFile(outputJson, jsonText, 'utf8');
  await fs.writeFile(outputCsv, csvText, 'utf8');

  // 始终生成一份明确带 -public 后缀的文件备份
  const publicJson = path.join(outputDir, 'dashboard-feed-public.json');
  const publicCsv = path.join(outputDir, 'dashboard-feed-public.csv');
  await fs.writeFile(publicJson, `${JSON.stringify(publicBoard, null, 2)}\n`, 'utf8');
  await fs.writeFile(publicCsv, writeCsvFeed(publicBoard.repositories), 'utf8');

  console.log(`[Build] Mode: ${isPublicBuild ? '🚨 公网生产脱敏版' : '🔑 本地开发完整版'}`);
  console.log(`local-dashboard 已生成: ${outputJson}`);
  console.log(`仓库数量: ${activeBoard.summary.total} (私有仓库数: ${activeBoard.summary.bySource?.github?.private + activeBoard.summary.bySource?.cnb?.private || 0})`);
  console.log(`GitHub API: ${sourceMeta.githubUsedApi ? '已使用' : '未使用(离线快照)'}`);
  console.log(`CNB API: ${sourceMeta.cnbUsedApi ? '已使用' : '未使用(离线快照)'}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
