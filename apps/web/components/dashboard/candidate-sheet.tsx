"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@hackhyre/ui/components/sheet";
import {
  Avatar,
  AvatarFallback,
} from "@hackhyre/ui/components/avatar";
import { Badge } from "@hackhyre/ui/components/badge";
import { Button } from "@hackhyre/ui/components/button";
import { Separator } from "@hackhyre/ui/components/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@hackhyre/ui/components/tabs";
import { ScrollArea } from "@hackhyre/ui/components/scroll-area";
import {
  Sms,
  Call,
  Location,
  Calendar,
  Briefcase,
  Flag,
  Clock,
  LinkIcon,
  DocumentText,
  Star,
  Messages,
  Global,
  Send,
  Cake,
  Book,
} from "@hackhyre/ui/icons";
import { cn } from "@hackhyre/ui/lib/utils";
import { useCandidateSheet } from "@/hooks/use-candidate-sheet";
import {
  MOCK_CANDIDATES,
  MOCK_APPLICATIONS,
  type MockCandidateProfile,
} from "@/lib/mock-data";
import { APPLICATION_STATUS_CONFIG } from "@/lib/constants";

function InfoItem({
  icon: Icon,
  label,
  value,
  isLink,
}: {
  icon: typeof Sms;
  label: string;
  value: string;
  isLink?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <Icon size={14} variant="Linear" className="text-muted-foreground shrink-0" />
      <span className="text-muted-foreground text-[12px] w-24 shrink-0">{label}</span>
      <span className="text-[12px] font-medium">
        {isLink ? (
          <span className="text-primary">{value}</span>
        ) : (
          value
        )}
      </span>
    </div>
  );
}

