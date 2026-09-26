import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

const server = app.listen(env.PORT, "0.0.0.0", () => {
  logger.info(
    { port: env.PORT, firebaseProjectId: env.projectId, emulators: env.useEmulators },
    `Kallayani API listening on http://localhost:${env.PORT}`,
  );
});

function shutdown(signal: string) {
  logger.info({ signal }, "Shutting down Kallayani API");
  server.close((error) => {
    if (error) {
      logger.error({ error }, "Graceful shutdown failed");
      process.exitCode = 1;
    }
  });
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
