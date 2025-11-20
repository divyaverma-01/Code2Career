"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex flex-col relative px-8 py-6 text-white overflow-hidden 
      bg-gradient-to-br from-[#4c4cf0]/90 to-[#6717d0]/90 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/LandingPage.png')" }}
    >
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* NAVBAR */}
      <header className="flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <Image
            src="/images/Logo.png"
            alt="Code2Career Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <div className="text-xl font-semibold cursor-pointer">
            Code2Career
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="px-4 py-2 bg-white text-[#4c4cf0] rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 items-center justify-center mt-5 flex-col relative z-10">
        <motion.div
          className="max-w-xl text-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
            Prepare smart, build consistency, <br /> and accelerate your tech
            journey
          </h1>
          <p className="mt-4 text-lg opacity-90 leading-relaxed">
            • Practice quizzes • Live study sessions <br />
            • Smart analytics • Revision tools <br />• Career tracking •
            Community support
          </p>

          <div className="mt-6 flex gap-4 justify-center">
            <button
              onClick={() => router.push("/signup")}
              className="px-6 py-3 rounded-xl bg-white text-[#4c4cf0] font-semibold hover:bg-gray-200 transition"
            >
              Start Preparing
            </button>
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
            >
              Login
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
