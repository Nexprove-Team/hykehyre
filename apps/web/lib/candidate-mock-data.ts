import type {
  ApplicationStatus,
  EmploymentType,
  ExperienceLevel,
} from './mock-data'

export interface MockApplicationTimelineEvent {
  id: string
  type:
    | 'applied'
    | 'status_change'
    | 'interview_scheduled'
    | 'message_received'
    | 'reviewed'
  title: string
  description: string
  timestamp: string
  metadata?: Record<string, string>
}

export interface MockCandidateApplicationDetail {
  id: string
  jobTitle: string
  companyName: string
  companyLogoUrl: string | null
  companyWebsite: string
  status: ApplicationStatus
  appliedAt: string
  updatedAt: string
  location: string
  isRemote: boolean
  employmentType: EmploymentType
  experienceLevel: ExperienceLevel
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string
  jobDescription: string
  requirements: string[]
  responsibilities: string[]
  skills: string[]
  coverLetter: string | null
  resumeUrl: string | null
  linkedinUrl: string | null
  relevanceScore: number
  matchFeedback: string
  matchStrengths: string[]
  matchGaps: string[]
  timeline: MockApplicationTimelineEvent[]
}

export interface MockCandidateUser {
  id: string
  name: string
  email: string
  role: 'candidate'
  headline: string
}

export interface MockCandidateStats {
  totalApplications: number
  activeApplications: number
  interviewsUpcoming: number
  savedJobs: number
}

export interface MockCandidateApplication {
  id: string
  jobTitle: string
  companyName: string
  status: ApplicationStatus
  appliedAt: string
  location: string
}

export interface MockCandidateActivity {
  id: string
  type: 'applied' | 'status_change' | 'interview' | 'message' | 'profile_view'
  title: string
  description: string
  timestamp: string
}

export const MOCK_CANDIDATE_USER: MockCandidateUser = {
  id: 'cand-001',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  role: 'candidate',
  headline: 'Senior Frontend Engineer',
}

export const MOCK_CANDIDATE_STATS: MockCandidateStats = {
  totalApplications: 12,
  activeApplications: 5,
  interviewsUpcoming: 2,
  savedJobs: 8,
}

export const MOCK_CANDIDATE_APPLICATIONS: MockCandidateApplication[] = [
  {
    id: 'capp-001',
    jobTitle: 'Senior Frontend Engineer',
    companyName: 'Acme Technologies',
    status: 'under_review',
    appliedAt: '2026-02-10',
    location: 'San Francisco, CA',
  },
  {
    id: 'capp-002',
    jobTitle: 'Full Stack Developer',
    companyName: 'N26',
    status: 'interviewing',
    appliedAt: '2026-02-08',
    location: 'Berlin, DE',
  },
  {
    id: 'capp-003',
    jobTitle: 'Frontend Lead',
    companyName: 'Stripe',
    status: 'not_reviewed',
    appliedAt: '2026-02-07',
    location: 'Remote',
  },
  {
    id: 'capp-004',
    jobTitle: 'React Developer',
    companyName: 'Vercel',
    status: 'hired',
    appliedAt: '2026-02-03',
    location: 'Remote',
  },
  {
    id: 'capp-005',
    jobTitle: 'Software Engineer',
    companyName: 'Meta',
    status: 'interviewing',
    appliedAt: '2026-02-05',
    location: 'Menlo Park, CA',
  },
  {
    id: 'capp-006',
    jobTitle: 'UI Engineer',
    companyName: 'Figma',
    status: 'rejected',
    appliedAt: '2026-01-28',
    location: 'San Francisco, CA',
  },
  {
    id: 'capp-007',
    jobTitle: 'Platform Engineer',
    companyName: 'Datadog',
    status: 'under_review',
    appliedAt: '2026-02-09',
    location: 'New York, NY',
  },
]

