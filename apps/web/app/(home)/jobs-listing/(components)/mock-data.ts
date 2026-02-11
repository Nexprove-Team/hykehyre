// ── Types ──────────────────────────────────────────────────────────────

export interface Job {
  id: string
  date: string
  company: string
  title: string
  logoColor: string
  logoLetter: string
  tags: string[]
  salary: string
  salaryHourly: number
  location: string
  locationType: 'remote' | 'onsite' | 'hybrid'
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead'
  workingSchedule: string[]
  employmentType: string[]
  cardColor: string
  dateBadgeColor: string
  saved: boolean
  featured?: boolean
}

export interface Recruiter {
  id: string
  name: string
  logoColor: string
  logoLetter: string
  jobCount: number
}

// ── Card color palette (cycles) ────────────────────────────────────────

const CARD_STYLES = [
  { cardColor: 'bg-orange-50/70', dateBadgeColor: 'bg-orange-100 text-orange-700' },
  { cardColor: 'bg-emerald-50/70', dateBadgeColor: 'bg-emerald-100 text-emerald-700' },
  { cardColor: 'bg-purple-50/70', dateBadgeColor: 'bg-purple-100 text-purple-700' },
  { cardColor: 'bg-sky-50/70', dateBadgeColor: 'bg-sky-100 text-sky-700' },
  { cardColor: 'bg-rose-50/70', dateBadgeColor: 'bg-rose-100 text-rose-700' },
  { cardColor: 'bg-zinc-50/70', dateBadgeColor: 'bg-zinc-100 text-zinc-600' },
  { cardColor: 'bg-amber-50/70', dateBadgeColor: 'bg-amber-100 text-amber-700' },
  { cardColor: 'bg-teal-50/70', dateBadgeColor: 'bg-teal-100 text-teal-700' },
  { cardColor: 'bg-indigo-50/70', dateBadgeColor: 'bg-indigo-100 text-indigo-700' },
]

