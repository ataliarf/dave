-- CreateTable
CREATE TABLE "incidents" (
    "id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "resolved_at" TIMESTAMP(3),
    "severity" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ingest_runs" (
    "id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finished_at" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "summary" JSONB,

    CONSTRAINT "ingest_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "incidents_service_id_idx" ON "incidents"("service_id");

-- CreateIndex
CREATE INDEX "incidents_started_at_idx" ON "incidents"("started_at" DESC);

-- CreateIndex
CREATE INDEX "ingest_runs_started_at_idx" ON "ingest_runs"("started_at" DESC);
