import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { requireAdmin, requireAuth, requireStaff } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { asyncHandler } from "../lib/async-handler.js";
import { AppError } from "../lib/app-error.js";
import {
  collectionSchema,
  createCollectionSchema,
  createHomepageEntrySchema,
  homepageEntrySchema,
} from "../schemas/content.js";
import { editableProductSchema, productMediaSchema, productStatusSchema } from "../schemas/product.js";
import {
  cancelOrderSchema,
  fulfillmentUpdateSchema,
  refundOrderSchema,
  storeSettingsSchema,
} from "../schemas/admin.js";
import {
  createCollection,
  createHomepageContent,
  deleteHomepageContent,
  listCollections,
  listHomepageContent,
  updateCollection,
  updateHomepageContent,
} from "../services/content-service.js";
import { deleteProductImage, uploadProductImage } from "../services/media-service.js";
import {
  createProduct,
  duplicateProduct,
  getProduct,
  listProducts,
  setProductStatus,
  slugExists,
  updateProduct,
  updateProductMedia,
} from "../services/product-service.js";
import {
  getAdminCustomer,
  getAdminDashboard,
  getAdminOrder,
  listAdminCustomers,
  listAdminOrders,
  listLowStockInventory,
  updateOrderFulfillment,
} from "../services/admin-commerce-service.js";
import { getStoreSettings, saveStoreSettings } from "../services/settings-service.js";
import { cancelAdminOrder, refundAdminOrder } from "../services/payment-service.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1, fields: 5 },
});
const deleteMediaSchema = z.object({ paths: z.array(z.string().min(1).max(500)).min(1).max(4) });

export const adminRouter = Router();
adminRouter.use(requireAuth, requireStaff);

adminRouter.get("/session", (request, response) => {
  response.json({
    data: { uid: request.auth!.uid, email: request.auth!.email ?? null, role: request.auth!.role },
  });
});

adminRouter.get("/dashboard", asyncHandler(async (request, response) => {
  const days = z.coerce.number().int().min(7).max(90).default(30).parse(request.query.days);
  response.json({ data: await getAdminDashboard(days) });
}));

adminRouter.get("/orders", asyncHandler(async (request, response) => {
  const limit = z.coerce.number().int().min(1).max(500).default(250).parse(request.query.limit);
  response.json({ data: await listAdminOrders(limit) });
}));

adminRouter.get("/orders/:id", asyncHandler(async (request, response) => {
  response.json({ data: await getAdminOrder(String(request.params.id)) });
}));

adminRouter.patch(
  "/orders/:id/fulfillment",
  validateBody(fulfillmentUpdateSchema),
  asyncHandler(async (request, response) => {
    response.json({
      data: await updateOrderFulfillment(
        String(request.params.id),
        request.body,
        request.auth!.uid,
      ),
    });
  }),
);

adminRouter.post(
  "/orders/:id/refund",
  requireAdmin,
  validateBody(refundOrderSchema),
  asyncHandler(async (request, response) => {
    response.json({
      data: await refundAdminOrder(
        String(request.params.id),
        request.body,
        request.auth!.uid,
      ),
    });
  }),
);

adminRouter.post(
  "/orders/:id/cancel",
  requireAdmin,
  validateBody(cancelOrderSchema),
  asyncHandler(async (request, response) => {
    response.json({
      data: await cancelAdminOrder(
        String(request.params.id),
        request.body,
        request.auth!.uid,
      ),
    });
  }),
);

adminRouter.get("/customers", asyncHandler(async (request, response) => {
  const query = z.string().trim().max(200).default("").parse(request.query.query);
  const limit = z.coerce.number().int().min(1).max(250).default(100).parse(request.query.limit);
  response.json({ data: await listAdminCustomers(query, limit) });
}));

adminRouter.get("/customers/:id", asyncHandler(async (request, response) => {
  response.json({ data: await getAdminCustomer(String(request.params.id)) });
}));

adminRouter.get("/inventory/low-stock", asyncHandler(async (request, response) => {
  const threshold = z.coerce.number().int().min(0).max(10_000).optional().parse(request.query.threshold);
  response.json({ data: await listLowStockInventory(threshold) });
}));

adminRouter.get("/settings", asyncHandler(async (_request, response) => {
  response.json({ data: await getStoreSettings() });
}));

