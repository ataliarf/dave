import { PrismaClient } from "@prisma/client";
import { env, isProd } from "../config/env.js";
import { logger } from "../lib/logger.js";

export const prisma = new PrismaClient({
  log: isProd ? ["error", "warn"] : ["error", "warn"],
  datasources: { db: { url: env.DATABASE_URL } },
});

export async function disconnectPrisma(): Promise<void> {
  try {
    await prisma.$disconnect();
  } catch (err) {
    logger.error({ err }, "failed to disconnect Prisma");
  }
}
