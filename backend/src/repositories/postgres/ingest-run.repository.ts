import { Prisma } from "@prisma/client";
import type { IngestRun, IngestStatus, IngestSummary } from "@dave/shared";
import { prisma } from "../../db/prisma.js";
import { ConflictError } from "../../lib/errors.js";

function toDomain(row: {
  id: string;
  startedAt: Date;
  finishedAt: Date | null;
  status: string;
  summary: Prisma.JsonValue | null;
}): IngestRun {
  return {
    id: row.id,
    startedAt: row.startedAt.toISOString(),
    finishedAt: row.finishedAt ? row.finishedAt.toISOString() : null,
    status: row.status as IngestStatus,
    summary: (row.summary as IngestSummary | null) ?? null,
  };
}

export class IngestRunRepository {
  /**
   * Create a new run row in 'running' state. The DB-level partial unique
   * index on (status) WHERE status = 'running' enforces "at most one
   * in-flight run" — concurrent callers see a unique violation, which we
   * translate into a 409.
   */
  async createRunning(): Promise<IngestRun> {
    try {
      const row = await prisma.ingestRun.create({
        data: { status: "running" },
      });
      return toDomain(row);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictError("an ingest run is already in progress");
      }
      throw err;
    }
  }

  async finalize(
    id: string,
    status: Exclude<IngestStatus, "running">,
    summary: IngestSummary,
  ): Promise<IngestRun> {
    const row = await prisma.ingestRun.update({
      where: { id },
      data: {
        status,
        summary: summary as unknown as Prisma.InputJsonValue,
        finishedAt: new Date(),
      },
    });
    return toDomain(row);
  }

  async findLatest(): Promise<IngestRun | null> {
    const row = await prisma.ingestRun.findFirst({
      orderBy: { startedAt: Prisma.SortOrder.desc },
    });
    return row ? toDomain(row) : null;
  }
}
