import { resolve } from "node:path";
import { config } from "dotenv";
import { z } from "zod";
import { createEnv } from "@t3-oss/env-core";

// Load root .env — try both monorepo root (via turbo) and ../../ (via direct pnpm --filter).
// dotenv won't overwrite already-set vars, so the first hit wins.
config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    TRIGGER_SECRET_KEY: z.string(),
    TRIGGER_PROJECT_ID: z.string(),
  },
  runtimeEnv: process.env,
});
