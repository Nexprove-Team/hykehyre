import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  real,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { jobs } from "./jobs";

// ── Enums ──────────────────────────────────────────────────────────────────────

export const applicationStatusEnum = pgEnum("application_status", [
  "not_reviewed",
  "under_review",
  "interviewing",
  "rejected",
  "hired",
]);

// ── Applications ───────────────────────────────────────────────────────────────

export const applications = pgTable("applications", {
  id: uuid("id").primaryKey().defaultRandom(),

  jobId: uuid("job_id")
    .notNull()
    .references(() => jobs.id, { onDelete: "cascade" }),
  candidateId: text("candidate_id").references(() => user.id, {
    onDelete: "set null",
  }),

  // For non-registered candidates
  candidateEmail: text("candidate_email").notNull(),
  candidateName: text("candidate_name").notNull(),

  // Application content
  resumeUrl: text("resume_url"),
  linkedinUrl: text("linkedin_url"),
  coverLetter: text("cover_letter"),

  // Status & filtering
  status: applicationStatusEnum("status").notNull().default("not_reviewed"),

  // AI relevance check
  relevanceScore: real("relevance_score"),
  relevanceFeedback: text("relevance_feedback"),
  isRelevant: boolean("is_relevant"),

  // AI match analysis (strengths/gaps breakdown)
  matchAnalysis: jsonb("match_analysis").$type<{
    feedback: string;
    strengths: string[];
    gaps: string[];
  }>(),

  // Talent pool consent (PRD §5.3)
  talentPoolOptIn: boolean("talent_pool_opt_in").notNull().default(false),

  // Admin moderation (ERD §1.3)
  flagged: boolean("flagged").notNull().default(false),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
