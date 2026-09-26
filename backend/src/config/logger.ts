import pino from "pino";
import { env } from "./env.js";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (env.isProduction ? "info" : "debug"),
  redact: {
    paths: ["req.headers.authorization", "*.password", "*.token", "*.serviceAccount"],
    censor: "[REDACTED]",
  },
});
