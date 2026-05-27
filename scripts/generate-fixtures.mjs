#!/usr/bin/env node
import { writeFileSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = resolve(ROOT, "data");

const TARGET_SERVICES = Number(process.env.TARGET_SERVICES ?? 300);
const SEED = Number(process.env.SEED ?? 42);

function makePrng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}
const rand = makePrng(SEED);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const pickWeighted = (entries) => {
  const total = entries.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [v, w] of entries) {
    r -= w;
    if (r <= 0) return v;
  }
  return entries[entries.length - 1][0];
};
const toTitle = (id) =>
  id
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

const ANCHOR_SERVICES = JSON.parse(
  "[" +
    readFileSync(resolve(DATA_DIR, "services.jsonl"), "utf8")
      .split("\n")
      .filter(Boolean)
      .join(",") +
    "]",
);
const ANCHOR_DEPS = JSON.parse(
  "[" +
    readFileSync(resolve(DATA_DIR, "dependencies.jsonl"), "utf8")
      .split("\n")
      .filter(Boolean)
      .join(",") +
    "]",
);

const TEAMS = [
  {
    name: "platform",
    languages: [
      ["go", 4],
      ["typescript", 2],
      ["rust", 1],
    ],
    tierWeights: [
      ["critical", 4],
      ["standard", 5],
      ["experimental", 1],
    ],
    suffixes: [
      "gateway",
      "router",
      "proxy",
      "service",
      "broker",
      "orchestrator",
      "scheduler",
      "dispatcher",
    ],
    prefixes: ["api", "edge", "core", "platform", "mesh", "fleet"],
  },
  {
    name: "identity",
    languages: [
      ["go", 3],
      ["java", 1],
    ],
    tierWeights: [
      ["critical", 6],
      ["standard", 3],
      ["experimental", 1],
    ],
    suffixes: ["service", "verifier", "broker", "cache", "store"],
    prefixes: [
      "auth",
      "sso",
      "jwt",
      "sessions",
      "oauth",
      "tokens",
      "mfa",
      "identity",
      "permissions",
      "rbac",
    ],
  },
  {
    name: "billing",
    languages: [
      ["typescript", 3],
      ["go", 2],
    ],
    tierWeights: [
      ["critical", 4],
      ["standard", 5],
      ["experimental", 1],
    ],
    suffixes: ["service", "worker", "engine", "api"],
    prefixes: [
      "billing",
      "subscription",
      "invoice",
      "invoicing",
      "pricing",
      "plans",
      "coupons",
      "dunning",
      "refunds",
      "tax",
      "usage",
      "metering",
    ],
  },
  {
    name: "payments",
    languages: [
      ["go", 3],
      ["rust", 1],
    ],
    tierWeights: [
      ["critical", 6],
      ["standard", 3],
      ["experimental", 1],
    ],
    suffixes: ["service", "worker", "gateway", "reconciler"],
    prefixes: [
      "payments",
      "cards",
      "ach",
      "wire",
      "sepa",
      "stripe",
      "paypal",
      "crypto",
      "wallet",
      "ledger",
    ],
  },
  {
    name: "growth",
    languages: [
      ["typescript", 5],
      ["python", 1],
    ],
    tierWeights: [
      ["critical", 2],
      ["standard", 6],
      ["experimental", 2],
    ],
    suffixes: ["service", "worker", "pipeline", "web"],
    prefixes: [
      "web",
      "marketing",
      "crm",
      "email",
      "sms",
      "push",
      "campaigns",
      "segments",
      "lifecycle",
      "onboarding",
      "experiments",
      "ab",
      "referral",
    ],
  },
  {
    name: "mobile",
    languages: [
      ["typescript", 2],
      ["kotlin", 2],
      ["swift", 2],
    ],
    tierWeights: [
      ["critical", 3],
      ["standard", 6],
      ["experimental", 1],
    ],
    suffixes: ["bff", "sync", "service", "gateway"],
    prefixes: ["mobile", "ios", "android", "offline", "push-relay", "session-mobile"],
  },
  {
    name: "data",
    languages: [
      ["python", 4],
      ["scala", 1],
      ["java", 1],
    ],
    tierWeights: [
      ["critical", 2],
      ["standard", 6],
      ["experimental", 2],
    ],
    suffixes: ["ingest", "pipeline", "api", "worker", "service", "enricher", "compactor"],
    prefixes: [
      "events",
      "cdc",
      "warehouse",
      "analytics",
      "reporting",
      "metrics",
      "logs",
      "audit",
      "lineage",
      "dbt-runner",
      "kafka-bridge",
    ],
  },
  {
    name: "ml",
    languages: [
      ["python", 6],
      ["go", 1],
    ],
    tierWeights: [
      ["critical", 1],
      ["standard", 4],
      ["experimental", 5],
    ],
    suffixes: ["service", "api", "trainer", "evaluator", "embedder", "ranker"],
    prefixes: [
      "ml",
      "feature-store",
      "recommender",
      "personalization",
      "fraud-model",
      "churn-model",
      "pricing-model",
      "embeddings",
      "forecasting",
      "segmentation",
    ],
  },
  {
    name: "observability",
    languages: [
      ["go", 3],
      ["rust", 1],
    ],
    tierWeights: [
      ["critical", 3],
      ["standard", 6],
      ["experimental", 1],
    ],
    suffixes: ["collector", "aggregator", "shipper", "service"],
    prefixes: [
      "metrics",
      "logs",
      "traces",
      "alerts",
      "incidents",
      "slo",
      "uptime",
      "oncall",
      "pagerduty-bridge",
    ],
  },
  {
    name: "infra",
    languages: [
      ["go", 4],
      ["python", 1],
    ],
    tierWeights: [
      ["critical", 4],
      ["standard", 5],
      ["experimental", 1],
    ],
    suffixes: ["service", "controller", "operator", "agent"],
    prefixes: [
      "secrets",
      "config",
      "feature-flags-infra",
      "service-registry",
      "dns",
      "k8s-bridge",
      "vault",
      "certs",
      "iam",
      "autoscaler",
    ],
  },
  {
    name: "search",
    languages: [
      ["python", 2],
      ["go", 2],
    ],
    tierWeights: [
      ["critical", 2],
      ["standard", 7],
      ["experimental", 1],
    ],
    suffixes: ["service", "indexer", "reranker", "query-builder"],
    prefixes: [
      "search",
      "typeahead",
      "autocomplete",
      "opensearch-bridge",
      "elastic-shim",
      "vector",
      "similarity",
    ],
  },
  {
    name: "notifications",
    languages: [
      ["typescript", 3],
      ["go", 1],
    ],
    tierWeights: [
      ["critical", 2],
      ["standard", 7],
      ["experimental", 1],
    ],
    suffixes: ["service", "worker", "dispatcher", "fanout"],
    prefixes: ["notifications", "inbox", "email-tx", "sms-tx", "webhook", "fcm", "apns", "digest"],
  },
  {
    name: "content",
    languages: [
      ["typescript", 3],
      ["python", 1],
    ],
    tierWeights: [
      ["standard", 7],
      ["experimental", 3],
    ],
    suffixes: ["service", "api", "pipeline", "worker"],
    prefixes: [
      "media",
      "images",
      "video",
      "cdn-bridge",
      "transcoder",
      "thumbnailer",
      "uploader",
      "docs",
      "attachments",
    ],
  },
  {
    name: "integrations",
    languages: [
      ["typescript", 2],
      ["go", 2],
      ["python", 1],
    ],
    tierWeights: [
      ["standard", 7],
      ["experimental", 3],
    ],
    suffixes: ["connector", "webhook", "sync", "service"],
    prefixes: [
      "salesforce",
      "hubspot",
      "zendesk",
      "intercom",
      "slack",
      "github-app",
      "jira",
      "gitlab",
      "datadog-bridge",
      "snowflake-sync",
    ],
  },
  {
    name: "fraud",
    languages: [
      ["go", 2],
      ["python", 2],
    ],
    tierWeights: [
      ["critical", 5],
      ["standard", 4],
      ["experimental", 1],
    ],
    suffixes: ["service", "engine", "classifier", "ruleset"],
    prefixes: [
      "fraud",
      "risk",
      "velocity",
      "blocklist",
      "kyc",
      "aml",
      "sanctions",
      "device-fingerprint",
    ],
  },
];

