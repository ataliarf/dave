#!/usr/bin/env node
// Thin shim around morpheus4j: loads the repo .env, splits NEO4J_URI into the
// MORPHEUS_* host/port/scheme triple morpheus expects, and forwards the
// requested subcommand (migrate / info / validate / ...).

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadDotenv } from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(__dirname, "..");
const repoRoot = path.resolve(backendDir, "..");

loadDotenv({ path: path.join(repoRoot, ".env") });
loadDotenv({ path: path.join(backendDir, ".env"), override: false });

const { NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD } = process.env;

if (!NEO4J_URI || !NEO4J_USER || !NEO4J_PASSWORD) {
  console.error(
    "[neo4j-migrate] NEO4J_URI, NEO4J_USER and NEO4J_PASSWORD must be set (see .env.example).",
  );
  process.exit(1);
}

let parsed;
try {
  parsed = new URL(NEO4J_URI);
} catch {
  console.error(`[neo4j-migrate] NEO4J_URI is not a valid URL: ${NEO4J_URI}`);
  process.exit(1);
}

const scheme = parsed.protocol.replace(/:$/, "");
const host = parsed.hostname;
const port = parsed.port || (scheme.startsWith("neo4j") || scheme.startsWith("bolt") ? "7687" : "");

if (!scheme || !host || !port) {
  console.error(
    `[neo4j-migrate] could not derive scheme/host/port from NEO4J_URI=${NEO4J_URI}`,
  );
  process.exit(1);
}

const migrationsPath = path.join(backendDir, "neo4j", "migrations");
if (!existsSync(migrationsPath)) {
  console.error(`[neo4j-migrate] migrations directory missing: ${migrationsPath}`);
  process.exit(1);
}

const [, , subcommand = "migrate", ...rest] = process.argv;

const child = spawn("morpheus", [subcommand, ...rest], {
  stdio: "inherit",
  cwd: backendDir,
  env: {
    ...process.env,
    MORPHEUS_SCHEME: scheme,
    MORPHEUS_HOST: host,
    MORPHEUS_PORT: port,
    MORPHEUS_USERNAME: NEO4J_USER,
    MORPHEUS_PASSWORD: NEO4J_PASSWORD,
    MORPHEUS_MIGRATIONS_PATH: migrationsPath,
  },
});

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
