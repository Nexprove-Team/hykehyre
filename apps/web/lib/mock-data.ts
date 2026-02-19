// ── Types (mirroring DB schema for UI layer) ─────────────────────────

export type JobStatus = 'draft' | 'open' | 'paused' | 'filled'
export type EmploymentType =
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'internship'
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive'
export type ApplicationStatus =
  | 'not_reviewed'
  | 'under_review'
  | 'interviewing'
  | 'rejected'
  | 'hired'

export interface MockCompany {
  id: string
  name: string
  website: string | null
  logoUrl: string | null
  description: string | null
}

export interface MockJob {
  id: string
  title: string
  description: string
  status: JobStatus
  employmentType: EmploymentType
  experienceLevel: ExperienceLevel
  location: string | null
  isRemote: boolean
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string
  requirements: string[]
  responsibilities: string[]
  skills: string[]
  createdAt: string
  applicationCount: number
}

export interface MockApplication {
  id: string
  candidateId: string
  jobId: string
  jobTitle: string
  candidateName: string
  candidateEmail: string
  status: ApplicationStatus
  relevanceScore: number | null
  createdAt: string
}

export interface MockCandidateProfile {
  id: string
  name: string
  email: string
  phone: string
  title: string
  location: string
  linkedinUrl: string | null
  dateOfBirth: string
  nationality: string
  experience: string
  skills: string[]
  languages: string[]
  education: {
    degree: string
    institution: string
    years: string
  }[]
  workHistory: {
    role: string
    company: string
    period: string
    highlights: string[]
  }[]
  summary: string
}

export interface MockMessage {
  id: string
  candidateId: string
  sender: 'recruiter' | 'candidate'
  text: string
  timestamp: string
}

export interface MockUser {
  id: string
  name: string
  email: string
  role: 'recruiter'
  companyName: string
}

export interface MockDashboardStats {
  totalJobs: number
  activeJobs: number
  totalApplications: number
  totalCandidates: number
  interviewsScheduled: number
}

// ── Mock Data ────────────────────────────────────────────────────────

export const MOCK_USER: MockUser = {
  id: 'usr-001',
  name: 'Jane Doe',
  email: 'jane@acme.tech',
  role: 'recruiter',
  companyName: 'Acme Technologies',
}

export const MOCK_COMPANY: MockCompany = {
  id: 'comp-001',
  name: 'Acme Technologies',
  website: 'https://acme.tech',
  logoUrl: null,
  description: 'Building the future of work',
}

export const MOCK_STATS: MockDashboardStats = {
  totalJobs: 12,
  activeJobs: 8,
  totalApplications: 64,
  totalCandidates: 248,
  interviewsScheduled: 8,
}

