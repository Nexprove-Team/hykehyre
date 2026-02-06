"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Check } from "lucide-react";
import { Button } from "@quiethire/ui/components/button";
import { Input } from "@quiethire/ui/components/input";
import { Checkbox } from "@quiethire/ui/components/checkbox";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@quiethire/ui/components/form";
import { joinWaitlist } from "@/app/actions/waitlist";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Please enter your full name." }),
  email: z.email({ message: "Please enter a valid email address." }),
  agreedToTerms: z.literal(true, {
    error: "You must agree to the terms and conditions.",
  }),
});

export function SignupForm() {
  const [isLoading, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      agreedToTerms: false as unknown as true,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      setServerError(null);
      const result = await joinWaitlist(values);
      if (result.success) {
        setIsSuccess(true);
      } else {
        setServerError(result.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="signup-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Jane Doe"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="jane@company.com"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agreedToTerms"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-start gap-3 pt-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormLabel className="text-muted-foreground font-normal cursor-pointer leading-tight">
                          Confirm that I read and agreed to the{" "}
                          <span className="text-foreground font-medium underline underline-offset-2">
                            terms and conditions
                          </span>
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {serverError && (
                  <p className="text-sm text-destructive">{serverError}</p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  size="lg"
                  className="w-full text-base font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-primary/30"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Join Waitlist"
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>
        ) : (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 py-8"
          >
            <div className="h-12 w-12 bg-green-500/15 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                You&apos;re on the list!
              </h3>
              <p className="text-muted-foreground text-sm">
                We&apos;ll notify you when Quiet Hire is ready.
              </p>
            </div>
            <button
              onClick={() => setIsSuccess(false)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline"
            >
              Add another email
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
