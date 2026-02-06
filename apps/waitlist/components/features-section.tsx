"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@quiethire/ui/components/tabs";
import { motion } from "motion/react";
import {
  Users,
  FileSearch,
  BarChart3,
  BrainCircuit,
  Send,
  ShieldCheck,
  Star,
  Zap,
} from "lucide-react";
import { cn } from "@quiethire/ui/lib/utils";

const reviewerFeatures = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Screening",
    description:
      "Automatically screen and rank candidates based on job requirements. Our AI analyzes resumes, cover letters, and assessments to surface the best fits.",
    className: "md:col-span-2",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Track your hiring pipeline with real-time metrics. Monitor time-to-hire, candidate quality scores, and team collaboration performance.",
    className: "md:col-span-1",
  },
  {
    icon: Users,
    title: "Collaborative Reviews",
    description:
      "Invite team members to review candidates together. Share scorecards, leave comments, and make collective hiring decisions faster.",
    className: "md:col-span-1",
  },
  {
    icon: ShieldCheck,
    title: "Bias-Free Evaluation",
    description:
      "Structured evaluation frameworks help remove unconscious bias. Focus on skills and qualifications that truly matter for the role.",
    className: "md:col-span-2",
  },
];

const candidateFeatures = [
  {
    icon: FileSearch,
    title: "Smart Job Matching",
    description:
      "Get matched with roles that align with your skills, experience, and career goals. No more scrolling through irrelevant listings.",
    className: "md:col-span-2",
  },
  {
    icon: Zap,
    title: "One-Click Apply",
    description:
      "Apply to multiple positions with a single profile. Your information is pre-filled and tailored to each application automatically.",
    className: "md:col-span-1",
  },
  {
    icon: Send,
    title: "Application Tracking",
    description:
      "Stay informed at every stage. Receive real-time updates on your application status — no more wondering where you stand.",
    className: "md:col-span-1",
  },
  {
    icon: Star,
    title: "Profile Highlights",
    description:
      "Showcase your unique strengths with AI-enhanced profile summaries. Stand out to recruiters with data-driven skill endorsements.",
    className: "md:col-span-2",
  },
];

function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  index: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "glass-card group relative flex flex-col justify-between overflow-hidden rounded-3xl p-8",
        className
      )}
    >
      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-12 translate-x-12 rounded-full bg-primary/10 blur-[60px] transition-all group-hover:bg-primary/20" />
      
      <div className="relative mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 ring-1 ring-primary/10 transition-all group-hover:bg-primary/10 group-hover:ring-primary/20">
        <Icon className="size-6 text-primary" />
      </div>
      
      <div className="relative">
        <h3 className="mb-3 text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export function FeaturesSection() {
  return (
    <section className="relative py-24 md:py-32" id="features">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute left-0 top-1/2 -z-10 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-primary/3 blur-[120px]" />
      
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h2 className="text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            Built for{" "}
            <span className="font-display italic bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
              both sides
            </span>{" "}
            of hiring
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Whether you&apos;re reviewing applicants or looking for your next role, 
            Quiet Hire provides the tools you need to succeed.
          </p>
        </motion.div>

        <Tabs defaultValue="reviewer" className="w-full">
          <div className="flex justify-center">
            <TabsList className="mb-12 h-12 rounded-full border border-border/50 bg-background/50 p-1 backdrop-blur-md">
              <TabsTrigger value="reviewer" className="rounded-full px-8 py-2 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Reviewer
              </TabsTrigger>
              <TabsTrigger value="candidate" className="rounded-full px-8 py-2 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Candidate
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="reviewer">
            <div className="grid gap-6 md:grid-cols-3">
              {reviewerFeatures.map((feature, i) => (
                <FeatureCard key={feature.title} {...feature} index={i} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="candidate">
            <div className="grid gap-6 md:grid-cols-3">
              {candidateFeatures.map((feature, i) => (
                <FeatureCard key={feature.title} {...feature} index={i} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
