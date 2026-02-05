import { SignupForm } from "@/components/signup-form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative p-6 overflow-hidden bg-[#0a0a0f]">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(60,60,120,0.15)_0%,transparent_60%)]" />

      <div className="relative z-10 flex flex-col items-center">
        {/* Lanyard / Badge Ribbon */}
        <div className="relative w-20 h-32 mb-[-2px]">
          {/* Left strap */}
          <div
            className="absolute left-1/2 -translate-x-[18px] top-[-60px] w-5 h-[180px] bg-gradient-to-b from-blue-700 via-blue-600 to-blue-700 rounded-b-sm"
            style={{ transform: "translateX(-18px) rotate(-8deg)", transformOrigin: "top center" }}
          />
          {/* Right strap */}
          <div
            className="absolute left-1/2 translate-x-[0px] top-[-60px] w-5 h-[180px] bg-gradient-to-b from-blue-700 via-blue-600 to-blue-700 rounded-b-sm"
            style={{ transform: "translateX(0px) rotate(8deg)", transformOrigin: "top center" }}
          />
          {/* Glow behind straps */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-16 h-24 bg-blue-600/20 blur-2xl rounded-full" />
        </div>

        {/* Card */}
        <div className="relative w-full max-w-[460px] bg-[#131318] border border-[#2a2a35] rounded-3xl px-8 pt-6 pb-10 shadow-2xl shadow-black/50">
          {/* Badge clip at top */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-3 bg-[#2a2a35] rounded-full" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-white mb-3">Join the waitlist</h1>

          {/* Description */}
          <p className="text-[#8a8a9a] text-sm leading-relaxed mb-8">
            Streamline your recruitment process, automate tasks, and hire top talent faster with Quiet Hire&apos;s AI-powered ATS. Join the waitlist for early access!
          </p>

          {/* Form */}
          <SignupForm />

          {/* Footer */}
          <p className="text-center text-[#5a5a6a] text-xs mt-10">
            For inquiries, contact us at:{" "}
            <a
              href="mailto:hello@quiethire.work"
              className="text-[#8a8a9a] underline underline-offset-2 hover:text-white transition-colors"
            >
              hello@quiethire.work
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
