# dave.io assignment — Atalia

Brief: [`ASSIGNMENT.md`](./ASSIGNMENT.md).

## Run it

Prereqs: Docker, Node >= 22, pnpm >= 10.

```bash
cp .env.example .env
docker compose up -d
pnpm install
pnpm prisma:generate && pnpm prisma:migrate
pnpm dev:all
```

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:3000>

Both stores come up empty. Open the UI and click **Re-ingest** once to load
`data/` into Postgres + Neo4j.

## Environment (`.env`)

Copy `.env.example` to `.env`. The defaults work for local dev — they match

## How the brief is addressed

- **Ingest** — `POST /api/ingest` reads `data/`, writes services + edges to
  Neo4j and incidents to Postgres. Triggered from the UI banner; status polled
  via `GET /api/ingest/status`. Partial failures (e.g. incidents.csv broke,
  graph loaded) are reported, not hidden.
- **Read API**
  - `GET /api/topology` — canvas seed. Filters: `teams`, `tiers`
    (comma-separated), `limit`
  - `GET /api/topology/expand` — neighbours of one node. Params: `nodeId`
    (required), Filters: `teams`, `tiers`
  - `GET /api/services/:id` — cross-store read: node + neighbours +
    recent incidents.
  - `GET /api/services/:id/blast-radius` — upstream + downstream in Cypher,
    not app-code traversal.
  - `GET /api/incidents` — paginated. Filters: `serviceId`,
    `severities` (comma-separated, `sev1`..`sev4`),
    `status` (`ongoing` | `resolved`), `page`, `pageSize`.
  - `GET /api/filters` — distinct teams, tiers, severities, and
    `(id, name)` pairs for the services dropdown. Empty arrays pre-ingest
    drive the "run an ingest" empty state.
- **Visualisation** — `@xyflow/react` canvas with custom node rendering for
  tier + team; legend in `frontend/src/features/topology/Legend.tsx`.
- **Exploration** — filter by team/tier, click for details + incidents,
  blast-radius toggle highlights upstream/downstream.
- **State** — loading skeletons, empty vs no-match copy, stale/partial-failure
  banner, typed `ApiError` with retry.

## Stores

- **Neo4j** — services + directed dependencies. Blast radius is a Cypher
  query.
- **Postgres** — incidents + ingest run history. Prisma-managed schema.
