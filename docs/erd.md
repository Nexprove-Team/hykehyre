# Entity-Relationship Diagram (ERD)

## 1. Core Entities

### 1.1 Users

Stores recruiter and admin accounts.

```
users
├── id (uuid, PK)
├── email (varchar, unique, not null)
├── password_hash (varchar, not null)
├── role (enum: 'recruiter', 'admin', not null)
├── company_name (varchar, nullable)
├── linkedin_url (varchar, nullable)
├── twitter_url (varchar, nullable)
├── created_at (timestamp, not null)
└── updated_at (timestamp, not null)
```

**Indexes:**

- `PRIMARY KEY (id)`
- `UNIQUE INDEX (email)`

**Notes:**

- Recruiters can optionally display social profiles on job posts
- Admins have elevated permissions (create jobs for others, import, moderate)

---

### 1.2 Jobs

Job postings created by recruiters or admins.

```
jobs
├── id (uuid, PK)
├── recruiter_id (uuid, FK → users.id, not null)
├── title (varchar, not null)
├── company_name (varchar, not null)
├── location (varchar, not null)
├── job_type (enum: 'full-time', 'part-time', 'contract', 'internship', not null)
├── salary_min (integer, nullable)
├── salary_max (integer, nullable)
├── description (text, not null)
├── requirements (jsonb, not null) -- Array of strings
├── responsibilities (jsonb, nullable) -- Array of strings
├── interview_availability (jsonb, nullable) -- {days: ['Mon', 'Wed'], times: ['10am-12pm']}
├── status (enum: 'open', 'paused', 'filled', default 'open', not null)
├── first_posted_on_quiet_aya (boolean, default true, not null)
├── posted_date (timestamp, not null)
├── created_at (timestamp, not null)
├── updated_at (timestamp, not null)
└── deleted_at (timestamp, nullable) -- Soft delete
```

**Indexes:**

- `PRIMARY KEY (id)`
- `INDEX (recruiter_id)`
- `INDEX (status)`
- `INDEX (posted_date DESC)`

**Notes:**

- `requirements` and `responsibilities` stored as JSON arrays for flexibility
- `first_posted_on_quiet_aya` = false if imported from external source

---

### 1.3 Applications

Candidate submissions to jobs.

```
applications
├── id (uuid, PK)
├── job_id (uuid, FK → jobs.id, not null)
├── candidate_email (varchar, not null)
├── candidate_name (varchar, nullable)
├── resume_url (varchar, not null)
├── linkedin_url (varchar, nullable)
├── cover_letter (text, nullable)
├── relevance_score (integer, not null) -- 0-100
├── relevance_feedback (text, not null) -- AI-generated explanation
├── status (enum: 'not_reviewed', 'under_review', 'interviewing', 'rejected', 'hired', default 'not_reviewed', not null)
├── talent_pool_opt_in (boolean, default false, not null)
├── applied_at (timestamp, not null)
├── updated_at (timestamp, not null)
└── flagged (boolean, default false, not null) -- Admin moderation
```

**Indexes:**

- `PRIMARY KEY (id)`
- `INDEX (job_id, status)`
- `INDEX (relevance_score DESC)`
- `INDEX (applied_at DESC)`
- `INDEX (candidate_email)` -- For future "my applications" feature

**Business Rules:**

- `relevance_score >= 60` → `status` = 'under_review' (visible to recruiter)
- `relevance_score < 60` → `status` = 'not_reviewed' (hidden from recruiter)
- Recruiter can manually override status

---

### 1.4 Job Transparency Log

Snapshots of applicant counts for historical tracking.

```
job_transparency_log
├── id (uuid, PK)
├── job_id (uuid, FK → jobs.id, not null)
├── total_applicants (integer, not null)
├── under_review (integer, not null)
├── interviewing (integer, not null)
├── snapshot_date (timestamp, not null)
```

**Indexes:**

- `PRIMARY KEY (id)`
- `INDEX (job_id, snapshot_date DESC)`

**Notes:**

- Updated daily via cron job (or on-demand for real-time accuracy)
- Enables historical charts (post-MVP: "Applicants over time")

---

## 2. Relationships

