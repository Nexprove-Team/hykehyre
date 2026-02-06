"use client";

import { Button } from "@quiethire/ui/components/button";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@quiethire/ui/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X } from "lucide-react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed left-0 right-0 top-4 z-50 mx-auto w-full max-w-5xl px-4 transition-all duration-300 md:top-6 md:px-6",
        scrolled ? "px-4 md:px-6" : "px-4 md:px-6"
      )}
    >
      <div className={cn(
        "mx-auto flex h-14 w-full items-center justify-between rounded-full border border-transparent px-4 transition-all duration-300 md:px-6",
        scrolled && "border-border/40 bg-background/60 shadow-lg shadow-black/5 backdrop-blur-xl"
      )}>
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="text-sm font-bold">Q</span>
          </div>
          <span className="hidden text-sm font-bold tracking-tight text-foreground md:inline-block">
            QUIET HIRE
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a
            href="#testimonials"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Testimonials
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            FAQ
          </a>
        </nav>

        {/* Mobile controls & Desktop CTA */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <div className="flex items-center gap-2">
             <ThemeToggle />
             
             {/* Mobile Nav Toggle */}
             <div className="md:hidden">
               <button 
                 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                 className="flex h-9 w-9 items-center justify-center rounded-full border border-border/40 bg-background/50 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                 aria-label="Toggle menu"
               >
                 {mobileMenuOpen ? (
                   <X className="h-4 w-4" />
                 ) : (
                   <Menu className="h-4 w-4" />
                 )}
               </button>
             </div>
          </div>

          <Button size="sm" className="hidden h-9 rounded-full px-5 text-xs font-medium md:inline-flex" asChild>
            <a href="#waitlist">Join Waitlist</a>
          </Button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
           <div className="absolute left-0 right-0 top-[calc(100%+8px)] mx-4 rounded-2xl border border-border/40 bg-background/80 p-4 shadow-xl shadow-black/5 backdrop-blur-2xl md:hidden">
            <nav className="flex flex-col gap-2">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              >
                Features
              </a>
              <a
                href="#testimonials"
                 onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              >
                Testimonials
              </a>
              <a
                href="#faq"
                 onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              >
                FAQ
              </a>
              <div className="pt-2">
                <Button size="sm" className="w-full h-10 rounded-xl text-sm font-medium" asChild>
                  <a href="#waitlist" onClick={() => setMobileMenuOpen(false)}>Join Waitlist</a>
                </Button>
              </div>
            </nav>
           </div>
        )}
      </div>
    </motion.header>
  );
}
