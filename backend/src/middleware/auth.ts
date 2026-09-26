import type { RequestHandler } from "express";
import { firebaseAuth } from "../config/firebase.js";
import { AppError } from "../lib/app-error.js";
import { asyncHandler } from "../lib/async-handler.js";

function bearerToken(header?: string) {
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7).trim() || null;
}

export const requireAuth = asyncHandler(async (request, _response, next) => {
  const token = bearerToken(request.headers.authorization);
  if (!token) throw new AppError(401, "AUTH_REQUIRED", "Sign in to continue.");
  try {
    request.auth = await firebaseAuth.verifyIdToken(token, true);
    next();
  } catch {
    throw new AppError(401, "INVALID_TOKEN", "Your session is invalid or has expired.");
  }
});

export const requireStaff: RequestHandler = (request, _response, next) => {
  const role = request.auth?.role;
  if (role !== "admin" && role !== "manager") {
    next(new AppError(403, "STAFF_REQUIRED", "Catalogue staff access is required."));
    return;
  }
  next();
};

export const requireAdmin: RequestHandler = (request, _response, next) => {
  if (request.auth?.role !== "admin") {
    next(new AppError(403, "ADMIN_REQUIRED", "Administrator access is required."));
    return;
  }
  next();
};
