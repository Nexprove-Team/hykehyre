"use client";

import { Badge } from "@quiethire/ui/components/badge";
import { Button } from "@quiethire/ui/components/button";
import { motion } from "motion/react";
import { ArrowRight, Sparkles, Star } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 md:pt-20 lg:pt-32" id="waitlist">
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-[20%] top-0 h-[600px] w-[600px] animate-pulse-slow rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -right-[10%] top-[20%] h-[400px] w-[400px] animate-pulse-slow rounded-full bg-primary/5 blur-[100px] delay-1000" />
        <div className="absolute left-[30%] top-[40%] h-[300px] w-[300px] animate-float rounded-full bg-blue-500/5 blur-[80px]" />
      </div>

      {/* Grid pattern */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.15] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black_70%,transparent_100%)]" />

      <div className="relative mx-auto max-w-6xl px-6 pb-24 md:pb-32">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Badge variant="outline" className="mb-8 gap-2 border-primary/20 bg-primary/5 px-4 py-1.5 text-sm backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-primary/10">
              <Sparkles className="size-3.5 text-primary" />
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">AI-Powered Recruitment Platform</span>
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl text-5xl font-medium leading-[1.1] tracking-tight text-foreground md:text-7xl lg:text-8xl"
          >
            Hire smarter,{" "}
            <span className="font-display italic bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent inline-block">not louder</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 max-w-xl text-lg text-muted-foreground md:text-xl lg:text-2xl"
          >
            Streamline your recruitment process, automate tasks, and connect
            top talent with the right opportunities — quietly and efficiently.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Button size="lg" className="group h-12 px-8 text-base shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40" asChild>
              <a href="#join">
                Join the Waitlist
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base backdrop-blur-sm hover:bg-white/5" asChild>
              <a href="#features">See How It Works</a>
            </Button>
          </motion.div>

          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 0.6, delay: 0.6 }}
             className="mt-12 flex flex-col items-center gap-2"
          >
            <div className="flex -space-x-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-background bg-muted/80 flex items-center justify-center text-[10px] font-bold">
                   <div className="h-full w-full rounded-full bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900" />
                </div>
              ))}
               <div className="h-10 w-10 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-xs font-bold text-primary backdrop-blur-sm">
                2k+
               </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
               <div className="flex text-amber-400">
                 {[...Array(5)].map((_, i) => (
                   <Star key={i} className="size-3.5 fill-current" />
                 ))}
               </div>
               <span className="font-medium text-foreground">Top Rated</span> by creative teams
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
