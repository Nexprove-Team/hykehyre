"use client";

import { motion } from "motion/react";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "We used to spend weeks sorting through applications. Quiet Hire's AI screening cut our time-to-shortlist by 70%. It's like having a brilliant recruiting assistant that never sleeps.",
    name: "Amara Osei",
    role: "VP of People, TechNova",
    initials: "AO",
  },
  {
    quote:
      "As a job seeker, I was exhausted by the black hole of applications. Quiet Hire matched me with roles I actually wanted — and I heard back within days, not months.",
    name: "Jordan Michaels",
    role: "Senior Engineer, Placed via Quiet Hire",
    initials: "JM",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 md:py-32" id="testimonials">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Loved by{" "}
            <span className="font-display italic bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
              early adopters
            </span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Here&apos;s what beta testers are saying about Quiet Hire.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="glass-card relative rounded-3xl p-8 md:p-10"
            >
              <Quote className="mb-6 size-8 text-primary/30" />
              <blockquote className="text-base leading-relaxed text-foreground md:text-lg">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