export const MOCK_JOBS: MockJob[] = [
  {
    id: 'job-001',
    title: 'Senior Frontend Engineer',
    description:
      "We're looking for a Senior Frontend Engineer to lead our web platform development. You'll architect scalable React applications, mentor junior developers, and collaborate closely with design and product teams to ship delightful user experiences.",
    status: 'open',
    employmentType: 'full_time',
    experienceLevel: 'senior',
    location: 'San Francisco, CA',
    isRemote: true,
    salaryMin: 150000,
    salaryMax: 200000,
    salaryCurrency: 'USD',
    requirements: [
      '5+ years React',
      'TypeScript proficiency',
      'System design experience',
    ],
    responsibilities: [
      'Lead frontend architecture',
      'Mentor junior developers',
      'Ship product features',
    ],
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
    createdAt: '2026-02-01',
    applicationCount: 24,
  },
  {
    id: 'job-002',
    title: 'Backend Engineer',
    description:
      "Join our backend team to design and build robust APIs powering our platform. You'll work with Node.js and PostgreSQL, optimizing queries and ensuring system reliability at scale.",
    status: 'open',
    employmentType: 'full_time',
    experienceLevel: 'mid',
    location: 'New York, NY',
    isRemote: false,
    salaryMin: 120000,
    salaryMax: 160000,
    salaryCurrency: 'USD',
    requirements: ['3+ years Node.js', 'PostgreSQL', 'REST/GraphQL APIs'],
    responsibilities: [
      'Design and build APIs',
      'Optimize database queries',
      'Write tests',
    ],
    skills: ['Node.js', 'PostgreSQL', 'TypeScript', 'Docker'],
    createdAt: '2026-02-03',
    applicationCount: 18,
  },
  {
    id: 'job-003',
    title: 'Product Designer',
    description:
      'We need a Product Designer to own the end-to-end design process — from user research and wireframing to high-fidelity prototypes and design system management.',
    status: 'paused',
    employmentType: 'full_time',
    experienceLevel: 'senior',
    location: 'London, UK',
    isRemote: true,
    salaryMin: 90000,
    salaryMax: 130000,
    salaryCurrency: 'GBP',
    requirements: ['5+ years UX/UI', 'Figma expertise', 'Design systems'],
    responsibilities: [
      'Lead product design',
      'Run user research',
      'Build design system',
    ],
    skills: ['Figma', 'User Research', 'Design Systems', 'Prototyping'],
    createdAt: '2026-01-20',
    applicationCount: 31,
  },
  {
    id: 'job-004',
    title: 'DevOps Engineer',
    description:
      "We're hiring a DevOps Engineer to manage our cloud infrastructure, build CI/CD pipelines, and ensure our services are resilient, secure, and performant.",
    status: 'draft',
    employmentType: 'contract',
    experienceLevel: 'senior',
    location: 'Remote',
    isRemote: true,
    salaryMin: 140000,
    salaryMax: 180000,
    salaryCurrency: 'USD',
    requirements: ['AWS/GCP', 'Kubernetes', 'CI/CD pipelines'],
    responsibilities: [
      'Manage cloud infrastructure',
      'Automate deployments',
      'Monitor systems',
    ],
    skills: ['AWS', 'Kubernetes', 'Terraform', 'GitHub Actions'],
    createdAt: '2026-02-07',
    applicationCount: 0,
  },
  {
    id: 'job-005',
    title: 'Marketing Intern',
    description:
      "A hands-on internship for a motivated marketing student. You'll assist with campaigns, create social media content, and learn to analyze marketing metrics in a fast-paced startup environment.",
    status: 'filled',
    employmentType: 'internship',
    experienceLevel: 'entry',
    location: 'Austin, TX',
    isRemote: false,
    salaryMin: 25,
    salaryMax: 35,
    salaryCurrency: 'USD',
    requirements: ['Currently enrolled in university', 'Strong communication'],
    responsibilities: [
      'Assist with campaigns',
      'Create social content',
      'Analyze metrics',
    ],
    skills: ['Social Media', 'Copywriting', 'Analytics'],
    createdAt: '2026-01-10',
    applicationCount: 42,
  },
  {
    id: 'job-006',
    title: 'Full Stack Developer',
    description:
      "We're seeking a Full Stack Developer to build end-to-end features across our React frontend and Node.js backend. You'll ship code to production daily and participate in architecture discussions.",
    status: 'open',
    employmentType: 'full_time',
    experienceLevel: 'mid',
    location: 'Berlin, DE',
    isRemote: true,
    salaryMin: 70000,
    salaryMax: 95000,
    salaryCurrency: 'EUR',
    requirements: ['React + Node.js', '3+ years experience', 'Git'],
    responsibilities: [
      'Build end-to-end features',
      'Participate in code reviews',
      'Deploy to production',
    ],
    skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
    createdAt: '2026-02-05',
    applicationCount: 15,
  },
]

