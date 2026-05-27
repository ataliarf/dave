import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { closeNeo4j, verifyNeo4jConnectivity } from "./db/neo4j.js";
import { disconnectPrisma, prisma } from "./db/prisma.js";
import { logger } from "./lib/logger.js";

async function bootstrap(): Promise<void> {
  await prisma.$connect();
  logger.info("Postgres connected");

  await verifyNeo4jConnectivity();
  logger.info("Neo4j connected");

  const app = createApp();
  const server = app.listen(env.BACKEND_PORT, () => {
    logger.info({ port: env.BACKEND_PORT }, "backend listening");
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info({ signal }, "shutting down");
    server.close();
    await Promise.all([disconnectPrisma(), closeNeo4j()]);
    process.exit(0);
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

bootstrap().catch((err) => {
  logger.fatal({ err }, "bootstrap failed");
  process.exit(1);
});