// ── Mock Jobs ──────────────────────────────────────────────────────────

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    date: '20 May, 2023',
    company: 'Amazon',
    title: 'Senior UI/UX Designer',
    logoColor: 'bg-black',
    logoLetter: 'a',
    tags: ['Part time', 'Senior level', 'Distant', 'Project work'],
    salary: '$250/hr',
    salaryHourly: 250,
    location: 'San Francisco, CA',
    locationType: 'remote',
    experienceLevel: 'senior',
    workingSchedule: ['Part time'],
    employmentType: ['Distant work', 'Flexible schedule'],
    ...CARD_STYLES[0]!,
    saved: false,
  },
  {
    id: '2',
    date: '4 Feb, 2023',
    company: 'Google',
    title: 'Junior UI/UX Designer',
    logoColor: 'bg-blue-500',
    logoLetter: 'G',
    tags: ['Full time', 'Junior level', 'Distant', 'Project work', 'Flexible Schedule'],
    salary: '$150/hr',
    salaryHourly: 150,
    location: 'California, CA',
    locationType: 'hybrid',
    experienceLevel: 'entry',
    workingSchedule: ['Full time'],
    employmentType: ['Distant work', 'Flexible schedule'],
    ...CARD_STYLES[1]!,
    saved: true,
  },
  {
    id: '3',
    date: '29 Jan, 2023',
    company: 'Dribbble',
    title: 'Senior Motion Designer',
    logoColor: 'bg-pink-500',
    logoLetter: 'D',
    tags: ['Part time', 'Senior level', 'Full Day', 'Shift work'],
    salary: '$260/hr',
    salaryHourly: 260,
    location: 'New York, NY',
    locationType: 'onsite',
    experienceLevel: 'senior',
    workingSchedule: ['Part time'],
    employmentType: ['Full day', 'Shift work'],
    ...CARD_STYLES[2]!,
    saved: false,
  },
  {
    id: '4',
    date: '11 Apr, 2023',
    company: 'Twitter',
    title: 'UX Designer',
    logoColor: 'bg-sky-500',
    logoLetter: 'T',
    tags: ['Full time', 'Middle level', 'Distant', 'Project work'],
    salary: '$120/hr',
    salaryHourly: 120,
    location: 'California, CA',
    locationType: 'remote',
    experienceLevel: 'mid',
    workingSchedule: ['Full time'],
    employmentType: ['Distant work'],
    ...CARD_STYLES[3]!,
    saved: false,
  },
  {
    id: '5',
    date: '2 Apr, 2023',
    company: 'Airbnb',
    title: 'Graphic Designer',
    logoColor: 'bg-rose-500',
    logoLetter: 'A',
    tags: ['Part time', 'Senior level'],
    salary: '$300/hr',
    salaryHourly: 300,
    location: 'New York, NY',
    locationType: 'onsite',
    experienceLevel: 'senior',
    workingSchedule: ['Part time'],
    employmentType: ['Full day'],
    ...CARD_STYLES[4]!,
    saved: false,
    featured: true,
  },
  {
    id: '6',
    date: '18 Jan, 2023',
    company: 'Apple',
    title: 'Graphic Designer',
    logoColor: 'bg-zinc-800',
    logoLetter: '',
    tags: ['Part time', 'Distant'],
    salary: '$140/hr',
    salaryHourly: 140,
    location: 'San Francisco, CA',
    locationType: 'remote',
    experienceLevel: 'mid',
    workingSchedule: ['Part time'],
    employmentType: ['Distant work'],
    ...CARD_STYLES[5]!,
    saved: false,
  },
  {
    id: '7',
    date: '8 Jun, 2023',
    company: 'Spotify',
    title: 'Product Designer',
    logoColor: 'bg-green-600',
    logoLetter: 'S',
    tags: ['Full time', 'Senior level', 'Flexible Schedule'],
    salary: '$220/hr',
    salaryHourly: 220,
    location: 'Stockholm, SE',
    locationType: 'hybrid',
    experienceLevel: 'senior',
    workingSchedule: ['Full time'],
    employmentType: ['Flexible schedule'],
    ...CARD_STYLES[6]!,
    saved: false,
    featured: true,
  },
  {
    id: '8',
    date: '15 Mar, 2023',
    company: 'Meta',
    title: 'Frontend Developer',
    logoColor: 'bg-blue-600',
    logoLetter: 'M',
    tags: ['Full time', 'Senior level', 'Distant', 'Full Day'],
    salary: '$320/hr',
    salaryHourly: 320,
    location: 'Menlo Park, CA',
    locationType: 'remote',
    experienceLevel: 'senior',
    workingSchedule: ['Full time'],
    employmentType: ['Full day', 'Distant work'],
    ...CARD_STYLES[7]!,
    saved: false,
  },
  {
    id: '9',
    date: '22 May, 2023',
    company: 'Netflix',
    title: 'Senior Visual Designer',
    logoColor: 'bg-red-600',
    logoLetter: 'N',
    tags: ['Full time', 'Senior level', 'Full Day'],
    salary: '$280/hr',
    salaryHourly: 280,
    location: 'Los Angeles, CA',
    locationType: 'onsite',
    experienceLevel: 'senior',
    workingSchedule: ['Full time'],
    employmentType: ['Full day'],
    ...CARD_STYLES[8]!,
    saved: false,
    featured: true,
  },
  {
    id: '10',
    date: '3 Apr, 2023',
    company: 'Stripe',
    title: 'Design Systems Lead',
    logoColor: 'bg-indigo-600',
    logoLetter: 'S',
    tags: ['Full time', 'Lead level', 'Distant', 'Flexible Schedule'],
    salary: '$350/hr',
    salaryHourly: 350,
    location: 'San Francisco, CA',
    locationType: 'remote',
    experienceLevel: 'lead',
    workingSchedule: ['Full time'],
    employmentType: ['Distant work', 'Flexible schedule'],
    ...CARD_STYLES[0]!,
    saved: false,
  },
  {
    id: '11',
    date: '9 Feb, 2023',
    company: 'Figma',
    title: 'Junior Product Designer',
    logoColor: 'bg-violet-600',
    logoLetter: 'F',
    tags: ['Full time', 'Junior level', 'Full Day'],
    salary: '$95/hr',
    salaryHourly: 95,
    location: 'San Francisco, CA',
    locationType: 'onsite',
    experienceLevel: 'entry',
    workingSchedule: ['Full time'],
    employmentType: ['Full day'],
    ...CARD_STYLES[1]!,
    saved: false,
  },
  {
    id: '12',
    date: '27 Mar, 2023',
    company: 'Slack',
    title: 'Interaction Designer',
    logoColor: 'bg-purple-700',
    logoLetter: 'S',
    tags: ['Part time', 'Middle level', 'Distant', 'Project work'],
    salary: '$175/hr',
    salaryHourly: 175,
    location: 'Denver, CO',
    locationType: 'remote',
    experienceLevel: 'mid',
    workingSchedule: ['Part time', 'Project work'],
    employmentType: ['Distant work'],
    ...CARD_STYLES[2]!,
    saved: false,
  },
  {
    id: '13',
    date: '14 Jun, 2023',
    company: 'Adobe',
    title: 'UX Research Intern',
    logoColor: 'bg-red-700',
    logoLetter: 'A',
    tags: ['Internship', 'Entry level', 'Full Day'],
    salary: '$45/hr',
    salaryHourly: 45,
    location: 'San Jose, CA',
    locationType: 'onsite',
    experienceLevel: 'entry',
    workingSchedule: ['Internship'],
    employmentType: ['Full day'],
    ...CARD_STYLES[3]!,
    saved: false,
  },
  {
    id: '14',
    date: '6 May, 2023',
    company: 'Shopify',
    title: 'Brand Designer',
    logoColor: 'bg-lime-700',
    logoLetter: 'S',
    tags: ['Full time', 'Middle level', 'Distant', 'Flexible Schedule'],
    salary: '$190/hr',
    salaryHourly: 190,
    location: 'Ottawa, CA',
    locationType: 'remote',
    experienceLevel: 'mid',
    workingSchedule: ['Full time'],
    employmentType: ['Distant work', 'Flexible schedule'],
    ...CARD_STYLES[4]!,
    saved: false,
    featured: true,
  },
  {
    id: '15',
    date: '19 Jan, 2023',
    company: 'Uber',
    title: 'Design Engineer',
    logoColor: 'bg-black',
    logoLetter: 'U',
    tags: ['Full time', 'Senior level', 'Full Day', 'Shift work'],
    salary: '$240/hr',
    salaryHourly: 240,
    location: 'San Francisco, CA',
    locationType: 'hybrid',
    experienceLevel: 'senior',
    workingSchedule: ['Full time'],
    employmentType: ['Full day', 'Shift work'],
    ...CARD_STYLES[5]!,
    saved: false,
  },
]

