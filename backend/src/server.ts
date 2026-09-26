import { app } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { reconcileExpiredCheckoutReservations } from "./services/payment-service.js";

const reservationReconciliationIntervalMs = 5 * 60_000;

const server = app.listen(env.PORT, "0.0.0.0", () => {
  logger.info(
    { port: env.PORT, firebaseProjectId: env.projectId, emulators: env.useEmulators },
    `Kallayani API listening on http://localhost:${env.PORT}`,
  );
  void reconcileExpiredCheckoutReservations().catch((error) => {
    logger.warn({ error }, "Initial checkout reservation reconciliation failed");
  });
});

const reservationTimer = setInterval(() => {
  void reconcileExpiredCheckoutReservations().catch((error) => {
    logger.warn({ error }, "Scheduled checkout reservation reconciliation failed");
  });
}, reservationReconciliationIntervalMs);
reservationTimer.unref();

function shutdown(signal: string) {
  logger.info({ signal }, "Shutting down Kallayani API");
  clearInterval(reservationTimer);
  server.close((error) => {
    if (error) {
      logger.error({ error }, "Graceful shutdown failed");
      process.exitCode = 1;
    }
  });
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
