import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { asyncHandler } from "../lib/async-handler.js";
import { commerceStateSchema, createOrderSchema, profileSchema } from "../schemas/user.js";
import { createOrder, listOrders } from "../services/order-service.js";
import { getCommerceState, getProfile, saveCommerceState, upsertProfile } from "../services/user-service.js";

export const userRouter = Router();
userRouter.use(requireAuth);

userRouter.get("/me", asyncHandler(async (request, response) => {
  response.json({ data: await getProfile(request.auth!.uid) });
}));

userRouter.put("/me", validateBody(profileSchema), asyncHandler(async (request, response) => {
  response.json({
    data: await upsertProfile(
      request.auth!.uid,
      {
        email: request.auth!.email,
        emailVerified: request.auth!.email_verified,
        name: request.auth!.name,
      },
      request.body,
    ),
  });
}));

userRouter.get("/me/commerce", asyncHandler(async (request, response) => {
  response.json({ data: await getCommerceState(request.auth!.uid) });
}));

userRouter.put(
  "/me/commerce",
  validateBody(commerceStateSchema),
  asyncHandler(async (request, response) => {
    await saveCommerceState(request.auth!.uid, request.body);
    response.status(204).send();
  }),
);

userRouter.get("/me/orders", asyncHandler(async (request, response) => {
  response.json({ data: await listOrders(request.auth!.uid) });
}));

userRouter.post(
  "/me/orders",
  validateBody(createOrderSchema),
  asyncHandler(async (request, response) => {
    const id = await createOrder(request.auth!.uid, request.body);
    response.status(201).json({ data: { id } });
  }),
);
