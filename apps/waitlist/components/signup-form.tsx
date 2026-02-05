"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, Check } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Please enter your full name." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  agreedToTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions." }),
  }),
});

export function SignupForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      agreedToTerms: false as unknown as true,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(values);
    setIsLoading(false);
    setIsSuccess(true);
  }

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="signup-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Full Name
              </label>
              <input
                {...form.register("fullName")}
                type="text"
                placeholder="Ishan Zaad"
                className="w-full h-12 px-4 bg-[#1a1a22] border border-[#2a2a35] rounded-xl text-white placeholder:text-[#4a4a55] focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600/50 transition-all text-sm"
                disabled={isLoading}
              />
              {form.formState.errors.fullName && (
                <p className="text-xs text-red-400 px-1">
                  {form.formState.errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Email Address
              </label>
              <input
                {...form.register("email")}
                type="email"
                placeholder="zaad@hirespark.work"
                className="w-full h-12 px-4 bg-[#1a1a22] border border-[#2a2a35] rounded-xl text-white placeholder:text-[#4a4a55] focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600/50 transition-all text-sm"
                disabled={isLoading}
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-400 px-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="terms"
                {...form.register("agreedToTerms")}
                className="mt-0.5 h-4 w-4 rounded border-[#2a2a35] bg-[#1a1a22] accent-blue-600 cursor-pointer"
                disabled={isLoading}
              />
              <label
                htmlFor="terms"
                className="text-sm text-[#8a8a9a] cursor-pointer select-none leading-tight"
              >
                Confirm that I read and agreed to the terms and condition
              </label>
            </div>
            {form.formState.errors.agreedToTerms && (
              <p className="text-xs text-red-400 px-1">
                {form.formState.errors.agreedToTerms.message}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm mt-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Join Waitlist"
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success-message"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4 py-8"
          >
            <div className="h-12 w-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                You&apos;re on the list!
              </h3>
              <p className="text-[#8a8a9a] text-sm">
                We&apos;ll notify you when Quiet Hire is ready.
              </p>
            </div>
            <button
              onClick={() => setIsSuccess(false)}
              className="text-sm text-[#6a6a7a] hover:text-blue-500 transition-colors hover:underline"
            >
              Add another email
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
