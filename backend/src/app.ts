import { randomUUID } from "node:crypto";
import compression from "compression";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { pinoHttp } from "pino-http";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { firestore } from "./config/firebase.js";
import { asyncHandler } from "./lib/async-handler.js";
import { errorHandler, notFound } from "./middleware/errors.js";
import { adminRouter } from "./routes/admin-routes.js";
import { storefrontRouter } from "./routes/storefront-routes.js";
import { userRouter } from "./routes/user-routes.js";
import { paymentRouter } from "./routes/payment-routes.js";

export const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    genReqId: (request, response) => {
      const existing = request.headers["x-request-id"];
      const id = typeof existing === "string" ? existing : randomUUID();
      response.setHeader("x-request-id", id);
      return id;
    },
  }),
);
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: env.FRONTEND_ORIGIN.split(",").map((origin) => origin.trim()),
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type", "X-Request-Id"],
    maxAge: 86_400,
  }),
);
// Stripe signature verification requires the untouched request body.
app.use(
  "/api/v1/payments",
  express.raw({ type: "application/json", limit: "1mb" }),
  paymentRouter,
);
app.use(express.json({ limit: "1mb" }));
app.use(
  "/api",
  rateLimit({
    windowMs: 60_000,
    limit: env.isProduction ? 300 : 3_000,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
);

app.get("/health", (_request, response) => {
  response.json({ status: "ok", service: "kallayani-api", environment: env.NODE_ENV });
});

app.get("/ready", asyncHandler(async (_request, response) => {
  await firestore.doc("system/storefrontSeed").get();
  response.json({ status: "ready", service: "kallayani-api" });
}));

app.use("/api/v1/storefront", storefrontRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use(notFound);
app.use(errorHandler);
