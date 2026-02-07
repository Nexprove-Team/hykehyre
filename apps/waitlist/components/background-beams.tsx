"use client";
import { cn } from "@quiethire/ui/lib/utils";
import { motion } from "motion/react";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 z-0 flex h-full w-full items-end justify-center overflow-hidden bg-background",
        className,
      )}
    >
      <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(ellipse_at_center,var(--primary-foreground)_0%,var(--background)_100%)] opacity-0 dark:opacity-10" />

      <div className="absolute left-0 top-0 h-full w-full overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -left-[10%] -top-[10%] h-[50vh] w-[50vh] rounded-full bg-primary/20 blur-[100px]"
        />
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          className="absolute right-0 top-[20%] h-[40vh] w-[40vh] rounded-full bg-indigo-500/20 blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 left-[20%] h-[60vh] w-[60vh] rounded-full bg-blue-600/10 blur-[120px]"
        />
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
    </div>
  );
};