function CvTab({ candidate }: { candidate: MockCandidateProfile }) {
  return (
    <div className="space-y-5 pt-4">
      {/* Summary */}
      <div>
        <h4 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Profile
        </h4>
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          {candidate.summary}
        </p>
      </div>

      <Separator />

      {/* Work Experience */}
      <div>
        <h4 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Experience
        </h4>
        <div className="space-y-4">
          {candidate.workHistory.map((job, i) => (
            <div key={i} className="relative pl-4 border-l-2 border-muted">
              <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-primary" />
              <div className="flex items-center justify-between mb-1">
                <p className="text-[13px] font-semibold">{job.role}</p>
                <span className="text-[10px] text-muted-foreground">{job.period}</span>
              </div>
              <p className="text-[12px] text-muted-foreground mb-2">{job.company}</p>
              <ul className="space-y-1">
                {job.highlights.map((h, j) => (
                  <li key={j} className="text-[11px] text-muted-foreground flex items-start gap-2">
                    <span className="bg-muted-foreground/30 mt-1.5 h-1 w-1 shrink-0 rounded-full" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Education */}
      <div>
        <h4 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Education
        </h4>
        <div className="space-y-3">
          {candidate.education.map((edu, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <Book size={14} variant="Bold" className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-[12px] font-semibold">{edu.degree}</p>
                <p className="text-[11px] text-muted-foreground">{edu.institution}</p>
                <p className="text-[10px] text-muted-foreground/60">{edu.years}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Skills */}
      <div>
        <h4 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Skills
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {candidate.skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="text-[11px] px-2 py-0.5 font-medium">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Languages */}
      <div>
        <h4 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Languages
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {candidate.languages.map((lang) => (
            <Badge key={lang} variant="outline" className="text-[11px] px-2 py-0.5 font-medium">
              {lang}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function AppliedJobsTab({ candidateId }: { candidateId: string }) {
  const applications = MOCK_APPLICATIONS.filter((a) => a.candidateId === candidateId);

  return (
    <div className="space-y-3 pt-4">
      {applications.length === 0 ? (
        <p className="text-[12px] text-muted-foreground py-8 text-center">No applications found</p>
      ) : (
        applications.map((app) => {
          const config = APPLICATION_STATUS_CONFIG[app.status];
          return (
            <div
              key={app.id}
              className="rounded-xl border p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold">{app.jobTitle}</p>
                <Badge
                  variant={config?.variant as "default"}
                  className={cn("text-[10px] font-medium", config?.className)}
                >
                  {config?.label}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar size={11} variant="Linear" />
                  {new Date(app.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                {app.relevanceScore !== null && (
                  <span className="flex items-center gap-1">
                    <Star size={11} variant="Bold" className="text-amber-500" />
                    {Math.round(app.relevanceScore * 100)}% match
                  </span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function ActivityTab() {
  const activities = [
    { action: "Application submitted", time: "2 days ago", type: "submit" },
    { action: "Resume reviewed by recruiter", time: "1 day ago", type: "review" },
    { action: "Moved to under review", time: "1 day ago", type: "status" },
    { action: "Interview scheduled", time: "5 hours ago", type: "interview" },
  ];

  return (
    <div className="space-y-3 pt-4">
      {activities.map((activity, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="bg-muted flex h-7 w-7 shrink-0 items-center justify-center rounded-full mt-0.5">
            <Clock size={12} variant="Linear" className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-[12px] font-medium">{activity.action}</p>
            <p className="text-[10px] text-muted-foreground">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CandidateSheet() {
  const { isOpen, candidateId, close } = useCandidateSheet();
  const [activeTab, setActiveTab] = useState("cv");

  const candidate = candidateId
    ? MOCK_CANDIDATES.find((c) => c.id === candidateId)
    : null;

  if (!candidate) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
        <SheetContent side="right" className="w-[480px] sm:max-w-[480px] p-0 inset-y-3 right-3 h-[calc(100dvh-1.5rem)] rounded-2xl border">
          <SheetTitle className="sr-only">Candidate Details</SheetTitle>
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground text-[13px]">Candidate not found</p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  const initials = candidate.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent side="right" className="w-[480px] sm:max-w-[480px] p-0 flex flex-col inset-y-3 right-3 h-[calc(100dvh-1.5rem)] rounded-2xl border">
        <SheetTitle className="sr-only">Candidate Detail</SheetTitle>

        {/* Header */}
        <div className="shrink-0 border-b px-6 py-5">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-bold truncate">{candidate.name}</h2>
              </div>
              <p className="text-muted-foreground text-[12px] mt-0.5">{candidate.title}</p>
              {candidate.linkedinUrl && (
                <span className="text-primary text-[11px] flex items-center gap-1 mt-1">
                  <LinkIcon size={11} variant="Linear" />
                  {candidate.linkedinUrl}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            <Button size="sm" className="flex-1 gap-2 rounded-lg text-[12px]">
              <Sms size={14} variant="Bold" />
              Send Email
            </Button>
            <Button variant="outline" size="sm" className="flex-1 gap-2 rounded-lg text-[12px]">
              <Messages size={14} variant="Linear" />
              Message
            </Button>
          </div>
        </div>

        {/* Scrollable body */}
        <ScrollArea className="flex-1">
          <div className="px-6 py-4">
            {/* Personal Info */}
            <div className="space-y-0.5">
              <h3 className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Personal Information
              </h3>
              <InfoItem icon={Cake} label="Date of Birth" value={candidate.dateOfBirth} />
              <InfoItem icon={Flag} label="Nationality" value={candidate.nationality} />
              <InfoItem icon={Briefcase} label="Experience" value={candidate.experience} />
              <InfoItem icon={Location} label="Location" value={candidate.location} />
              <InfoItem icon={Sms} label="Email" value={candidate.email} isLink />
              <InfoItem icon={Call} label="Phone" value={candidate.phone} isLink />
            </div>

            <Separator className="my-4" />

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="cv" className="flex-1 text-[12px]">
                  <DocumentText size={13} variant="Linear" className="mr-1" />
                  CV
                </TabsTrigger>
                <TabsTrigger value="applied" className="flex-1 text-[12px]">
                  <Briefcase size={13} variant="Linear" className="mr-1" />
                  Applied Jobs
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex-1 text-[12px]">
                  <Clock size={13} variant="Linear" className="mr-1" />
                  Activity
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cv">
                <CvTab candidate={candidate} />
              </TabsContent>
              <TabsContent value="applied">
                <AppliedJobsTab candidateId={candidate.id} />
              </TabsContent>
              <TabsContent value="activity">
                <ActivityTab />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
