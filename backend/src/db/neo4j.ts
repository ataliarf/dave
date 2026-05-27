import neo4j, { type Driver, type Session } from "neo4j-driver";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";

let driver: Driver | null = null;

export function getNeo4jDriver(): Driver {
  if (!driver) {
    driver = neo4j.driver(env.NEO4J_URI, neo4j.auth.basic(env.NEO4J_USER, env.NEO4J_PASSWORD), {
      maxConnectionPoolSize: 50,
      connectionAcquisitionTimeout: 60_000,
    });
  }
  return driver;
}

export function withSession<T>(fn: (session: Session) => Promise<T>): Promise<T> {
  const session = getNeo4jDriver().session();
  return fn(session).finally(() => session.close());
}

export async function verifyNeo4jConnectivity(): Promise<void> {
  await getNeo4jDriver().verifyConnectivity();
}

export async function closeNeo4j(): Promise<void> {
  if (driver) {
    try {
      await driver.close();
    } catch (err) {
      logger.error({ err }, "failed to close Neo4j driver");
    }
    driver = null;
  }
}
