# dave.io assignment — Atalia

Brief: [`ASSIGNMENT.md`](./ASSIGNMENT.md).

## Run it

Prereqs: Docker, Node >= 22, pnpm >= 10.

```bash
cp .env.example .env
docker compose up -d
pnpm install
pnpm prisma:generate && pnpm prisma:migrate
pnpm neo4j:migrate
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

- **Neo4j** — services + directed dependencies. Blast radius is a Cypher query.
- **Postgres** — incidents + ingest run history. Prisma-managed schema.

## Pictures

**Incidents Table**

<img width="1728" height="892" alt="Screenshot 2026-05-27 at 22 44 45" src="https://github.com/user-attachments/assets/af2fe3e0-410a-427b-aa38-900d985ac117" />

**Topology**

<img width="1728" height="892" alt="Screenshot 2026-05-27 at 22 45 03" src="https://github.com/user-attachments/assets/41602dd4-ad6d-4cfe-b68f-c8402f50cc13" />

**Service Details Page**

<img width="1728" height="892" alt="Screenshot 2026-05-27 at 22 46 19" src="https://github.com/user-attachments/assets/12360b00-2d15-40f4-82aa-dc1851a1fea3" />

**Blast Radius Mode**

<img width="1728" height="892" alt="Screenshot 2026-05-27 at 22 46 33" src="https://github.com/user-attachments/assets/1170a8e5-79a6-4cbe-aab7-b6f33d146403" />

**Partial Ingest**
<img width="1728" height="892" alt="Screenshot 2026-05-27 at 22 47 34" src="https://github.com/user-attachments/assets/92031cab-cd8f-4128-840a-a657dd1c0c6d" />
