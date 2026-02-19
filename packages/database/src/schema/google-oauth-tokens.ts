import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

// ── Google OAuth Tokens ────────────────────────────────────────────────────────

export const googleOauthTokens = pgTable("google_oauth_tokens", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),

  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  tokenType: text("token_type").notNull().default("Bearer"),
  expiresAt: timestamp("expires_at").notNull(),
  scope: text("scope").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
