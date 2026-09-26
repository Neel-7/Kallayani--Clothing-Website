import { Router } from "express";
import { asyncHandler } from "../lib/async-handler.js";
import {
  getCollection,
  getCollections,
  getHomePage,
  getProduct,
  getStorefrontInfo,
} from "../services/storefront-service.js";

export const storefrontRouter = Router();

storefrontRouter.get("/home", asyncHandler(async (_request, response) => {
  response.json({ data: await getHomePage() });
}));

storefrontRouter.get("/collections", asyncHandler(async (_request, response) => {
  response.json({ data: await getCollections() });
}));

storefrontRouter.get("/collections/:slug", asyncHandler(async (request, response) => {
  response.json({ data: await getCollection(String(request.params.slug)) });
}));

storefrontRouter.get("/products/:id", asyncHandler(async (request, response) => {
  response.json({ data: await getProduct(String(request.params.id)) });
}));

storefrontRouter.get("/store", asyncHandler(async (_request, response) => {
  response.json({ data: await getStorefrontInfo() });
}));
