import { config as loadDotenv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

loadDotenv({ path: path.resolve(__dirname, "../../../.env") });
loadDotenv({ path: path.resolve(__dirname, "../../.env"), override: false });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  BACKEND_PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),

  DATABASE_URL: z.string().url(),

  NEO4J_URI: z.string().min(1),
  NEO4J_USER: z.string().min(1),
  NEO4J_PASSWORD: z.string().min(8),

  INGEST_DATA_DIR: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

export const isProd = env.NODE_ENV === "production";
export const isDev = env.NODE_ENV === "development";

export function resolveDataDir(): string {
  return path.isAbsolute(env.INGEST_DATA_DIR)
    ? env.INGEST_DATA_DIR
    : path.resolve(process.cwd(), env.INGEST_DATA_DIR);
}
