# Technical Requirements Document (TRD)

**Product:** Quiet Aya MVP  
**Version:** 1.0  
**Author:** Engineering Team  
**Date:** January 23, 2026

---

## 1. System Architecture Overview

### 1.1 High-Level Architecture

```
┌─────────────┐
│   Browser   │
│  (Next.js)  │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────┐
│  API Gateway    │
│  (Express/Fast) │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬─────────┐
    ▼         ▼          ▼         ▼
┌────────┐ ┌──────┐ ┌────────┐ ┌──────┐
│ Jobs   │ │Users │ │Applic. │ │Admin │
│Service │ │Svc.  │ │Service │ │Svc.  │
└───┬────┘ └──┬───┘ └───┬────┘ └──┬───┘
    │         │          │         │
    └─────────┴──────────┴─────────┘
                   │
                   ▼
            ┌─────────────┐
            │ PostgreSQL  │
            └─────────────┘

External Dependencies:
- Claude API (job gen, relevance scoring)
- S3/R2 (resume storage)
- SendGrid (email notifications)
```

### 1.2 Service Boundaries

| Service                  | Responsibility                                      | Key Endpoints                                           |
| ------------------------ | --------------------------------------------------- | ------------------------------------------------------- |
| **Jobs Service**         | Job CRUD, status management, transparency data      | `POST /jobs`, `GET /jobs/:id`, `PATCH /jobs/:id/status` |
| **Users Service**        | Recruiter/admin accounts, auth                      | `POST /auth/login`, `GET /users/me`                     |
| **Applications Service** | Candidate submissions, relevance scoring, filtering | `POST /jobs/:id/apply`, `GET /applications?jobId=X`     |
| **Admin Service**        | Job imports, analytics, moderation                  | `POST /admin/import`, `GET /admin/analytics`            |

**Note:** For MVP, services can be logical modules in a monolith (not microservices). Separation aids future scaling.

---

## 2. Data Flow

### 2.1 Job Creation Flow

```
Recruiter → Frontend (chat or form)
           → POST /jobs/generate (if chat mode)
           → Claude API (extract job data)
           → Return draft to frontend
           → Recruiter edits
           → POST /jobs (publish)
           → Store in DB
           → Return job URL
```

### 2.2 Candidate Application Flow

```
Candidate → Job detail page
          → Upload resume (→ S3)
          → POST /jobs/:id/apply
          → Claude API (relevance check)
          → Store application + score in DB
          → If score >= 60: Mark "Under Review"
          → If score < 60: Mark "Not Reviewed"
          → Return feedback to candidate
          → Send email confirmation
```

### 2.3 Admin Job Import Flow

```
Admin → Enter career page URL
      → POST /admin/import
      → Backend scrapes page (Playwright)
      → Extract job listings
      → Return draft jobs to admin
      → Admin reviews/edits
      → POST /jobs (bulk create)
      → Flag as "not first posted on Quiet Aya"
```

---

## 3. API Structure

### 3.1 Authentication

**Approach:** JWT-based auth for recruiters/admins. No auth required for public job listings or candidate applications (email-based identity).

**Endpoints:**

- `POST /auth/register` (recruiter signup, admin-created initially)
- `POST /auth/login` (email + password → JWT)
- `GET /auth/me` (verify token, return user info)

### 3.2 Core API Endpoints

#### Jobs

```
POST   /jobs                    # Create job (recruiter)
GET    /jobs                    # List public jobs (paginated)
GET    /jobs/:id                # Job detail + transparency data
PATCH  /jobs/:id                # Edit job
PATCH  /jobs/:id/status         # Update status (Open/Paused/Filled)
DELETE /jobs/:id                # Soft delete

POST   /jobs/generate           # Conversational job creation (LLM)
```

#### Applications

```
POST   /jobs/:id/apply          # Submit application
GET    /applications            # List applications (recruiter, filtered by job)
PATCH  /applications/:id/status # Update status (Interviewing/Rejected/Hired)
```

#### Admin

```
POST   /admin/jobs/import       # Import jobs from URL
GET    /admin/analytics         # Dashboard stats
PATCH  /admin/jobs/:id/moderate # Pause/flag job
PATCH  /admin/applications/:id/flag # Flag candidate
```

### 3.3 Request/Response Examples

**POST /jobs/generate**

```json
{
  "message": "We need a senior backend engineer with 5 years Python, knows Django and AWS."
}
```

Response:

```json
{
  "job": {
    "title": "Senior Backend Engineer",
    "location": "Remote",
    "requirements": ["5+ years Python", "Django experience", "AWS familiarity"],
    "description": "We're seeking a senior backend engineer..."
  }
}
```

