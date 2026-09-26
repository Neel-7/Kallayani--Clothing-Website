import { z } from "zod";

const booleanFromString = z
  .enum(["true", "false"])
  .default("false")
  .transform((value) => value === "true");

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
  FRONTEND_ORIGIN: z.string().default("http://localhost:5173"),
  FIREBASE_PROJECT_ID: z.string().optional(),
  VITE_FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_STORAGE_BUCKET: z.string().optional(),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  FIREBASE_USE_EMULATORS: booleanFromString,
  VITE_USE_FIREBASE_EMULATORS: z.enum(["true", "false"]).optional(),
  FIREBASE_SERVICE_ACCOUNT_JSON: z.string().optional(),
});

const parsed = schema.parse(process.env);
const projectId = parsed.FIREBASE_PROJECT_ID ?? parsed.VITE_FIREBASE_PROJECT_ID;
const storageBucket = parsed.FIREBASE_STORAGE_BUCKET ?? parsed.VITE_FIREBASE_STORAGE_BUCKET;

if (!projectId) throw new Error("FIREBASE_PROJECT_ID is required.");
if (!storageBucket) throw new Error("FIREBASE_STORAGE_BUCKET is required.");

export const env = {
  ...parsed,
  projectId,
  storageBucket,
  useEmulators:
    parsed.FIREBASE_USE_EMULATORS || parsed.VITE_USE_FIREBASE_EMULATORS === "true",
  isProduction: parsed.NODE_ENV === "production",
};