export const MOCK_CANDIDATE_ACTIVITY: MockCandidateActivity[] = [
  {
    id: 'act-001',
    type: 'applied',
    title: 'Applied to Platform Engineer',
    description: 'Datadog - New York, NY',
    timestamp: '2026-02-09T14:30:00',
  },
  {
    id: 'act-002',
    type: 'status_change',
    title: 'Application moved to Review',
    description: 'Senior Frontend Engineer at Acme Technologies',
    timestamp: '2026-02-09T10:15:00',
  },
  {
    id: 'act-003',
    type: 'interview',
    title: 'Interview scheduled',
    description: 'Full Stack Developer at N26 - Feb 14, 2:00 PM',
    timestamp: '2026-02-08T16:00:00',
  },
  {
    id: 'act-004',
    type: 'message',
    title: 'New message from recruiter',
    description: 'Acme Technologies - Re: Frontend Engineer role',
    timestamp: '2026-02-08T11:30:00',
  },
  {
    id: 'act-005',
    type: 'profile_view',
    title: 'Profile viewed by recruiter',
    description: 'Stripe - Engineering team',
    timestamp: '2026-02-08T09:00:00',
  },
  {
    id: 'act-006',
    type: 'applied',
    title: 'Applied to Frontend Lead',
    description: 'Stripe - Remote',
    timestamp: '2026-02-07T15:45:00',
  },
  {
    id: 'act-007',
    type: 'status_change',
    title: 'Interview stage reached',
    description: 'Software Engineer at Meta',
    timestamp: '2026-02-06T14:20:00',
  },
  {
    id: 'act-008',
    type: 'message',
    title: 'New message from recruiter',
    description: 'N26 - Re: Full Stack Developer position',
    timestamp: '2026-02-06T10:00:00',
  },
  {
    id: 'act-009',
    type: 'profile_view',
    title: 'Profile viewed by recruiter',
    description: 'Vercel - Frontend team',
    timestamp: '2026-02-05T17:30:00',
  },
  {
    id: 'act-010',
    type: 'status_change',
    title: 'Offer received',
    description: 'React Developer at Vercel',
    timestamp: '2026-02-04T11:00:00',
  },
]

export const MOCK_CANDIDATE_CHART_DATA = [
  { date: 'Mon', applications: 2 },
  { date: 'Tue', applications: 1 },
  { date: 'Wed', applications: 3 },
  { date: 'Thu', applications: 0 },
  { date: 'Fri', applications: 2 },
  { date: 'Sat', applications: 1 },
  { date: 'Sun', applications: 0 },
]

export const MOCK_CANDIDATE_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Application reviewed',
    desc: 'Acme Technologies viewed your application for Senior Frontend Engineer',
    time: '2h ago',
    read: false,
  },
  {
    id: 2,
    title: 'Interview invitation',
    desc: 'N26 scheduled an interview for Full Stack Developer - Feb 14',
    time: '5h ago',
    read: false,
  },
  {
    id: 3,
    title: 'Profile viewed',
    desc: 'A recruiter at Stripe viewed your profile',
    time: '1d ago',
    read: true,
  },
]

export const MOCK_APPLICATION_STATS = {
  total: 7,
  active: 4,
  interviewing: 2,
  offers: 1,
}