**POST /jobs/:id/apply**

```json
{
  "email": "candidate@example.com",
  "resume_url": "https://s3.../resume.pdf",
  "linkedin_url": "https://linkedin.com/in/...",
  "talent_pool_opt_in": true
}
```

Response:

```json
{
  "application_id": "app_123",
  "relevance_score": 75,
  "feedback": "Strong match for required Python and AWS skills. Missing Django experience mentioned in resume.",
  "status": "Under Review"
}
```

**GET /jobs/:id** (public)

```json
{
  "id": "job_456",
  "title": "Senior Backend Engineer",
  "company": "Acme Inc",
  "posted_date": "2026-01-15T10:00:00Z",
  "first_posted_on_quiet_aya": true,
  "transparency": {
    "total_applicants": 47,
    "under_review": 12,
    "interviewing": 3
  },
  "status": "Open",
  "recruiter_profile": {
    "name": "Jane Doe",
    "linkedin": "https://linkedin.com/in/janedoe"
  }
}
```

---

## 4. Database Design (High-Level)

**See ERD section for full schema. Key tables:**

- `users` (recruiters, admins)
- `jobs` (job postings)
- `applications` (candidate submissions)
- `job_transparency_log` (snapshot applicant counts over time)

**Relationships:**

- `jobs.recruiter_id` → `users.id`
- `applications.job_id` → `jobs.id`
- `applications.candidate_email` (no user account required)

---

## 5. Third-Party Integrations

### 5.1 Claude API

**Usage:**

- Job description generation (conversational mode)
- Relevance scoring (candidate applications)

**Implementation:**

```javascript
// Job generation
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 1000,
    messages: [
      { role: "user", content: `Extract job details: ${recruiterMessage}` },
    ],
  }),
});

// Relevance scoring
const score = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  body: JSON.stringify({
    model: "claude-sonnet-4-5-20250929",
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: `Job requirements: ${job.requirements}. Candidate resume: ${resume}. Score 0-100 and explain.`,
      },
    ],
  }),
});
```

**Rate Limits:** Handle 429s with exponential backoff. Cache job descriptions if regenerated.

### 5.2 File Storage (S3/R2)

**Usage:** Resume uploads

**Implementation:**

- Generate presigned upload URLs from backend
- Frontend uploads directly to S3
- Store final URL in `applications.resume_url`

**Security:**

- Private bucket, presigned URLs expire in 1 hour
- Virus scanning (post-MVP, use AWS Macie or ClamAV)

### 5.3 Email (SendGrid)

**Usage:**

- Candidate application confirmation
- Recruiter notification of new shortlisted candidates

**Templates:**

- `candidate_application_received`
- `recruiter_new_candidate`

---

## 6. Security & Data Handling

### 6.1 Authentication & Authorization

**Recruiters/Admins:**

- JWT tokens (7-day expiry, refresh tokens optional for MVP)
- Passwords hashed with bcrypt (12 rounds)

**Candidates:**

- No accounts required
- Email used as identity for applications
- Optional: Send magic link for application status updates (post-MVP)

### 6.2 Data Privacy

**PII Handling:**

- Candidate emails, resumes stored in EU/US regions based on user location
- No third-party analytics on candidate data (only aggregate job metrics)

**GDPR Compliance (Basic):**

- Talent pool opt-in explicit (checkbox, not pre-checked)
- Candidate can request data deletion via email (manual process for MVP)

### 6.3 Input Validation

**All API Endpoints:**

- Email: Regex + DNS check
- URLs: Whitelist domains for LinkedIn, resume uploads
- File uploads: Max 5MB, PDF/DOCX only
- SQL injection: Use parameterized queries (Prisma ORM or raw with params)

### 6.4 Rate Limiting

**Public Endpoints:**

- `/jobs` (listings): 100 req/min per IP
- `/jobs/:id/apply`: 5 req/min per IP (prevent spam)

**Authenticated Endpoints:**

- `/jobs/generate`: 10 req/min per user

---

## 7. Performance Considerations

### 7.1 Caching

**Job Listings:**

- Cache `GET /jobs` response for 60 seconds (Redis or in-memory)
- Invalidate on new job creation

**Transparency Data:**

- Update applicant counts in real-time on application submit
- For job detail page, cache for 10 seconds (acceptable staleness)

### 7.2 Database Indexing

**Critical Indexes:**

```sql
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_score ON applications(relevance_score);
```

### 7.3 LLM API Optimization

**Job Generation:**

- Show loading state, expect 3-5s response time
- Use streaming responses if available (Claude supports SSE)

