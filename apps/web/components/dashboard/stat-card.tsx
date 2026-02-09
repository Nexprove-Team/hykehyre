"use client";

import { motion } from "motion/react";
import {
  Card,
  CardContent,
} from "@hackhyre/ui/components/card";
import { TrendUp } from "@hackhyre/ui/icons";
import type { Icon } from "@hackhyre/ui/icons";

interface StatCardProps {
  icon: Icon;
  label: string;
  value: string;
  trend: string;
  index?: number;
}

export function StatCard({ icon: Icon, label, value, trend, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Card>
        <CardContent className="flex items-center gap-4 p-5">
          <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
            <Icon size={24} variant="Bulk" className="text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-muted-foreground text-sm">{label}</p>
            <p className="font-mono text-2xl font-bold tracking-tight">
              {value}
            </p>
            <p className="text-muted-foreground flex items-center gap-1 text-xs">
              <TrendUp size={12} variant="Bold" className="text-emerald-500" />
              {trend}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