export const MOCK_APPLICATIONS: MockApplication[] = [
  {
    id: 'app-001',
    candidateId: 'cand-001',
    jobId: 'job-001',
    jobTitle: 'Senior Frontend Engineer',
    candidateName: 'Alex Johnson',
    candidateEmail: 'alex@example.com',
    status: 'under_review',
    relevanceScore: 0.92,
    createdAt: '2026-02-08T14:30:00',
  },
  {
    id: 'app-002',
    candidateId: 'cand-002',
    jobId: 'job-001',
    jobTitle: 'Senior Frontend Engineer',
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya@example.com',
    status: 'interviewing',
    relevanceScore: 0.88,
    createdAt: '2026-02-08T11:15:00',
  },
  {
    id: 'app-003',
    candidateId: 'cand-003',
    jobId: 'job-002',
    jobTitle: 'Backend Engineer',
    candidateName: 'Marcus Chen',
    candidateEmail: 'marcus@example.com',
    status: 'not_reviewed',
    relevanceScore: 0.75,
    createdAt: '2026-02-08T09:00:00',
  },
  {
    id: 'app-004',
    candidateId: 'cand-004',
    jobId: 'job-003',
    jobTitle: 'Product Designer',
    candidateName: 'Sarah Williams',
    candidateEmail: 'sarah@example.com',
    status: 'hired',
    relevanceScore: 0.95,
    createdAt: '2026-02-07T16:45:00',
  },
  {
    id: 'app-005',
    candidateId: 'cand-005',
    jobId: 'job-001',
    jobTitle: 'Senior Frontend Engineer',
    candidateName: 'David Kim',
    candidateEmail: 'david@example.com',
    status: 'rejected',
    relevanceScore: 0.42,
    createdAt: '2026-02-07T10:20:00',
  },
  {
    id: 'app-006',
    candidateId: 'cand-006',
    jobId: 'job-006',
    jobTitle: 'Full Stack Developer',
    candidateName: 'Emma Müller',
    candidateEmail: 'emma@example.com',
    status: 'not_reviewed',
    relevanceScore: 0.81,
    createdAt: '2026-02-08T17:00:00',
  },
  {
    id: 'app-007',
    candidateId: 'cand-007',
    jobId: 'job-002',
    jobTitle: 'Backend Engineer',
    candidateName: 'James Okafor',
    candidateEmail: 'james@example.com',
    status: 'under_review',
    relevanceScore: 0.86,
    createdAt: '2026-02-07T13:30:00',
  },
  {
    id: 'app-008',
    candidateId: 'cand-008',
    jobId: 'job-006',
    jobTitle: 'Full Stack Developer',
    candidateName: 'Lina Petrov',
    candidateEmail: 'lina@example.com',
    status: 'interviewing',
    relevanceScore: 0.79,
    createdAt: '2026-02-06T15:10:00',
  },
]