const services = [];
const usedIds = new Set(ANCHOR_SERVICES.map((s) => s.id));

for (const s of ANCHOR_SERVICES) services.push(s);

let target = TARGET_SERVICES;
while (services.length < target) {
  const team = pick(TEAMS);
  const prefix = pick(team.prefixes);
  const suffix = pick(team.suffixes);
  const id = `${prefix}-${suffix}`;
  if (usedIds.has(id)) continue;
  usedIds.add(id);
  services.push({
    id,
    name: toTitle(id),
    team: team.name,
    tier: pickWeighted(team.tierWeights),
    language: pickWeighted(team.languages),
    repo: `github.com/acme/${id}`,
  });
}

const byTeam = new Map();
for (const s of services) {
  if (!byTeam.has(s.team)) byTeam.set(s.team, []);
  byTeam.get(s.team).push(s);
}

const criticalIds = services.filter((s) => s.tier === "critical").map((s) => s.id);
const standardIds = services.filter((s) => s.tier === "standard").map((s) => s.id);
const platformCriticals = services.filter(
  (s) =>
    s.tier === "critical" && (s.team === "platform" || s.team === "identity" || s.team === "infra"),
);

const DEP_TYPES = [
  ["sync_http", 6],
  ["async_queue", 3],
  ["db_read", 2],
  ["db_write", 1],
];
const CRITICALITY_BY_TIER = {
  critical: [
    ["high", 5],
    ["medium", 3],
    ["low", 1],
  ],
  standard: [
    ["high", 2],
    ["medium", 5],
    ["low", 3],
  ],
  experimental: [
    ["high", 1],
    ["medium", 3],
    ["low", 6],
  ],
};