```
users (1) ──< (N) jobs
  └─ recruiter_id

jobs (1) ──< (N) applications
  └─ job_id

jobs (1) ──< (N) job_transparency_log
  └─ job_id
```

**Referential Integrity:**

- `ON DELETE CASCADE` for `applications` when `jobs` deleted (soft delete in app logic)
- `ON DELETE SET NULL` for `jobs.recruiter_id` if `users` deleted (preserve job data)

---

## 3. Enum Definitions

```sql
CREATE TYPE user_role AS ENUM ('recruiter', 'admin');
CREATE TYPE job_type AS ENUM ('full-time', 'part-time', 'contract', 'internship');
CREATE TYPE job_status AS ENUM ('open', 'paused', 'filled');
CREATE TYPE application_status AS ENUM ('not_reviewed', 'under_review', 'interviewing', 'rejected', 'hired');
```

---

## 4. Sample Queries

### 4.1 Get Job with Transparency Data

```sql
SELECT
  j.*,
  COUNT(DISTINCT a.id) AS total_applicants,
  COUNT(DISTINCT CASE WHEN a.status = 'under_review' THEN a.id END) AS under_review,
  COUNT(DISTINCT CASE WHEN a.status = 'interviewing' THEN a.id END) AS interviewing
FROM jobs j
LEFT JOIN applications a ON a.job_id = j.id
WHERE j.id = $1 AND j.deleted_at IS NULL
GROUP BY j.id;
```

### 4.2 Get Shortlisted Candidates for Recruiter

````sql
SELECT a.*
FROM applications a
JOIN jobs j ON j.id = a.job_id
WHERE j.recruiter_id = $1
  AND a.status IN ('under_review', 'interviewing')
  AND a.flagged = false
ORDER
BY a.relevance_score DESC, a.applied_at DESC;


### 4.3 Admin Analytics
```sql
SELECT
  COUNT(DISTINCT j.id) FILTER (WHERE j.status = 'open') AS open_jobs,
  COUNT(DISTINCT j.id) FILTER (WHERE j.status = 'filled') AS filled_jobs,
  COUNT(DISTINCT a.id) AS total_applications,
  AVG(a.relevance_score) AS avg_relevance_score
FROM jobs j
LEFT JOIN applications a ON a.job_id = j.id
WHERE j.deleted_at IS NULL;

---

---

## 5. Migration Strategy

**Initial Schema (Day 1):**
1. Create `users` table
2. Create `jobs` table
3. Create `applications` table
4. Create `job_transparency_log` table
5. Seed admin user

**Future Migrations (Post-MVP):**
- Add `candidate_profiles` table (when we add accounts)
- Add `messages` table (for recruiter-candidate chat)
- Add `integrations` table (LinkedIn, job board API keys)

---

## 6. Data Constraints

| Constraint | Rule |
|------------|------|
| Email uniqueness | Enforced at DB level for `users.email` |
| Candidate re-application | Same `candidate_email` + `job_id` = duplicate check (allow or reject?) |
| Job deletion | Soft delete only (`deleted_at` timestamp) |
| Application score | `CHECK (relevance_score BETWEEN 0 AND 100)` |

**Duplicate Application Handling (Decide by Day 2):**
- **Option A:** Block duplicate (show "Already applied")
- **Option B:** Allow resubmission, overwrite previous application
- **Recommendation:** Option A (simpler, prevents spam)

---

## 7. Schema Visualization

````

┌─────────────┐
│ users │
│─────────────│
│ id (PK) │
│ email │
│ role │
└──────┬──────┘
│
│ recruiter*id (FK)
│
▼
┌─────────────────┐
│ jobs │
│─────────────────│
│ id (PK) │
│ recruiter_id │
│ title │
│ status │
│ posted_date │
└────────┬────────┘
│
│ job_id (FK)
│
┌────┴─────────────────────┐
│ │
▼ ▼
┌──────────────┐ ┌─────────────────────────┐
│ applications │ │ job_transparency_log │
│──────────────│ │─────────────────────────│
│ id (PK) │ │ id (PK) │
│ job_id │ │ job_id │
│ relevance* │ │ total_applicants │
│ score │ │ snapshot_date │
│ status │ └─────────────────────────┘
└──────────────┘

```

---
```