export const MOCK_CANDIDATES: MockCandidateProfile[] = [
  {
    id: 'cand-001',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+1 415-555-0123',
    title: 'Senior Frontend Engineer',
    location: 'San Francisco, CA',
    linkedinUrl: 'linkedin.com/in/alexjohnson',
    dateOfBirth: '15 Mar, 1994',
    nationality: 'American',
    experience: '6 Years',
    skills: [
      'React',
      'TypeScript',
      'Next.js',
      'Tailwind CSS',
      'GraphQL',
      'Node.js',
    ],
    languages: ['English', 'Spanish'],
    education: [
      {
        degree: 'B.S. Computer Science',
        institution: 'Stanford University',
        years: '2012 – 2016',
      },
    ],
    workHistory: [
      {
        role: 'Senior Frontend Engineer',
        company: 'Stripe',
        period: 'Jan 2022 – Present',
        highlights: [
          'Led the redesign of the Stripe Dashboard, serving 3M+ users',
          'Built a shared component library adopted across 5 teams',
          'Mentored 4 junior engineers through pair programming',
        ],
      },
      {
        role: 'Frontend Engineer',
        company: 'Airbnb',
        period: 'Jun 2018 – Dec 2021',
        highlights: [
          'Developed search experience used by millions of guests',
          'Reduced bundle size by 35% through code splitting',
        ],
      },
    ],
    summary:
      'Passionate frontend engineer with 6+ years building high-performance web applications. Deep expertise in React ecosystem and design systems. Focused on developer experience and accessibility.',
  },
  {
    id: 'cand-002',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+44 20-7946-0958',
    title: 'Full Stack Developer',
    location: 'London, UK',
    linkedinUrl: 'linkedin.com/in/priyasharma',
    dateOfBirth: '22 Aug, 1996',
    nationality: 'British-Indian',
    experience: '4 Years',
    skills: ['React', 'TypeScript', 'Python', 'Django', 'PostgreSQL', 'AWS'],
    languages: ['English', 'Hindi', 'Punjabi'],
    education: [
      {
        degree: 'M.Sc. Software Engineering',
        institution: 'Imperial College London',
        years: '2018 – 2020',
      },
      {
        degree: 'B.Tech Information Technology',
        institution: 'IIT Delhi',
        years: '2014 – 2018',
      },
    ],
    workHistory: [
      {
        role: 'Full Stack Developer',
        company: 'Revolut',
        period: 'Mar 2021 – Present',
        highlights: [
          'Built real-time payment tracking dashboard for 20M+ users',
          'Designed and implemented microservices architecture',
        ],
      },
    ],
    summary:
      'Versatile developer comfortable across the stack. Passionate about fintech and building products that make financial services accessible to everyone.',
  },
  {
    id: 'cand-003',
    name: 'Marcus Chen',
    email: 'marcus@example.com',
    phone: '+1 212-555-0456',
    title: 'Backend Engineer',
    location: 'New York, NY',
    linkedinUrl: 'linkedin.com/in/marcuschen',
    dateOfBirth: '10 Jan, 1993',
    nationality: 'American',
    experience: '5 Years',
    skills: ['Node.js', 'Go', 'PostgreSQL', 'Redis', 'Kubernetes', 'gRPC'],
    languages: ['English', 'Mandarin'],
    education: [
      {
        degree: 'B.S. Computer Engineering',
        institution: 'MIT',
        years: '2011 – 2015',
      },
    ],
    workHistory: [
      {
        role: 'Backend Engineer',
        company: 'Datadog',
        period: 'Sep 2021 – Present',
        highlights: [
          'Designed ingestion pipeline handling 10B+ events/day',
          'Reduced API latency by 40% through query optimization',
        ],
      },
      {
        role: 'Software Engineer',
        company: 'Bloomberg',
        period: 'Jul 2017 – Aug 2021',
        highlights: [
          'Built real-time data streaming platform for financial analytics',
          'Implemented distributed caching layer using Redis',
        ],
      },
    ],
    summary:
      'Backend engineer focused on building resilient, high-throughput systems. Strong background in distributed systems and data engineering.',
  },
  {
    id: 'cand-004',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    phone: '+44 20-7123-4567',
    title: 'Product Designer',
    location: 'London, UK',
    linkedinUrl: 'linkedin.com/in/sarahwilliams',
    dateOfBirth: '05 Jun, 1995',
    nationality: 'British',
    experience: '5 Years',
    skills: [
      'Figma',
      'User Research',
      'Design Systems',
      'Prototyping',
      'Framer',
      'UI/UX',
    ],
    languages: ['English', 'French'],
    education: [
      {
        degree: 'M.A. Interaction Design',
        institution: 'Royal College of Art',
        years: '2017 – 2019',
      },
    ],
    workHistory: [
      {
        role: 'Senior Product Designer',
        company: 'Monzo',
        period: 'Feb 2021 – Present',
        highlights: [
          'Led redesign of onboarding flow, improving completion by 25%',
          'Built and maintained the Monzo design system',
        ],
      },
    ],
    summary:
      'Product designer passionate about creating intuitive, user-centered experiences. Specializes in fintech and design systems.',
  },
  {
    id: 'cand-005',
    name: 'David Kim',
    email: 'david@example.com',
    phone: '+1 310-555-0789',
    title: 'Junior Frontend Developer',
    location: 'Los Angeles, CA',
    linkedinUrl: 'linkedin.com/in/davidkim',
    dateOfBirth: '18 Nov, 1999',
    nationality: 'Korean-American',
    experience: '1 Year',
    skills: ['React', 'JavaScript', 'HTML/CSS', 'Tailwind CSS'],
    languages: ['English', 'Korean'],
    education: [
      {
        degree: 'B.S. Computer Science',
        institution: 'UCLA',
        years: '2017 – 2021',
      },
    ],
    workHistory: [
      {
        role: 'Frontend Developer',
        company: 'Freelance',
        period: 'Jan 2025 – Present',
        highlights: [
          'Built e-commerce sites for small businesses',
          'Completed 15+ client projects using React and Next.js',
        ],
      },
    ],
    summary:
      'Early-career frontend developer eager to learn and grow. Self-taught with a strong portfolio of freelance work.',
  },
  {
    id: 'cand-006',
    name: 'Emma Müller',
    email: 'emma@example.com',
    phone: '+49 30-1234-5678',
    title: 'Full Stack Developer',
    location: 'Berlin, DE',
    linkedinUrl: 'linkedin.com/in/emmamuller',
    dateOfBirth: '30 Apr, 1994',
    nationality: 'German',
    experience: '5 Years',
    skills: [
      'React',
      'Node.js',
      'TypeScript',
      'PostgreSQL',
      'Docker',
      'GraphQL',
    ],
    languages: ['German', 'English', 'French'],
    education: [
      {
        degree: 'M.Sc. Computer Science',
        institution: 'TU Berlin',
        years: '2016 – 2018',
      },
    ],
    workHistory: [
      {
        role: 'Full Stack Developer',
        company: 'N26',
        period: 'Apr 2020 – Present',
        highlights: [
          'Developed customer verification pipeline serving 7M+ users',
          'Led migration from monolith to microservices architecture',
        ],
      },
    ],
    summary:
      'Full stack developer with a passion for clean architecture and developer tooling. Experienced in fintech and banking applications.',
  },
  {
    id: 'cand-007',
    name: 'James Okafor',
    email: 'james@example.com',
    phone: '+234 801-555-0321',
    title: 'Backend Engineer',
    location: 'Lagos, NG',
    linkedinUrl: 'linkedin.com/in/jamesokafor',
    dateOfBirth: '12 Sep, 1992',
    nationality: 'Nigerian',
    experience: '7 Years',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'AWS', 'Terraform'],
    languages: ['English', 'Yoruba', 'Igbo'],
    education: [
      {
        degree: 'B.Sc. Computer Science',
        institution: 'University of Lagos',
        years: '2010 – 2014',
      },
    ],
    workHistory: [
      {
        role: 'Senior Backend Engineer',
        company: 'Paystack',
        period: 'Jan 2020 – Present',
        highlights: [
          'Built payment processing engine handling $1B+ in transactions',
          'Designed fraud detection system reducing chargebacks by 60%',
        ],
      },
      {
        role: 'Backend Developer',
        company: 'Andela',
        period: 'Aug 2016 – Dec 2019',
        highlights: [
          'Developed RESTful APIs for talent management platform',
          'Implemented automated testing reducing bug rate by 45%',
        ],
      },
    ],
    summary:
      "Seasoned backend engineer with deep expertise in payments infrastructure. Passionate about building technology that powers Africa's digital economy.",
  },
  {
    id: 'cand-008',
    name: 'Lina Petrov',
    email: 'lina@example.com',
    phone: '+7 495-555-0654',
    title: 'Full Stack Developer',
    location: 'Remote (Moscow, RU)',
    linkedinUrl: 'linkedin.com/in/linapetrov',
    dateOfBirth: '25 Feb, 1997',
    nationality: 'Russian',
    experience: '3 Years',
    skills: ['React', 'Vue.js', 'Node.js', 'TypeScript', 'Docker', 'CI/CD'],
    languages: ['Russian', 'English', 'German'],
    education: [
      {
        degree: 'B.Sc. Applied Mathematics',
        institution: 'Moscow State University',
        years: '2015 – 2019',
      },
    ],
    workHistory: [
      {
        role: 'Full Stack Developer',
        company: 'JetBrains',
        period: 'Jun 2022 – Present',
        highlights: [
          'Built developer tools used by 10M+ developers globally',
          'Contributed to IDE plugin marketplace frontend',
        ],
      },
    ],
    summary:
      'Full stack developer with a mathematical background. Enjoys building developer tools and optimizing complex systems.',
  },
]

