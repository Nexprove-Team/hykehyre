"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@hackhyre/ui/components/card";
import { Badge } from "@hackhyre/ui/components/badge";
import { Skeleton } from "@hackhyre/ui/components/skeleton";
import { Separator } from "@hackhyre/ui/components/separator";
import {
  Briefcase,
  Location,
  DollarCircle,
  Global,
} from "@hackhyre/ui/icons";

interface JobPreviewData {
  title?: string;
  description?: string;
  employmentType?: string;
  experienceLevel?: string;
  location?: string;
  isRemote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  requirements?: string[];
  responsibilities?: string[];
  skills?: string[];
}

interface JobPreviewProps {
  data: JobPreviewData;
}

const TYPE_LABELS: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
};

const LEVEL_LABELS: Record<string, string> = {
  entry: "Entry",
  mid: "Mid-level",
  senior: "Senior",
  lead: "Lead",
  executive: "Executive",
};

function PreviewField({
  label,
  children,
  show,
}: {
  label: string;
  children: React.ReactNode;
  show: boolean;
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="py-1">
            <p className="text-muted-foreground mb-0.5 text-[11px] font-medium uppercase tracking-wider">
              {label}
            </p>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function JobPreview({ data }: JobPreviewProps) {
  const hasAnyData = Object.values(data).some(
    (v) =>
      v !== undefined &&
      v !== "" &&
      !(Array.isArray(v) && v.length === 0),
  );

  const salary =
    data.salaryMin && data.salaryMax
      ? `${new Intl.NumberFormat("en-US", { style: "currency", currency: data.salaryCurrency || "USD", minimumFractionDigits: 0 }).format(data.salaryMin)} – ${new Intl.NumberFormat("en-US", { style: "currency", currency: data.salaryCurrency || "USD", minimumFractionDigits: 0 }).format(data.salaryMax)}`
      : null;

  return (
    <div className="sticky top-0">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Job Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!hasAnyData ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          ) : (
            <>
              {/* Title */}
              <PreviewField label="Title" show={!!data.title}>
                <p className="font-mono text-lg font-bold">{data.title}</p>
              </PreviewField>

              {/* Metadata badges */}
              <div className="flex flex-wrap gap-1.5">
                {data.employmentType && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Briefcase size={12} variant="Bold" />
                    {TYPE_LABELS[data.employmentType] ?? data.employmentType}
                  </Badge>
                )}
                {data.experienceLevel && (
                  <Badge variant="outline" className="text-xs">
                    {LEVEL_LABELS[data.experienceLevel] ?? data.experienceLevel}
                  </Badge>
                )}
                {data.location && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Location size={12} variant="Bold" />
                    {data.location}
                  </Badge>
                )}
                {data.isRemote && (
                  <Badge variant="secondary" className="gap-1 text-xs">
                    <Global size={12} variant="Bold" />
                    Remote
                  </Badge>
                )}
                {salary && (
                  <Badge variant="outline" className="gap-1 text-xs">
                    <DollarCircle size={12} variant="Bold" />
                    {salary}
                  </Badge>
                )}
              </div>

              {/* Description */}
              <PreviewField label="Description" show={!!data.description}>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {data.description}
                </p>
              </PreviewField>

              {/* Responsibilities */}
              <PreviewField
                label="Responsibilities"
                show={!!data.responsibilities?.length}
              >
                <ul className="text-muted-foreground list-inside list-disc space-y-0.5 text-sm">
                  {data.responsibilities?.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </PreviewField>

              {/* Requirements */}
              <PreviewField
                label="Requirements"
                show={!!data.requirements?.length}
              >
                <ul className="text-muted-foreground list-inside list-disc space-y-0.5 text-sm">
                  {data.requirements?.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </PreviewField>

              {/* Skills */}
              <PreviewField label="Skills" show={!!data.skills?.length}>
                <div className="flex flex-wrap gap-1">
                  {data.skills?.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </PreviewField>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
