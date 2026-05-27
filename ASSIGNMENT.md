# dave.io Engineering Home Assignment

Welcome, and thanks for taking the time. This document is the full brief.

## About dave.io

dave.io is an **AI-native DevOps service** company. We embed a real human DevOps engineer (in your timezone and language) alongside **Dave**, our proprietary AI system that plugs into a customer's infrastructure and SDLC and executes tasks at machine speed. Customers get the judgment of a senior engineer with the throughput of a system that never sleeps.

## What this assignment is

We'd like you to build a thin slice of a real product feature — something we can actually run, click around, and reason about with you.

There's boilerplate in this repository — `docker-compose.yml` for the two stores, and the artifacts in `data/`. Everything else is up to you: pick the backend and frontend stacks you'd actually reach for, and lay them out the way you'd lay out a real codebase.

## The problem

A new dave.io customer wants Dave to help them operate a sprawling microservice system. Before Dave can act intelligently, the customer (and their assigned human DevOps engineer) needs to **see and understand what's actually running**: which services exist, how they call each other, who owns them, and what's been on fire lately.

The customer hands us a snapshot of their environment as a set of static artifacts (provided in [`data/`](./data/)). Your job is to turn those into a usable product surface.

Build a feature that:

1. **Ingests** the artifacts into the two stores we provide:
   - The **service graph** — services and the dependencies between them — into **Neo4j**.
   - The **operational metadata** — incidents — into **Postgres**.

   We expect you to write this ingest layer, not hand-load fixtures. Re-ingesting must be something the user can trigger from the UI.

2. **Exposes a read API** for the frontend. At minimum:
   - The **topology** for the canvas. Server-side filtering matters once the graph isn't tiny.
   - A **single-service** endpoint that composes graph data (the node + its neighbors) with relational data (recent incidents) into one response. This is the cross-store read.
   - A **blast-radius** endpoint for a given service: which services depend on it (upstream) and which it depends on (downstream). Done in the graph store, not by walking edges in app code.
3. **Visualizes the topology** in a frontend using a graph layout library (e.g., React Flow / xyflow), with custom node rendering that makes tier and team legible at a glance.
4. **Lets the user explore.** Filter by team and tier. Click a service to see its details and incidents. Toggle a "blast radius" view that highlights upstream/downstream paths from the selected service.
5. **Communicates state to the user** throughout: ingest progress, data freshness, ability to re-ingest, empty states, partial-failure states (e.g., `incidents.csv` failed to parse but the graph loaded fine — say so, don't hide it).

A single-tenant version is the target. If you want to gesture at caching, idempotent re-ingest, scale, or production robustness as you build, great — it's a bonus, not a requirement. We'll ask about it in the interview either way.

## Artifact schemas

The files in `data/` are realistic representations of what a customer might hand us. The formats are deliberately mixed.

**`data/services.jsonl`** — one service per line:

```json
{
  "id": "auth-service",
  "name": "Auth Service",
  "team": "platform",
  "tier": "critical",
  "language": "go",
  "repo": "github.com/acme/auth-service"
}
```

`tier` is one of `critical`, `standard`, `experimental`.

**`data/dependencies.jsonl`** — one directed edge per line, from a caller to a callee:

```json
{ "from": "api-gateway", "to": "auth-service", "type": "sync_http", "criticality": "high" }
```

`type` is one of `sync_http`, `async_queue`, `db_read`, `db_write`. `criticality` is one of `high`, `medium`, `low`.

**`data/incidents.csv`** — header + rows. `resolved_at` may be empty for ongoing incidents.

```csv
id,service_id,started_at,resolved_at,severity,title
```

`severity` is one of `sev1` (highest) through `sev4` (lowest).

## What's already in the box

```
.
├── README.md                       <- this file
├── docker-compose.yml              <- Neo4j + Postgres, ready to `docker compose up`
├── .env.example                    <- env vars referenced by compose
└── data/                           <- static artifacts to ingest
    ├── services.jsonl
    ├── dependencies.jsonl
    └── incidents.csv
```

## Getting started

```bash
cp .env.example .env
docker compose up -d

# Neo4j browser:  http://localhost:7474   (user: neo4j, password: see .env)
# Postgres:       localhost:5432          (db/user/password: see .env)
```

Then bring up your own backend and frontend, point them at the env vars in `.env`, and start building. Both stores come up empty — populating them is part of the assignment.

## Deliverables

One thing we need: **a runnable project**. We should be able to clone, follow your README, and see the feature work end-to-end against the artifacts in `data/`.

Optionally, a short walkthrough video (Loom or similar) where you show the thing running and talk us through the choices you made. Not required at all — but some candidates find it the easiest way to communicate the parts that don't show up in code.

## Definition of done

A sanity check, not a checklist to game:

- Someone can clone the repo, follow your README, and get the feature running.
- The five things in "The problem" are addressed — in code, or in a short note explaining why you skipped them.
- The frontend handles the obvious UX states (loading, empty, stale, partial failure, error) in some recognizable way.
- Both stores are being used for the thing they're each good at, and you can defend the split.

## How we'll evaluate

We're a small team, so we read submissions carefully and talk about them together. A few things we tend to notice:

- Whether the decisions feel like ones you'd defend in production, not just on a take-home.
- Whether the running thing actually does what your README says it does.
- Whether your data model and DTOs hold up — the graph-store shape, the relational shape, and the composed read shape the frontend consumes are three different things, and we'll look at how cleanly that's separated.
- Whether the UX makes sense to a real user — does it tell them what's happening, what's stale, what failed?
- How you handle the edges — partial failures, re-ingest semantics, graphs that aren't tiny.
- Anything you noticed about the brief itself that we got wrong, missed, or could have asked better.

We're not grading on visual polish, framework name-dropping, or lines of code. Build the thing you'd build for a real customer.

## Ground rules

Use AI tools as much as you like — we do. Be creative. Build something a real user would actually want to use.

## Submission

Send a link (Drive / Dropbox / GitHub) to gal@dave.io with the subject line **"dave.io Engineering Assignment — Atalia"**.

We'll respond within 48 hours with next steps.

Good luck — we're looking forward to seeing what you build.

— The dave.io team
