// ── Analytics Mock Data ──────────────────────────────────────────────

export const ANALYTICS_STATS = [
  {
    label: 'Total Applications',
    value: '64',
    trend: '+12% from last month',
    icon: 'Chart' as const,
  },
  {
    label: 'Avg. Time to Hire',
    value: '18 days',
    trend: '-3 days improvement',
    icon: 'Clock' as const,
  },
  {
    label: 'Offer Accept Rate',
    value: '78%',
    trend: '+5% from last quarter',
    icon: 'TickCircle' as const,
  },
  {
    label: 'Active Jobs',
    value: '8',
    trend: '3 new this month',
    icon: 'Briefcase' as const,
  },
]

export const APPLICATION_TRENDS = [
  { week: 'W1', applications: 8, interviews: 3, offers: 1 },
  { week: 'W2', applications: 12, interviews: 5, offers: 2 },
  { week: 'W3', applications: 15, interviews: 6, offers: 1 },
  { week: 'W4', applications: 10, interviews: 4, offers: 3 },
  { week: 'W5', applications: 18, interviews: 8, offers: 2 },
  { week: 'W6', applications: 22, interviews: 9, offers: 4 },
  { week: 'W7', applications: 16, interviews: 7, offers: 2 },
  { week: 'W8', applications: 20, interviews: 10, offers: 3 },
  { week: 'W9', applications: 25, interviews: 11, offers: 5 },
  { week: 'W10', applications: 19, interviews: 8, offers: 3 },
  { week: 'W11', applications: 28, interviews: 12, offers: 4 },
  { week: 'W12', applications: 32, interviews: 14, offers: 6 },
]

export const HIRING_PIPELINE = [
  { stage: 'Applied', count: 64, color: 'var(--chart-1)' },
  { stage: 'Screened', count: 42, color: 'var(--chart-2)' },
  { stage: 'Interviewed', count: 28, color: 'var(--chart-3)' },
  { stage: 'Offered', count: 12, color: 'var(--chart-4)' },
  { stage: 'Hired', count: 8, color: 'var(--chart-5)' },
]

export const JOB_PERFORMANCE = [
  { title: 'Sr. Frontend', applications: 24, interviews: 10, hires: 2 },
  { title: 'Backend Eng.', applications: 18, interviews: 8, hires: 1 },
  { title: 'Product Designer', applications: 31, interviews: 12, hires: 3 },
  { title: 'DevOps Eng.', applications: 9, interviews: 4, hires: 0 },
  { title: 'Full Stack Dev', applications: 15, interviews: 6, hires: 2 },
  { title: 'Marketing Intern', applications: 42, interviews: 15, hires: 1 },
]

export const SOURCE_BREAKDOWN = [
  { source: 'LinkedIn', count: 28, fill: 'var(--chart-1)' },
  { source: 'Direct', count: 14, fill: 'var(--chart-2)' },
  { source: 'Referral', count: 10, fill: 'var(--chart-3)' },
  { source: 'Indeed', count: 8, fill: 'var(--chart-4)' },
  { source: 'Other', count: 4, fill: 'var(--chart-5)' },
]

export const TIME_TO_HIRE = [
  { role: 'Sr. Frontend', days: 22 },
  { role: 'Backend Eng.', days: 18 },
  { role: 'Product Designer', days: 15 },
  { role: 'DevOps Eng.', days: 25 },
  { role: 'Full Stack Dev', days: 12 },
]

export const AI_INSIGHTS = {
  summary:
    'Your hiring pipeline is performing above industry average. Application volume increased 18% this month with a strong conversion rate at the interview stage. Consider expanding sourcing channels to improve top-of-funnel diversity.',
  healthScore: 82,
  metrics: [
    { label: 'Pipeline Velocity', value: '4.2 days', change: '-12%' },
    { label: 'Candidate Quality', value: '78%', change: '+8%' },
    { label: 'Response Rate', value: '92%', change: '+3%' },
    { label: 'Conversion Rate', value: '12.5%', change: '+2.1%' },
  ],
}

export const AI_RECOMMENDATIONS = [
  {
    title: 'Expand LinkedIn sourcing',
    description:
      'LinkedIn drives 44% of applications. Increasing sponsored posts could yield 20% more candidates.',
    priority: 'high' as const,
    impact: '+20% candidates',
  },
  {
    title: 'Reduce screening bottleneck',
    description:
      'Average screening time is 4.2 days. Automating initial screening could cut this to under 2 days.',
    priority: 'high' as const,
    impact: '-50% screen time',
  },
  {
    title: 'Improve DevOps job listing',
    description:
      'DevOps role has the lowest application rate. Consider revising the job description and salary range.',
    priority: 'medium' as const,
    impact: '+15% applications',
  },
  {
    title: 'Add referral incentives',
    description:
      'Referral candidates have a 3x higher hire rate. A structured referral program could boost quality hires.',
    priority: 'low' as const,
    impact: '+30% quality hires',
  },
]

export const AI_TRENDS = [
  {
    period: 'This Week',
    insight:
      'Application velocity is up 22% compared to last week, driven primarily by the Senior Frontend Engineer role.',
  },
  {
    period: 'This Month',
    insight:
      'Time-to-hire improved by 3 days on average. The Product Designer role was filled fastest at 15 days.',
  },
  {
    period: 'This Quarter',
    insight:
      'Overall offer acceptance rate improved from 73% to 78%. Candidate quality scores trending upward across all roles.',
  },
]
