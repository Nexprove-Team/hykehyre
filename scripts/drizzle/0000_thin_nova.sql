CREATE TYPE "public"."company_size" AS ENUM('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+');--> statement-breakpoint
CREATE TYPE "public"."employment_type" AS ENUM('full-time', 'part-time', 'contract', 'internship', 'freelance');--> statement-breakpoint
CREATE TYPE "public"."experience_level" AS ENUM('entry', 'mid', 'senior', 'lead', 'executive');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('open', 'paused', 'filled');--> statement-breakpoint
CREATE TYPE "public"."location_type" AS ENUM('remote', 'hybrid', 'onsite');--> statement-breakpoint
CREATE TYPE "public"."scrape_platform" AS ENUM('linkedin', 'twitter', 'company-page');--> statement-breakpoint
CREATE TYPE "public"."scrape_status" AS ENUM('running', 'completed', 'failed', 'partial');--> statement-breakpoint
CREATE TYPE "public"."source" AS ENUM('linkedin', 'twitter', 'company-page', 'manual');--> statement-breakpoint
CREATE TABLE "companies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"website" text,
	"careers_page_url" text,
	"linkedin_url" text,
	"twitter_handle" varchar(100),
	"industry" varchar(255),
	"size" "company_size",
	"location" varchar(255),
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "companies_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "job_listings" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(500) NOT NULL,
	"company" varchar(255) NOT NULL,
	"description" text,
	"location" varchar(255),
	"location_type" "location_type",
	"employment_type" "employment_type",
	"salary_min" integer,
	"salary_max" integer,
	"salary_currency" varchar(10) DEFAULT 'USD',
	"skills" json DEFAULT '[]'::json,
	"experience_level" "experience_level",
	"source" "source" NOT NULL,
	"source_url" text,
	"posted_at" timestamp,
	"scraped_at" timestamp,
	"status" "job_status" DEFAULT 'open' NOT NULL,
	"recruiter_id" integer,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recruiters" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"role" varchar(255),
	"company" varchar(255),
	"email" varchar(255),
	"linkedin_url" text,
	"twitter_handle" varchar(100),
	"location" varchar(255),
	"job_types" json DEFAULT '[]'::json,
	"source" "source" NOT NULL,
	"source_url" text,
	"scraped_at" timestamp,
	"verified" boolean DEFAULT false NOT NULL,
	"confidence" real DEFAULT 0.5 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scrape_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" "scrape_platform" NOT NULL,
	"status" "scrape_status" NOT NULL,
	"query" text NOT NULL,
	"total_found" integer DEFAULT 0 NOT NULL,
	"total_saved" integer DEFAULT 0 NOT NULL,
	"total_skipped" integer DEFAULT 0 NOT NULL,
	"total_errors" integer DEFAULT 0 NOT NULL,
	"errors" json DEFAULT '[]'::json,
	"started_at" timestamp NOT NULL,
	"completed_at" timestamp,
	"duration_ms" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "job_listings" ADD CONSTRAINT "job_listings_recruiter_id_recruiters_id_fk" FOREIGN KEY ("recruiter_id") REFERENCES "public"."recruiters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "job_listings_source_url_idx" ON "job_listings" USING btree ("source_url");--> statement-breakpoint
CREATE INDEX "job_listings_title_idx" ON "job_listings" USING btree ("title");--> statement-breakpoint
CREATE INDEX "job_listings_company_idx" ON "job_listings" USING btree ("company");--> statement-breakpoint
CREATE UNIQUE INDEX "recruiters_linkedin_url_idx" ON "recruiters" USING btree ("linkedin_url");--> statement-breakpoint
CREATE INDEX "recruiters_full_name_company_idx" ON "recruiters" USING btree ("full_name","company");--> statement-breakpoint
CREATE INDEX "recruiters_company_idx" ON "recruiters" USING btree ("company");