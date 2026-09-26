import { Router } from "express";
import { asyncHandler } from "../lib/async-handler.js";
import { handleStripeWebhook } from "../services/payment-service.js";

export const paymentRouter = Router();

paymentRouter.post(
  "/webhook",
  asyncHandler(async (request, response) => {
    await handleStripeWebhook(request.body as Buffer, request.header("stripe-signature"));
    response.json({ received: true });
  }),
);