adminRouter.put(
  "/settings",
  requireAdmin,
  validateBody(storeSettingsSchema),
  asyncHandler(async (request, response) => {
    response.json({ data: await saveStoreSettings(request.body, request.auth!.uid) });
  }),
);

adminRouter.get("/products", asyncHandler(async (_request, response) => {
  response.json({ data: await listProducts() });
}));

adminRouter.get("/products/slug-exists", asyncHandler(async (request, response) => {
  const slug = z.string().min(1).max(160).parse(request.query.slug);
  const exceptId = z.string().max(128).optional().parse(request.query.exceptId);
  response.json({ data: { exists: await slugExists(slug, exceptId) } });
}));

adminRouter.get("/products/:id", asyncHandler(async (request, response) => {
  response.json({ data: await getProduct(String(request.params.id)) });
}));

adminRouter.post(
  "/products",
  validateBody(editableProductSchema),
  asyncHandler(async (request, response) => {
    const id = await createProduct(request.body, request.auth!.uid);
    response.status(201).json({ data: { id } });
  }),
);

adminRouter.put(
  "/products/:id",
  validateBody(editableProductSchema),
  asyncHandler(async (request, response) => {
    await updateProduct(String(request.params.id), request.body, request.auth!.uid);
    response.status(204).send();
  }),
);

adminRouter.put(
  "/products/:id/media",
  validateBody(productMediaSchema),
  asyncHandler(async (request, response) => {
    await updateProductMedia(String(request.params.id), request.body, request.auth!.uid);
    response.status(204).send();
  }),
);

adminRouter.patch(
  "/products/:id/status",
  validateBody(productStatusSchema),
  asyncHandler(async (request, response) => {
    await setProductStatus(String(request.params.id), request.body.status, request.auth!.uid);
    response.status(204).send();
  }),
);

adminRouter.post("/products/:id/duplicate", asyncHandler(async (request, response) => {
  const id = await duplicateProduct(String(request.params.id), request.auth!.uid);
  response.status(201).json({ data: { id } });
}));

adminRouter.post(
  "/products/:id/images",
  upload.single("image"),
  asyncHandler(async (request, response) => {
    if (!request.file) throw new AppError(400, "IMAGE_REQUIRED", "Choose an image to upload.");
    await getProduct(String(request.params.id));
    const image = await uploadProductImage(
      String(request.params.id),
      request.file,
      String(request.body.alt ?? ""),
    );
    response.status(201).json({ data: image });
  }),
);

adminRouter.delete(
  "/products/:id/images",
  validateBody(deleteMediaSchema),
  asyncHandler(async (request, response) => {
    await deleteProductImage(String(request.params.id), request.body.paths);
    response.status(204).send();
  }),
);

adminRouter.get("/collections", asyncHandler(async (_request, response) => {
  response.json({ data: await listCollections() });
}));

adminRouter.post(
  "/collections",
  validateBody(createCollectionSchema),
  asyncHandler(async (request, response) => {
    const id = await createCollection(request.body.slug, request.body.name, request.auth!.uid);
    response.status(201).json({ data: { id } });
  }),
);

adminRouter.put(
  "/collections/:id",
  validateBody(collectionSchema),
  asyncHandler(async (request, response) => {
    await updateCollection(String(request.params.id), request.body, request.auth!.uid);
    response.status(204).send();
  }),
);

adminRouter.get("/homepage", asyncHandler(async (_request, response) => {
  response.json({ data: await listHomepageContent() });
}));

adminRouter.post(
  "/homepage",
  validateBody(createHomepageEntrySchema),
  asyncHandler(async (request, response) => {
    const id = await createHomepageContent(request.body, request.auth!.uid);
    response.status(201).json({ data: { id } });
  }),
);

adminRouter.put(
  "/homepage/:kind/:id",
  validateBody(homepageEntrySchema),
  asyncHandler(async (request, response) => {
    if (request.body.id !== request.params.id || request.body.kind !== request.params.kind) {
      throw new AppError(400, "CONTENT_ID_MISMATCH", "Content route and payload do not match.");
    }
    await updateHomepageContent(request.body, request.auth!.uid);
    response.status(204).send();
  }),
);

adminRouter.delete(
  "/homepage/:kind/:id",
  asyncHandler(async (request, response) => {
    await deleteHomepageContent(String(request.params.kind), String(request.params.id));
    response.status(204).send();
  }),
);