// ── Filter Options ─────────────────────────────────────────────────────

export const WORKING_SCHEDULE_OPTIONS = [
  { label: 'Full time', defaultChecked: true },
  { label: 'Part time', defaultChecked: true },
  { label: 'Internship', defaultChecked: false },
  { label: 'Project work', defaultChecked: false },
  { label: 'Volunteering', defaultChecked: false },
]

export const EMPLOYMENT_TYPE_OPTIONS = [
  { label: 'Full day', defaultChecked: true },
  { label: 'Flexible schedule', defaultChecked: true },
  { label: 'Shift work', defaultChecked: false },
  { label: 'Distant work', defaultChecked: true },
  { label: 'Shift method', defaultChecked: false },
]

// ── Top Recruiters ─────────────────────────────────────────────────────

export const TOP_RECRUITERS: Recruiter[] = [
  { id: 'r1', name: 'Google', logoColor: 'bg-blue-500', logoLetter: 'G', jobCount: 42 },
  { id: 'r2', name: 'Amazon', logoColor: 'bg-black', logoLetter: 'a', jobCount: 38 },
  { id: 'r3', name: 'Apple', logoColor: 'bg-zinc-800', logoLetter: '', jobCount: 31 },
  { id: 'r4', name: 'Meta', logoColor: 'bg-blue-600', logoLetter: 'M', jobCount: 27 },
  { id: 'r5', name: 'Spotify', logoColor: 'bg-green-600', logoLetter: 'S', jobCount: 19 },
  { id: 'r6', name: 'Netflix', logoColor: 'bg-red-600', logoLetter: 'N', jobCount: 15 },
]

// ── Experience label mapping ───────────────────────────────────────────

export const EXPERIENCE_MAP: Record<string, string[]> = {
  entry: ['Junior level', 'Entry level'],
  mid: ['Middle level', 'Mid level'],
  senior: ['Senior level'],
  lead: ['Lead level'],
}
