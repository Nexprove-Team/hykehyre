# Product Requirements Document (PRD)

**Product:** Quiet Aya - Hiring Workflow Platform  
**Version:** 1.0 MVP  
**Build Duration:** 7 days  
**Last Updated:** January 23, 2026

---

## 1. Executive Summary

Quiet Aya reduces hiring friction by centralizing job distribution, pre-filtering candidates, and providing transparency to job seekers. The MVP focuses on core workflow automation with human-in-the-loop decision making, targeting early-stage founders and startup recruiters who need speed without sacrificing quality.

**Core Value Props:**

- **For Recruiters:** Post once, distribute everywhere. See only relevant candidates.
- **For Candidates:** Know what you're applying to. Get instant feedback. Stop being ghosted.

---

## 2. MVP Scope

### 2.1 In Scope

**Recruiter Workflows:**

- Create jobs via conversational chat OR structured form
- Review/edit AI-generated job descriptions before publishing
- Set interview availability windows
- View shortlisted candidates only (noise pre-filtered)
- Optional: Display LinkedIn/Twitter profile on job posts

**Candidate Workflows:**

- Browse public job listings
- View job transparency data (post date, applicant counts, status)
- Submit resume/profile without mandatory account creation
- Receive instant relevance score/feedback
- Opt into talent pool for future opportunities

**Job Transparency (Required on Every Job):**

- Original publish date
- Source indicator (posted first on Quiet Aya: yes/no)
- Total applicants
- Applicants under review
- Applicants interviewing
- Job status (Open/Paused/Filled)

**Admin Capabilities:**

- Create jobs on behalf of recruiters
- Import jobs from company career pages (manual trigger, semi-automated scrape)
- Basic analytics dashboard (job count, applicant count)
- Manual moderation tools (pause job, flag candidate)

### 2.2 Explicitly Out of Scope (Non-Goals)

- Full ATS with scoring engine and workflow automation
- Payroll, onboarding, or HR management features
- Enterprise SSO, multi-tenant org charts, advanced permissions
- Heavy ML pipelines (embeddings, fine-tuned models)
- Automated interview scheduling (calendar integration)
- Candidate messaging/chat system
- Mobile apps (web-responsive only)
- Recruiter collaboration tools (comments, shared notes)

---

## 3. User Personas

| Persona               | Goals                                       | Pain Points                                                    |
| --------------------- | ------------------------------------------- | -------------------------------------------------------------- |
| **Founder/Recruiter** | Fill roles fast with quality candidates     | Manual cross-posting, irrelevant applicants, slow shortlisting |
| **Job Seeker**        | Find active roles, know where they stand    | Ghosting, stale jobs, no visibility into process               |
| **Admin**             | Ensure platform quality, support recruiters | Manual moderation overhead, limited tooling                    |

---

## 4. User Stories

### Recruiter Stories

- As a recruiter, I can describe my role in plain English and get a draft job description, so I don't start from scratch.
- As a recruiter, I can edit the AI-generated job description before publishing, so I maintain control over messaging.
- As a recruiter, I can set my availability for interviews, so candidates know when to expect contact.
- As a recruiter, I only see candidates who meet basic relevance criteria, so I don't waste time on mismatches.
- As a recruiter, I can optionally show my LinkedIn profile on the job post, so candidates trust the opportunity is real.

### Candidate Stories

- As a candidate, I can see when a job was originally posted, so I know if it's stale.
- As a candidate, I can see how many people applied, so I understand competition.
- As a candidate, I get instant feedback on my application relevance, so I know where I stand.
- As a candidate, I can opt into a talent pool without applying to a specific job, so I'm discoverable for future roles.
- As a candidate, I can apply without creating an account, so there's minimal friction.

### Admin Stories

- As an admin, I can create jobs on behalf of a recruiter, so I can onboard companies quickly.
- As an admin, I can import jobs from a company's career page, so we have comprehensive listings.
- As an admin, I can view basic analytics, so I understand platform health.

---

## 5. Feature Breakdown

### 5.1 Job Creation (Recruiter)

**Conversational Mode:**

- Chat-style interface powered by LLM API
- Extracts: job title, location, salary range, requirements, responsibilities
- Generates structured job description draft
- Recruiter can regenerate or manually edit

**Form Mode (Fallback):**

- Standard web form with fields: title, location, type, salary, description, requirements
- No AI generation, direct publish after review

**Interview Availability:**

- Simple time slot picker (days of week + time ranges)
- Stored as structured data, displayed on job page

### 5.2 Job Distribution (Auto/Manual)

**MVP Approach:**

- Jobs published on Quiet Aya are publicly listed immediately
- Admin can manually post to external channels (LinkedIn, job boards)
- Track if Quiet Aya was the first posting source (boolean flag)

### 5.3 Candidate Application

**Application Flow:**

- View job → Upload resume/paste LinkedIn → Submit
- No mandatory account creation (email required for contact)
- Instant relevance check runs on submit

**Relevance Feedback:**