**Relevance Scoring:**

- Async processing (return 202, email candidate when done)
- OR synchronous with 5s timeout, fallback to manual review

---

## 8. Error Handling

### 8.1 API Error Responses

**Standard Format:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": { "field": "email" }
  }
}
```

**Error Codes:**

- `VALIDATION_ERROR` (400)
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `RATE_LIMIT_EXCEEDED` (429)
- `INTERNAL_ERROR` (500)

### 8.2 LLM API Failures

**Fallback Strategy:**

- Job generation fails → Show form mode
- Relevance scoring fails → Default score 50, mark "Manual Review Needed"

### 8.3 File Upload Failures

- S3 unavailable → Return 503, ask candidate to retry
- Invalid file type → Return 400 with clear message

---

## 9. Deployment Architecture

### 9.1 Environments

| Environment    | Purpose                | URL                                                     |
| -------------- | ---------------------- | ------------------------------------------------------- |
| **Local**      | Development            | `localhost:3000` (frontend), `localhost:8000` (backend) |
| **Staging**    | Pre-production testing | `staging.quietaya.com`                                  |
| **Production** | Live platform          | `quietaya.com`                                          |

### 9.2 Infrastructure

**Frontend (Next.js):**

- Hosted on Vercel
- Auto-deploy on `main` branch push
- Environment variables: `NEXT_PUBLIC_API_URL`

**Backend (Node.js/Python):**

- Hosted on Railway or Render
- Auto-deploy on `main` branch push
- Environment variables: `DATABASE_URL`, `CLAUDE_API_KEY`, `S3_BUCKET`, `SENDGRID_API_KEY`

**Database:**

- PostgreSQL on Railway/Render managed service
- Daily automated backups
- Connection pooling (PgBouncer)

### 9.3 CI/CD Pipeline

**GitHub Actions:**

```yaml
on: push
jobs:
  test:
    - Run linter
    - Run unit tests
    - Run integration tests
  deploy:
    - Deploy frontend to Vercel
    - Deploy backend to Railway
```

**Deployment Time:** < 5 minutes (critical for 7-day build)

---

## 10. Monitoring & Logging

### 10.1 Application Logging

**Log Levels:**

- `INFO`: API requests, job creation, application submission
- `WARN`: Rate limit hits, LLM API timeouts
- `ERROR`: Unhandled exceptions, database connection failures

**Log Format (JSON):**

```json
{
  "timestamp": "2026-01-23T14:32:10Z",
  "level": "INFO",
  "service": "applications",
  "message": "Application submitted",
  "metadata": { "job_id": "job_456", "score": 75 }
}
```

### 10.2 Metrics (Basic)

**Track:**

- API response times (p50, p95, p99)
- Error rates by endpoint
- LLM API latency
- Database query duration

**Tool:** Use Railway/Render built-in metrics for MVP. Post-MVP: Prometheus + Grafana.

### 10.3 Alerts

**Critical Alerts (PagerDuty or email):**

- API error rate > 5% for 5 minutes
- Database connection failures
- S3 upload failures > 10% for 10 minutes

---

## 11. Testing Strategy

### 11.1 Unit Tests

**Coverage Target:** 70% (focus on business logic)

**Frameworks:**

- Backend: Jest (Node.js) or pytest (Python)
- Frontend: Jest + React Testing Library

**Key Areas:**

- Relevance scoring logic
- Job status transitions
- Application filtering rules

### 11.2 Integration Tests

**Test Scenarios:**

- End-to-end job creation (chat → publish)
- Candidate application → recruiter sees shortlist
- Admin job import flow

**Tools:** Playwright (browser automation) + Supertest (API testing)

### 11.3 Manual Testing Checklist (Day 6)

- [ ] Create job via chat
- [ ] Create job via form
- [ ] Apply to job, verify email received
- [ ] Check transparency data updates
- [ ] Admin imports job from external URL
- [ ] Recruiter sees only candidates with score >= 60
- [ ] Test on mobile (responsive)

---

## 12. Open Technical Decisions

**Decide by Day 2:**

| Decision              | Options               | Recommendation                                             |
| --------------------- | --------------------- | ---------------------------------------------------------- |
| ORM vs Raw SQL        | Prisma vs pg/psycopg2 | Prisma (type safety, migrations)                           |
| LLM relevance scoring | Sync vs Async         | Async with email notification (better UX for long resumes) |
| Job import scraping   | Playwright vs Cheerio | Playwright (handles JS-rendered pages)                     |
| Email verification    | Required vs Optional  | Optional (friction reduction)                              |

---