export const MOCK_MESSAGES: MockMessage[] = [
  // Alex Johnson
  {
    id: 'msg-001',
    candidateId: 'cand-001',
    sender: 'recruiter',
    text: 'Hi Alex, thanks for applying to the Senior Frontend Engineer role. Your experience at Stripe really stood out to us!',
    timestamp: '2026-02-08T10:00:00',
  },
  {
    id: 'msg-002',
    candidateId: 'cand-001',
    sender: 'candidate',
    text: "Thank you! I'm really excited about this opportunity. I've been following HackHyre's work and love what you're building.",
    timestamp: '2026-02-08T10:15:00',
  },
  {
    id: 'msg-003',
    candidateId: 'cand-001',
    sender: 'recruiter',
    text: "Great to hear! Would you be available for a quick intro call this week? We'd love to learn more about your design system experience.",
    timestamp: '2026-02-08T10:22:00',
  },
  {
    id: 'msg-004',
    candidateId: 'cand-001',
    sender: 'candidate',
    text: "Absolutely! I'm free Thursday or Friday afternoon. Would either of those work?",
    timestamp: '2026-02-08T11:05:00',
  },
  {
    id: 'msg-005',
    candidateId: 'cand-001',
    sender: 'recruiter',
    text: "Thursday at 2pm works perfectly. I'll send over a calendar invite shortly.",
    timestamp: '2026-02-08T11:10:00',
  },
  // Priya Sharma
  {
    id: 'msg-006',
    candidateId: 'cand-002',
    sender: 'recruiter',
    text: "Hi Priya, we were impressed by your full stack background at Revolut. We'd love to chat about the Senior Frontend role.",
    timestamp: '2026-02-08T09:00:00',
  },
  {
    id: 'msg-007',
    candidateId: 'cand-002',
    sender: 'candidate',
    text: "Hi! Thanks so much for reaching out. I'd love to learn more about the team and tech stack.",
    timestamp: '2026-02-08T09:30:00',
  },
  {
    id: 'msg-008',
    candidateId: 'cand-002',
    sender: 'recruiter',
    text: "We're using Next.js, TypeScript, and Tailwind. The team is about 8 engineers. Want to do a 30-min video call?",
    timestamp: '2026-02-08T09:45:00',
  },
  // Marcus Chen
  {
    id: 'msg-009',
    candidateId: 'cand-003',
    sender: 'recruiter',
    text: "Hi Marcus, your application for the Backend Engineer role looks great. Your work on Datadog's ingestion pipeline is very relevant to what we're building.",
    timestamp: '2026-02-08T14:00:00',
  },
  // James Okafor
  {
    id: 'msg-010',
    candidateId: 'cand-007',
    sender: 'recruiter',
    text: "James, thanks for applying! Your payments experience at Paystack is exactly what we're looking for.",
    timestamp: '2026-02-07T15:00:00',
  },
  {
    id: 'msg-011',
    candidateId: 'cand-007',
    sender: 'candidate',
    text: "Thanks for getting back to me! I'm very interested in the Backend Engineer position. Building payment infrastructure is my passion.",
    timestamp: '2026-02-07T15:30:00',
  },
  {
    id: 'msg-012',
    candidateId: 'cand-007',
    sender: 'recruiter',
    text: "That's great to hear. Can you tell me a bit more about the fraud detection system you built? We're tackling something similar.",
    timestamp: '2026-02-07T15:45:00',
  },
  {
    id: 'msg-013',
    candidateId: 'cand-007',
    sender: 'candidate',
    text: 'Sure! We used a combination of rule-based checks and an ML model trained on historical chargeback data. It reduced chargebacks by 60% in the first quarter. Happy to walk through the architecture on a call.',
    timestamp: '2026-02-07T16:10:00',
  },
]