export const MOCK_CANDIDATE_APPLICATIONS_DETAIL: MockCandidateApplicationDetail[] =
  [
    {
      id: 'capp-001',
      jobTitle: 'Senior Frontend Engineer',
      companyName: 'Acme Technologies',
      companyLogoUrl: null,
      companyWebsite: 'https://acme.tech',
      status: 'under_review',
      appliedAt: '2026-02-10',
      updatedAt: '2026-02-11',
      location: 'San Francisco, CA',
      isRemote: false,
      employmentType: 'full_time',
      experienceLevel: 'senior',
      salaryMin: 160000,
      salaryMax: 210000,
      salaryCurrency: 'USD',
      jobDescription:
        "We're looking for a Senior Frontend Engineer to lead the development of our next-generation web platform. You'll work closely with designers and backend engineers to build performant, accessible interfaces that delight our users. This role offers the opportunity to shape technical direction and mentor junior team members.",
      requirements: [
        '5+ years of experience with React and TypeScript',
        'Strong understanding of web performance optimization',
        'Experience with modern CSS (Tailwind, CSS-in-JS, or CSS Modules)',
        'Familiarity with testing frameworks (Jest, Playwright, or Cypress)',
        'Excellent communication and collaboration skills',
      ],
      responsibilities: [
        'Architect and build new frontend features from concept to production',
        'Collaborate with design to implement pixel-perfect, accessible UIs',
        'Improve application performance and core web vitals',
        'Mentor junior engineers through code reviews and pairing sessions',
        'Contribute to technical planning and architecture decisions',
      ],
      skills: [
        'React',
        'TypeScript',
        'Next.js',
        'Tailwind CSS',
        'GraphQL',
        'Playwright',
      ],
      coverLetter:
        "I'm excited to apply for the Senior Frontend Engineer role at Acme Technologies. With over 6 years of experience building high-performance React applications, I believe I can make an immediate impact on your team. At my current role, I led the migration of our design system to a component-driven architecture, improving developer velocity by 40%.",
      resumeUrl: '/resume-alex-johnson.pdf',
      linkedinUrl: 'https://linkedin.com/in/alexjohnson',
      relevanceScore: 0.92,
      matchFeedback:
        'Excellent match! Your 6+ years of React and TypeScript experience strongly align with this senior frontend role. Your design system migration work is particularly relevant.',
      matchStrengths: [
        'Deep React and TypeScript expertise matches core requirements',
        'Design system experience aligns with component architecture needs',
        'Performance optimization background fits web vitals focus',
      ],
      matchGaps: ['Consider highlighting GraphQL experience more prominently'],
      timeline: [
        {
          id: 'tl-001-1',
          type: 'applied',
          title: 'Application submitted',
          description: 'You applied for Senior Frontend Engineer',
          timestamp: '2026-02-10T09:30:00',
        },
        {
          id: 'tl-001-2',
          type: 'reviewed',
          title: 'Application reviewed',
          description: 'A recruiter viewed your application',
          timestamp: '2026-02-10T14:15:00',
        },
        {
          id: 'tl-001-3',
          type: 'status_change',
          title: 'Moved to review',
          description: 'Your application is now under active review',
          timestamp: '2026-02-11T10:00:00',
        },
        {
          id: 'tl-001-4',
          type: 'message_received',
          title: 'Message from recruiter',
          description: 'Sarah from Acme sent you a message about the role',
          timestamp: '2026-02-11T15:30:00',
        },
      ],
    },
    {
      id: 'capp-002',
      jobTitle: 'Full Stack Developer',
      companyName: 'N26',
      companyLogoUrl: null,
      companyWebsite: 'https://n26.com',
      status: 'interviewing',
      appliedAt: '2026-02-08',
      updatedAt: '2026-02-11',
      location: 'Berlin, DE',
      isRemote: true,
      employmentType: 'full_time',
      experienceLevel: 'mid',
      salaryMin: 75000,
      salaryMax: 95000,
      salaryCurrency: 'EUR',
      jobDescription:
        "Join N26's engineering team to build the future of mobile banking. As a Full Stack Developer, you'll work across our React Native frontend and Node.js microservices to deliver seamless financial experiences to millions of users across Europe.",
      requirements: [
        '3+ years of full stack development experience',
        'Proficiency in TypeScript, React, and Node.js',
        'Experience with relational databases (PostgreSQL preferred)',
        'Understanding of RESTful API design and microservice patterns',
        'Working proficiency in English (German is a plus)',
      ],
      responsibilities: [
        'Develop and maintain features across the web and mobile stack',
        'Design and implement API endpoints for new product features',
        'Write comprehensive tests and maintain CI/CD pipelines',
        'Participate in on-call rotation for production systems',
        'Collaborate with product managers to refine technical requirements',
      ],
      skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
      coverLetter:
        "As a full stack developer passionate about fintech, N26's mission to build the bank the world loves to use resonates deeply with me. I've spent the last 4 years building scalable web applications with React and Node.js, and I'm eager to bring that experience to your team.",
      resumeUrl: '/resume-alex-johnson.pdf',
      linkedinUrl: 'https://linkedin.com/in/alexjohnson',
      relevanceScore: 0.78,
      matchFeedback:
        'Good match! Your full stack skills are relevant, though the role leans toward fintech-specific experience. Your React and Node.js background provides a solid foundation.',
      matchStrengths: [
        'Strong TypeScript and React proficiency aligns with tech stack',
        'Node.js experience covers backend requirements',
      ],
      matchGaps: [
        'Adding fintech or banking domain experience would strengthen your profile',
        'Consider mentioning any experience with microservice architectures',
      ],
      timeline: [
        {
          id: 'tl-002-1',
          type: 'applied',
          title: 'Application submitted',
          description: 'You applied for Full Stack Developer',
          timestamp: '2026-02-08T11:00:00',
        },
        {
          id: 'tl-002-2',
          type: 'reviewed',
          title: 'Application reviewed',
          description: 'The hiring team reviewed your profile',
          timestamp: '2026-02-09T09:45:00',
        },
        {
          id: 'tl-002-3',
          type: 'status_change',
          title: 'Advanced to interview',
          description: "You've been selected for the interview round",
          timestamp: '2026-02-10T14:00:00',
        },
        {
          id: 'tl-002-4',
          type: 'interview_scheduled',
          title: 'Interview scheduled',
          description: 'Technical interview on Feb 14 at 2:00 PM CET',
          timestamp: '2026-02-11T10:30:00',
          metadata: { date: '2026-02-14T14:00:00', type: 'Technical' },
        },
      ],
    },
    {
      id: 'capp-003',
      jobTitle: 'Frontend Lead',
      companyName: 'Stripe',
      companyLogoUrl: null,
      companyWebsite: 'https://stripe.com',
      status: 'not_reviewed',
      appliedAt: '2026-02-07',
      updatedAt: '2026-02-07',
      location: 'Remote',
      isRemote: true,
      employmentType: 'full_time',
      experienceLevel: 'lead',
      salaryMin: 200000,
      salaryMax: 280000,
      salaryCurrency: 'USD',
      jobDescription:
        "Stripe is looking for a Frontend Lead to drive the technical vision for our merchant-facing dashboard. You'll lead a team of 6 engineers, define frontend architecture standards, and ensure the dashboard delivers an exceptional user experience at scale.",
      requirements: [
        '7+ years of frontend development experience',
        '2+ years in a technical lead or staff engineer role',
        'Deep expertise in React, TypeScript, and state management',
        'Experience building design systems or component libraries',
        'Track record of mentoring and growing engineers',
      ],
      responsibilities: [
        'Lead technical direction for the merchant dashboard team',
        'Define and evolve frontend architecture and coding standards',
        'Drive adoption of accessibility and performance best practices',
        'Mentor and grow a team of 6 frontend engineers',
        'Partner with product and design leadership on roadmap planning',
      ],
      skills: [
        'React',
        'TypeScript',
        'Design Systems',
        'GraphQL',
        'Performance',
        'A11y',
        'Webpack',
      ],
      coverLetter: null,
      resumeUrl: '/resume-alex-johnson.pdf',
      linkedinUrl: 'https://linkedin.com/in/alexjohnson',
      relevanceScore: 0.85,
      matchFeedback:
        'Strong match! Your frontend expertise and component architecture background are well-suited for this leadership role. Highlighting team management experience would improve your score.',
      matchStrengths: [
        'Extensive React and TypeScript experience exceeds requirements',
        'Design system work demonstrates architectural leadership',
        'Performance and accessibility focus aligns with role priorities',
      ],
      matchGaps: [
        'Emphasize direct team leadership and mentorship accomplishments',
        'No cover letter submitted — adding one could strengthen your application',
      ],
      timeline: [
        {
          id: 'tl-003-1',
          type: 'applied',
          title: 'Application submitted',
          description: 'You applied for Frontend Lead',
          timestamp: '2026-02-07T15:45:00',
        },
        {
          id: 'tl-003-2',
          type: 'reviewed',
          title: 'Profile viewed',
          description: 'A recruiter at Stripe viewed your profile',
          timestamp: '2026-02-08T09:00:00',
        },
      ],
    },
    {
      id: 'capp-004',
      jobTitle: 'React Developer',
      companyName: 'Vercel',
      companyLogoUrl: null,
      companyWebsite: 'https://vercel.com',
      status: 'hired',
      appliedAt: '2026-02-03',
      updatedAt: '2026-02-10',
      location: 'Remote',
      isRemote: true,
      employmentType: 'full_time',
      experienceLevel: 'senior',
      salaryMin: 180000,
      salaryMax: 240000,
      salaryCurrency: 'USD',
      jobDescription:
        "Join Vercel to work on the tools that power the modern web. As a React Developer, you'll contribute to Next.js, Turbopack, and our deployment platform, helping millions of developers build and ship faster.",
      requirements: [
        '4+ years of professional React development',
        'Strong understanding of Next.js and server-side rendering',
        'Experience with build tools and bundlers',
        'Open source contribution experience is a plus',
        'Strong written communication skills for async collaboration',
      ],
      responsibilities: [
        'Build and maintain features for the Vercel dashboard',
        'Contribute to Next.js framework development',
        'Improve developer experience tooling and documentation',
        'Collaborate with the open source community',
      ],
      skills: [
        'React',
        'Next.js',
        'TypeScript',
        'Turbopack',
        'Vercel',
        'Open Source',
      ],
      coverLetter:
        "I've been a Next.js user since v9, and contributing to the Vercel ecosystem has been a long-time goal of mine. I've built several production applications using Next.js and have contributed bug fixes to the framework's GitHub repository.",
      resumeUrl: '/resume-alex-johnson.pdf',
      linkedinUrl: 'https://linkedin.com/in/alexjohnson',
      relevanceScore: 0.96,
      matchFeedback:
        'Exceptional match! Your Next.js expertise and open source contributions make you an ideal candidate. The hiring team has extended an offer based on your strong alignment.',
      matchStrengths: [
        'Production Next.js experience since v9 directly matches role',
        'Open source contributions demonstrate community engagement',
        'Framework-level understanding exceeds typical applicant profiles',
      ],
      matchGaps: [],
      timeline: [
        {
          id: 'tl-004-1',
          type: 'applied',
          title: 'Application submitted',
          description: 'You applied for React Developer',
          timestamp: '2026-02-03T10:00:00',
        },
        {
          id: 'tl-004-2',
          type: 'status_change',
          title: 'Advanced to interview',
          description: 'Your application passed the initial screen',
          timestamp: '2026-02-04T16:00:00',
        },
        {
          id: 'tl-004-3',
          type: 'interview_scheduled',
          title: 'Technical interview completed',
          description: 'Pair programming session with the engineering team',
          timestamp: '2026-02-06T15:00:00',
        },
        {
          id: 'tl-004-4',
          type: 'message_received',
          title: 'Message from hiring manager',
          description: 'Great feedback from the team, moving to final round',
          timestamp: '2026-02-08T11:00:00',
        },
        {
          id: 'tl-004-5',
          type: 'status_change',
          title: 'Offer extended',
          description: 'Congratulations! You received an offer from Vercel',
          timestamp: '2026-02-10T09:00:00',
        },
      ],
    },
    {
      id: 'capp-005',
      jobTitle: 'Software Engineer',
      companyName: 'Meta',
      companyLogoUrl: null,
      companyWebsite: 'https://meta.com',
      status: 'interviewing',
      appliedAt: '2026-02-05',
      updatedAt: '2026-02-10',
      location: 'Menlo Park, CA',
      isRemote: false,
      employmentType: 'full_time',
      experienceLevel: 'senior',
      salaryMin: 190000,
      salaryMax: 260000,
      salaryCurrency: 'USD',
      jobDescription:
        "Meta is hiring Software Engineers to work on our next-generation social products. You'll build features used by billions of people, working with cutting-edge technologies including React, Relay, and our custom infrastructure.",
      requirements: [
        '4+ years of software engineering experience',
        'Strong proficiency in JavaScript/TypeScript and React',
        'Experience with large-scale systems and performance optimization',
        'Computer science fundamentals (data structures, algorithms)',
        'Ability to work in a fast-paced, impact-driven environment',
      ],
      responsibilities: [
        "Design and build new product features for Meta's social platforms",
        'Optimize frontend performance for billions of users',
        'Collaborate cross-functionally with design, product, and data science',
        'Participate in architecture reviews and code quality initiatives',
      ],
      skills: ['React', 'JavaScript', 'Relay', 'GraphQL', 'Flow', 'Hack'],
      coverLetter:
        "I'm drawn to Meta's mission of building technology that brings people together. Having worked extensively with React in production environments, I understand the unique challenges of building at Meta's scale and am excited by the opportunity to impact billions of users.",
      resumeUrl: '/resume-alex-johnson.pdf',
      linkedinUrl: 'https://linkedin.com/in/alexjohnson',
      relevanceScore: 0.81,
      matchFeedback:
        "Good match! Your React expertise is a strong fit, and your production performance experience aligns well. Familiarity with Meta's internal tools would be a differentiator.",
      matchStrengths: [
        'Strong React and JavaScript proficiency matches core stack',
        "Performance optimization experience relevant to Meta's scale",
      ],
      matchGaps: [
        'Experience with Relay and Flow would strengthen your profile',
        'Consider highlighting large-scale system work in your resume',
      ],
      timeline: [
        {
          id: 'tl-005-1',
          type: 'applied',
          title: 'Application submitted',
          description: 'You applied for Software Engineer',
          timestamp: '2026-02-05T13:00:00',
        },
        {
          id: 'tl-005-2',
          type: 'reviewed',
          title: 'Resume screened',
          description: 'Your application passed the initial resume screen',
          timestamp: '2026-02-06T10:00:00',
        },
        {
          id: 'tl-005-3',
          type: 'status_change',
          title: 'Interview stage reached',
          description: "You've been moved to the interview pipeline",
          timestamp: '2026-02-06T14:20:00',
        },
        {
          id: 'tl-005-4',
          type: 'interview_scheduled',
          title: 'Phone screen scheduled',
          description: 'Recruiter phone screen on Feb 12 at 10:00 AM PST',
          timestamp: '2026-02-10T09:00:00',
          metadata: { date: '2026-02-12T10:00:00', type: 'Phone Screen' },
        },
      ],
    },
    {
      id: 'capp-006',
      jobTitle: 'UI Engineer',
      companyName: 'Figma',
      companyLogoUrl: null,
      companyWebsite: 'https://figma.com',
      status: 'rejected',
      appliedAt: '2026-01-28',
      updatedAt: '2026-02-05',
      location: 'San Francisco, CA',
      isRemote: false,
      employmentType: 'full_time',
      experienceLevel: 'senior',
      salaryMin: 170000,
      salaryMax: 230000,
      salaryCurrency: 'USD',
      jobDescription:
        "Figma is looking for a UI Engineer to help build the next generation of collaborative design tools. You'll work at the intersection of design and engineering, creating the interfaces that designers and developers use every day.",
      requirements: [
        '5+ years building complex web applications',
        'Expertise in HTML, CSS, and JavaScript/TypeScript',
        'Experience with canvas rendering or WebGL is a strong plus',
        'Eye for design and attention to detail',
        'Experience building developer-facing tools or APIs',
      ],
      responsibilities: [
        "Build and refine Figma's web-based design tool interface",
        'Implement complex UI interactions with smooth animations',
        'Work closely with designers to ensure pixel-perfect implementation',
        'Optimize rendering performance for complex design files',
      ],
      skills: [
        'TypeScript',
        'React',
        'Canvas API',
        'WebGL',
        'CSS',
        'Performance',
      ],
      coverLetter:
        "As both a developer and a daily Figma user, I have a unique perspective on what makes the tool great and where it can improve. I've built several complex web applications with heavy canvas usage and would love to bring that expertise to the Figma team.",
      resumeUrl: '/resume-alex-johnson.pdf',
      linkedinUrl: 'https://linkedin.com/in/alexjohnson',
      relevanceScore: 0.64,
      matchFeedback:
        "Partial match. While your frontend skills are strong, this role requires deep Canvas API and WebGL experience which isn't prominent in your profile.",
      matchStrengths: [
        'Strong TypeScript and CSS expertise covers foundational needs',
        'Eye for design and UI polish evident in portfolio',
      ],
      matchGaps: [
        'Canvas API and WebGL experience is essential but not demonstrated',
        'Developer-facing tooling experience would significantly help',
      ],
      timeline: [
        {
          id: 'tl-006-1',
          type: 'applied',
          title: 'Application submitted',
          description: 'You applied for UI Engineer',
          timestamp: '2026-01-28T10:30:00',
        },
        {
          id: 'tl-006-2',
          type: 'reviewed',
          title: 'Application reviewed',
          description: 'The hiring team reviewed your profile',
          timestamp: '2026-01-30T14:00:00',
        },
        {
          id: 'tl-006-3',
          type: 'status_change',
          title: 'Application not selected',
          description: 'The team decided to move forward with other candidates',
          timestamp: '2026-02-05T11:00:00',
        },
      ],
    },
    {
      id: 'capp-007',
      jobTitle: 'Platform Engineer',
      companyName: 'Datadog',
      companyLogoUrl: null,
      companyWebsite: 'https://datadoghq.com',
      status: 'under_review',
      appliedAt: '2026-02-09',
      updatedAt: '2026-02-10',
      location: 'New York, NY',
      isRemote: true,
      employmentType: 'full_time',
      experienceLevel: 'senior',
      salaryMin: 175000,
      salaryMax: 235000,
      salaryCurrency: 'USD',
      jobDescription:
        "Datadog is hiring a Platform Engineer to build the internal tools and infrastructure that power our engineering organization. You'll design and implement CI/CD pipelines, developer environments, and platform services that enable hundreds of engineers to ship with confidence.",
      requirements: [
        '4+ years of platform or infrastructure engineering experience',
        'Proficiency in Go, Python, or TypeScript',
        'Experience with Kubernetes, Docker, and cloud providers (AWS/GCP)',
        'Understanding of CI/CD best practices and tooling',
        'Strong debugging and troubleshooting skills',
      ],
      responsibilities: [
        'Design and maintain internal developer platform services',
        'Build and optimize CI/CD pipelines for fast, reliable deployments',
        'Improve developer experience through better tooling and automation',
        'Monitor and improve platform reliability and performance',
        'Document platform services and provide developer support',
      ],
      skills: [
        'Go',
        'Kubernetes',
        'Docker',
        'AWS',
        'Terraform',
        'CI/CD',
        'Python',
      ],
      coverLetter: null,
      resumeUrl: '/resume-alex-johnson.pdf',
      linkedinUrl: 'https://linkedin.com/in/alexjohnson',
      relevanceScore: 0.58,
      matchFeedback:
        "Your application has been submitted. This is primarily an infrastructure role and your profile leans frontend — consider emphasizing any DevOps or platform work you've done.",
      matchStrengths: [
        'TypeScript proficiency covers one of the required languages',
        'Software engineering fundamentals are solid',
      ],
      matchGaps: [
        'Kubernetes, Docker, and cloud provider experience not evident',
        'CI/CD pipeline and infrastructure automation experience needed',
        'Consider pivoting resume to highlight any backend/ops work',
      ],
      timeline: [
        {
          id: 'tl-007-1',
          type: 'applied',
          title: 'Application submitted',
          description: 'You applied for Platform Engineer',
          timestamp: '2026-02-09T14:30:00',
        },
        {
          id: 'tl-007-2',
          type: 'reviewed',
          title: 'Application reviewed',
          description: 'A recruiter viewed your application',
          timestamp: '2026-02-10T11:00:00',
        },
      ],
    },
  ]