const edgeKey = (e) => `${e.from}->${e.to}`;
const edges = new Map();
for (const e of ANCHOR_DEPS) edges.set(edgeKey(e), e);

function addEdge(from, to) {
  if (from === to) return;
  const k = `${from}->${to}`;
  if (edges.has(k)) return;
  const fromSvc = services.find((s) => s.id === from);
  edges.set(k, {
    from,
    to,
    type: pickWeighted(DEP_TYPES),
    criticality: pickWeighted(CRITICALITY_BY_TIER[fromSvc?.tier ?? "standard"]),
  });
}

for (const s of services) {
  if (ANCHOR_SERVICES.some((a) => a.id === s.id)) continue;

  const teamPeers = byTeam.get(s.team).filter((p) => p.id !== s.id);
  const intraCount = 1 + Math.floor(rand() * 3);
  for (let i = 0; i < intraCount && teamPeers.length > 0; i++) {
    addEdge(s.id, pick(teamPeers).id);
  }

  const crossCount = Math.floor(rand() * 3);
  for (let i = 0; i < crossCount; i++) {
    const target =
      rand() < 0.6 && platformCriticals.length > 0
        ? pick(platformCriticals)
        : pick(
            rand() < 0.7
              ? services
              : standardIds.length > 0
                ? services.filter((x) => standardIds.includes(x.id))
                : services,
          );
    addEdge(s.id, target.id);
  }

  if (rand() < 0.3 && criticalIds.length > 0) {
    addEdge(s.id, pick(criticalIds));
  }
}

for (const id of criticalIds) {
  const inDegreeBoost = 2 + Math.floor(rand() * 4);
  for (let i = 0; i < inDegreeBoost; i++) {
    addEdge(pick(services).id, id);
  }
}

const servicesOut = services.map((s) => JSON.stringify(s)).join("\n");
const depsOut = Array.from(edges.values())
  .map((e) => JSON.stringify(e))
  .join("\n");

writeFileSync(resolve(DATA_DIR, "services.jsonl"), servicesOut + "\n");
writeFileSync(resolve(DATA_DIR, "dependencies.jsonl"), depsOut + "\n");

console.log(`Wrote ${services.length} services and ${edges.size} dependencies.`);
console.log(`Teams: ${[...byTeam.keys()].sort().join(", ")}`);
console.log(
  `Tiers: critical=${criticalIds.length}, standard=${standardIds.length}, experimental=${services.length - criticalIds.length - standardIds.length}`,
);