export const MOCK_CHART_DATA = [
  { date: 'Mon', applications: 8 },
  { date: 'Tue', applications: 12 },
  { date: 'Wed', applications: 6 },
  { date: 'Thu', applications: 15 },
  { date: 'Fri', applications: 11 },
  { date: 'Sat', applications: 4 },
  { date: 'Sun', applications: 8 },
]

export const MOCK_AI_PARSED_JOB = {
  title: 'Full Stack Developer',
  description:
    'We are seeking a passionate Full Stack Developer to join our growing engineering team. You will work on building and maintaining modern web applications using React and Node.js, collaborating closely with designers and product managers to deliver exceptional user experiences.',
  employmentType: 'full_time' as EmploymentType,
  experienceLevel: 'mid' as ExperienceLevel,
  location: 'New York, NY',
  isRemote: true,
  salaryMin: 120000,
  salaryMax: 160000,
  salaryCurrency: 'USD',
  requirements: [
    '3+ years full stack experience',
    'Proficiency in Node.js and React',
    'Experience with PostgreSQL or similar RDBMS',
    'Strong communication skills',
  ],
  responsibilities: [
    'Build and maintain web applications end-to-end',
    'Collaborate with design and product teams',
    'Write comprehensive tests and documentation',
    'Participate in code reviews and architecture discussions',
  ],
  skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'Docker'],
}