- Simple rule-based or LLM prompt-based scoring (0-100)
- Show candidate their score + 1-2 sentence explanation
- Examples: "Strong match for required Python skills" or "Missing required 3+ years experience"

**Talent Pool Opt-In:**

- Checkbox during application: "Add me to talent pool for future roles"
- Stores profile for recruiter search later (post-MVP feature, data model only for now)

### 5.4 Candidate Filtering (Pre-Shortlist)

**Filtering Logic:**

- Relevance score < 60: Marked "Not Reviewed" (recruiter doesn't see)
- Relevance score >= 60: Marked "Under Review" (visible to recruiter)
- Recruiter can manually move candidates between states

**Recruiter View:**

- Table of candidates >= 60 score
- Sort by score, application date
- Actions: Mark "Interviewing", "Rejected", "Hired"

### 5.5 Job Transparency Display

**Public Job Page Shows:**

```
Posted: Jan 15, 2026 (8 days ago)
First posted on Quiet Aya: Yes
Total Applicants: 47
Under Review: 12
Interviewing: 3
Status: Open
```

**Status Updates:**

- Recruiter can manually set: Open → Paused → Filled
- Status change timestamps stored for analytics

### 5.6 Admin Tools

**Job Import:**

- Admin enters company career page URL
- System scrapes jobs (via Playwright or Cheerio-based parser)
- Admin reviews/edits before publishing
- Flags as "Not First Posted on Quiet Aya"

**Analytics Dashboard:**

- Total jobs (Open/Paused/Filled breakdown)
- Total applicants
- Average applicants per job
- Top recruiting companies

**Moderation:**

- Pause job (stops accepting applications)
- Flag candidate (mark as spam/inappropriate)
- Delete job (soft delete, keeps data)

---

## 6. Technical Constraints

### 6.1 Technology Stack (Recommended)

- **Frontend:** React (Next.js preferred for SSR/SEO)
- **Backend:** Node.js + Express OR Python + FastAPI
- **Database:** PostgreSQL (relational data model)
- **LLM:** Anthropic Claude API (conversational job creation + relevance scoring)
- **File Storage:** AWS S3 or Cloudflare R2 (resume uploads)
- **Hosting:** Vercel (frontend) + Railway/Render (backend)

### 6.2 Third-Party Dependencies (Minimal)

- LLM API (Claude Sonnet)
- Email service (SendGrid, Resend)
- File storage (S3/R2)
- Web scraping (Playwright for job imports)

### 6.3 Performance Targets

- Job listing page load: < 2s
- Application submission: < 5s (including relevance check)
- Conversational job creation: < 10s per exchange

---

## 7. Success Metrics (Week 1 Post-Launch)

| Metric                                  | Target           |
| --------------------------------------- | ---------------- |
| Jobs created                            | 20+              |
| Total applications                      | 100+             |
| Applications auto-filtered (< 60 score) | 30-50%           |
| Recruiter time to shortlist             | < 10 min per job |
| Candidate application completion rate   | > 70%            |

---

## 8. Open Questions & Assumptions

**Assumptions:**

- Recruiters trust AI-generated job descriptions if they can edit them
- Candidates value transparency more than privacy concerns about applicant counts
- Manual job distribution (admin-driven) is acceptable for MVP
- Human-in-the-loop filtering is faster than building a perfect algorithm

**Open Questions (Decide by Day 2):**

- Do we allow recruiter accounts or just admin-created jobs?
- Should relevance scores be visible to recruiters or just internal?
- Do we need email verification for candidates?

---

## 9. Release Plan

**Day 1-2:** Backend setup, database schema, API scaffolding  
**Day 3-4:** Recruiter job creation flow, candidate application flow  
**Day 5:** Transparency display, filtering logic, admin tools  
**Day 6:** Integration testing, LLM prompt tuning, UI polish  
**Day 7:** Deploy, smoke test, invite first 5 recruiters

---

## 10. Post-MVP Roadmap (Not in Scope)

- Automated cross-posting to LinkedIn/Indeed
- Advanced ATS scoring (resume parsing, skill extraction)
- Recruiter-candidate messaging
- Calendar integration for interview scheduling
- Candidate profile management
- Recruiter team collaboration features

---

# Summary

You now have:

1. **PRD** - Clear MVP scope, user stories, success metrics
2. **TRD** - System architecture, API design, third-party integrations
3. **ERD** - Database schema, relationships, sample queries
4. **Coding Standards** - Backend/frontend conventions, testing, deployment

**Next Steps:**

- Day 1-2: Setup infrastructure, implement database schema
- Day 3-4: Build core workflows (job creation, applications)
- Day 5: Transparency display, filtering, admin tools
- Day 6: Integration testing, bug fixes, UI polish
- Day 7: Deploy, smoke test, onboard first users

**Key Reminders:**

- Human-in-the-loop is acceptable (manual job distribution, moderation)
- Trust > automation for MVP
- Ship working code daily, iterate based on feedback

Good luck with the 7-day build! 🚀
