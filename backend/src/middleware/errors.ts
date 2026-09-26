import type { ErrorRequestHandler, RequestHandler } from "express";
import { FirebaseError } from "firebase-admin";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { AppError } from "../lib/app-error.js";

export const notFound: RequestHandler = (request, _response, next) => {
  next(new AppError(404, "NOT_FOUND", `No API route exists for ${request.method} ${request.path}.`));
};

export const errorHandler: ErrorRequestHandler = (error, request, response, _next) => {
  let statusCode = 500;
  let code = "INTERNAL_ERROR";
  let message = "The server could not complete this request.";
  let details: unknown;

  if (error instanceof AppError) {
    ({ statusCode, code, message, details } = error);
  } else if (error instanceof ZodError) {
    statusCode = 400;
    code = "VALIDATION_ERROR";
    message = "The request contains invalid data.";
    details = error.flatten();
  } else if (error instanceof FirebaseError) {
    code = "FIREBASE_ERROR";
    message = env.isProduction ? message : error.message;
  } else if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "LIMIT_FILE_SIZE"
  ) {
    statusCode = 413;
    code = "IMAGE_TOO_LARGE";
    message = "Images must be 10 MB or smaller.";
  }

  if (statusCode >= 500) {
    logger.error({ error, requestId: request.id }, "Request failed");
  }

  response.status(statusCode).json({
    error: {
      code,
      message,
      ...(details ? { details } : {}),
      requestId: request.id,
    },
  });
};
