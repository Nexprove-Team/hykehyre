"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@hackhyre/ui/components/card";
import {
  Avatar,
  AvatarFallback,
} from "@hackhyre/ui/components/avatar";
import { Badge } from "@hackhyre/ui/components/badge";
import { Progress } from "@hackhyre/ui/components/progress";
import { Button } from "@hackhyre/ui/components/button";
import { ArrowRight } from "@hackhyre/ui/icons";
import { cn } from "@hackhyre/ui/lib/utils";
import { MOCK_APPLICATIONS } from "@/lib/mock-data";
import { APPLICATION_STATUS_CONFIG } from "@/lib/constants";
import { useCandidateSheet } from "@/hooks/use-candidate-sheet";

function getRelativeTime(dateStr: string): string {
  const now = new Date("2026-02-09T00:00:00");
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffH < 1) return "Just now";
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  return `${diffD}d ago`;
}

export function RecentApplicationsList() {
  const openCandidate = useCandidateSheet((s) => s.open);
  const applications = MOCK_APPLICATIONS.slice(0, 6);
  const candidateIds = applications.map((a) => a.candidateId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">
          Recent Applications
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          asChild
        >
          <Link href="/applications">
            View All
            <ArrowRight size={14} variant="Linear" className="ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-1 px-3">
        {applications.map((app) => {
          const config = APPLICATION_STATUS_CONFIG[app.status];
          const initials = app.candidateName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();

          return (
            <button
              key={app.id}
              onClick={() => openCandidate(app.candidateId, candidateIds)}
              className="hover:bg-accent/50 flex w-full items-center gap-3 rounded-lg p-2.5 transition-colors text-left cursor-pointer"
            >
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className="bg-muted text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">
                    {app.candidateName}
                  </p>
                  <span className="text-muted-foreground shrink-0 text-[11px]">
                    {getRelativeTime(app.createdAt)}
                  </span>
                </div>
                <p className="text-muted-foreground truncate text-xs">
                  {app.jobTitle}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge
                    variant={config?.variant as "default"}
                    className={cn("text-[10px] px-1.5 py-0", config?.className)}
                  >
                    {config?.label}
                  </Badge>
                  {app.relevanceScore !== null && (
                    <div className="flex flex-1 items-center gap-1.5">
                      <Progress
                        value={app.relevanceScore * 100}
                        className="h-1.5"
                      />
                      <span className="text-muted-foreground text-[10px] font-medium">
                        {Math.round(app.relevanceScore * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
