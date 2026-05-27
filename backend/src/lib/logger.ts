import { pino } from "pino";
import { env, isDev } from "../config/env.js";

export const logger = pino({
  level: env.LOG_LEVEL,
  ...(isDev
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "SYS:HH:MM:ss.l" },
        },
      }
    : {}),
});