// ── Interview Types & Mock Data ───────────────────────────────────────

export type InterviewStatus =
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show'
export type InterviewType = 'screening' | 'technical' | 'behavioral' | 'final'

export interface MockInterview {
  id: string
  candidateId: string
  candidateName: string
  candidateEmail: string
  jobId: string
  jobTitle: string
  scheduledAt: string
  duration: number
  meetLink: string
  status: InterviewStatus
  interviewType: InterviewType
  notes: string | null
}

const today = new Date().toISOString().slice(0, 10)

export const MOCK_INTERVIEWS: MockInterview[] = [
  {
    id: 'int-001',
    candidateId: 'cand-001',
    candidateName: 'Alex Johnson',
    candidateEmail: 'alex@example.com',
    jobId: 'job-001',
    jobTitle: 'Senior Frontend Engineer',
    scheduledAt: `${today}T10:00:00`,
    duration: 45,
    meetLink: 'https://meet.google.com/abc-defg-hij',
    status: 'scheduled',
    interviewType: 'screening',
    notes: 'Initial screening call. Discuss React experience and team fit.',
  },
  {
    id: 'int-002',
    candidateId: 'cand-002',
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya@example.com',
    jobId: 'job-001',
    jobTitle: 'Senior Frontend Engineer',
    scheduledAt: `${today}T14:00:00`,
    duration: 60,
    meetLink: 'https://meet.google.com/klm-nopq-rst',
    status: 'in_progress',
    interviewType: 'technical',
    notes: 'Live coding session — React component design and state management.',
  },
  {
    id: 'int-003',
    candidateId: 'cand-003',
    candidateName: 'Marcus Chen',
    candidateEmail: 'marcus@example.com',
    jobId: 'job-002',
    jobTitle: 'Backend Engineer',
    scheduledAt: `${today}T16:30:00`,
    duration: 30,
    meetLink: 'https://meet.google.com/uvw-xyza-bcd',
    status: 'scheduled',
    interviewType: 'screening',
    notes: null,
  },
  {
    id: 'int-004',
    candidateId: 'cand-004',
    candidateName: 'Sarah Williams',
    candidateEmail: 'sarah@example.com',
    jobId: 'job-003',
    jobTitle: 'Product Designer',
    scheduledAt: '2026-02-15T11:00:00',
    duration: 45,
    meetLink: 'https://meet.google.com/efg-hijk-lmn',
    status: 'completed',
    interviewType: 'behavioral',
    notes: 'Great cultural fit. Strong portfolio presentation. Recommend advancing to final round.',
  },
  {
    id: 'int-005',
    candidateId: 'cand-006',
    candidateName: 'Emma Müller',
    candidateEmail: 'emma@example.com',
    jobId: 'job-006',
    jobTitle: 'Full Stack Developer',
    scheduledAt: '2026-02-20T09:00:00',
    duration: 60,
    meetLink: 'https://meet.google.com/opq-rstu-vwx',
    status: 'scheduled',
    interviewType: 'technical',
    notes: 'Focus on system design and full stack architecture.',
  },
  {
    id: 'int-006',
    candidateId: 'cand-007',
    candidateName: 'James Okafor',
    candidateEmail: 'james@example.com',
    jobId: 'job-002',
    jobTitle: 'Backend Engineer',
    scheduledAt: '2026-02-13T15:00:00',
    duration: 45,
    meetLink: 'https://meet.google.com/yza-bcde-fgh',
    status: 'completed',
    interviewType: 'technical',
    notes: 'Excellent technical depth. Payment systems knowledge is outstanding.',
  },
  {
    id: 'int-007',
    candidateId: 'cand-008',
    candidateName: 'Lina Petrov',
    candidateEmail: 'lina@example.com',
    jobId: 'job-006',
    jobTitle: 'Full Stack Developer',
    scheduledAt: '2026-02-19T13:00:00',
    duration: 30,
    meetLink: 'https://meet.google.com/ijk-lmno-pqr',
    status: 'scheduled',
    interviewType: 'screening',
    notes: 'Quick intro call to discuss remote work expectations.',
  },
  {
    id: 'int-008',
    candidateId: 'cand-005',
    candidateName: 'David Kim',
    candidateEmail: 'david@example.com',
    jobId: 'job-001',
    jobTitle: 'Senior Frontend Engineer',
    scheduledAt: '2026-02-10T10:00:00',
    duration: 45,
    meetLink: 'https://meet.google.com/stu-vwxy-zab',
    status: 'cancelled',
    interviewType: 'screening',
    notes: 'Candidate withdrew application.',
  },
  {
    id: 'int-009',
    candidateId: 'cand-002',
    candidateName: 'Priya Sharma',
    candidateEmail: 'priya@example.com',
    jobId: 'job-001',
    jobTitle: 'Senior Frontend Engineer',
    scheduledAt: '2026-02-12T10:30:00',
    duration: 60,
    meetLink: 'https://meet.google.com/cde-fghi-jkl',
    status: 'completed',
    interviewType: 'final',
    notes: 'Final round with CTO. Strong hire recommendation.',
  },
  {
    id: 'int-010',
    candidateId: 'cand-003',
    candidateName: 'Marcus Chen',
    candidateEmail: 'marcus@example.com',
    jobId: 'job-002',
    jobTitle: 'Backend Engineer',
    scheduledAt: '2026-02-11T14:00:00',
    duration: 45,
    meetLink: 'https://meet.google.com/mno-pqrs-tuv',
    status: 'no_show',
    interviewType: 'technical',
    notes: 'Candidate did not join. Follow-up email sent.',
  },
]

// Voice mode AI conversation script
export const VOICE_AI_SCRIPT = [
  {
    field: null,
    response:
      "Hi! I'm here to help you create a job listing. What position are you looking to fill?",
  },
  {
    field: 'title',
    response:
      'Great choice! Is this a full-time, part-time, contract, or internship position?',
  },
  {
    field: 'employmentType',
    response:
      'Got it. What experience level are you looking for — entry, mid, senior, lead, or executive?',
  },
  {
    field: 'experienceLevel',
    response: 'Where is this role based? And will it be remote-friendly?',
  },
  {
    field: 'location',
    response: 'What salary range are you offering for this position?',
  },
  {
    field: 'salary',
    response: 'Now, can you describe the main responsibilities of this role?',
  },
  {
    field: 'responsibilities',
    response:
      'What are the key requirements or qualifications candidates should have?',
  },
  {
    field: 'requirements',
    response:
      'Last one — what technical or soft skills should candidates bring?',
  },
  {
    field: 'skills',
    response:
      "Your job listing is looking great! You can review it on the right and click 'Create Job' when you're happy with it.",
  },
]
