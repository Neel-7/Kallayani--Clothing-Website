import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { asyncHandler } from "../lib/async-handler.js";
import {
  addressesSchema,
  checkoutOrderActionSchema,
  checkoutOrderSchema,
  checkoutQuoteSchema,
  commerceStateSchema,
  profileSchema,
} from "../schemas/user.js";
import { getOrder, listOrders, quoteCheckout } from "../services/order-service.js";
import {
  cancelCheckoutPayment,
  createCheckoutPayment,
  verifyAndFinalizePayment,
} from "../services/payment-service.js";
import { getAddresses, getCommerceState, getProfile, saveAddresses, saveCommerceState, upsertProfile } from "../services/user-service.js";

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

userRouter.get("/me/addresses", asyncHandler(async (request, response) => {
  response.json({ data: await getAddresses(request.auth!.uid) });
}));

userRouter.put(
  "/me/addresses",
  validateBody(addressesSchema),
  asyncHandler(async (request, response) => {
    response.json({ data: await saveAddresses(request.auth!.uid, request.body.addresses) });
  }),
);

userRouter.get("/me/orders", asyncHandler(async (request, response) => {
  response.json({ data: await listOrders(request.auth!.uid) });
}));

userRouter.get("/me/orders/:orderId", asyncHandler(async (request, response) => {
  response.json({ data: await getOrder(request.auth!.uid, String(request.params.orderId)) });
}));

userRouter.post(
  "/me/checkout/quote",
  validateBody(checkoutQuoteSchema),
  asyncHandler(async (request, response) => {
    response.json({ data: await quoteCheckout(request.body) });
  }),
);

userRouter.post(
  "/me/checkout/payment-intent",
  validateBody(checkoutOrderSchema),
  asyncHandler(async (request, response) => {
    const data = await createCheckoutPayment(
      request.auth!.uid,
      request.body.email ?? request.auth!.email,
      request.body,
    );
    response.status(201).json({ data });
  }),
);

userRouter.post(
  "/me/checkout/finalize",
  validateBody(checkoutOrderActionSchema),
  asyncHandler(async (request, response) => {
    response.json({
      data: await verifyAndFinalizePayment(request.auth!.uid, request.body.orderId),
    });
  }),
);

userRouter.post(
  "/me/checkout/cancel",
  validateBody(checkoutOrderActionSchema),
  asyncHandler(async (request, response) => {
    response.json({
      data: await cancelCheckoutPayment(request.auth!.uid, request.body.orderId),
    });
  }),
);
