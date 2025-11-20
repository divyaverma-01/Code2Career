"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    // Add validation + API call logic here
    router.push("/dashboard"); // redirect after signup
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative px-6 text-white
      bg-gradient-to-br from-[#4c4cf0]/90 to-[#6717d0]/90 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/image.png')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      {/* Signup Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-md w-full p-8 rounded-2xl
        bg-white/10 backdrop-blur-md shadow-xl border border-white/20"
      >
        {/* Logo + Title */}
        <div className="flex items-center justify-center mb-6 gap-2">
          <Image
            src="/images/Logo.png"
            alt="Code2Career Logo"
            width={35}
            height={35}
          />
          <h2 className="text-2xl font-bold">Code2Career</h2>
        </div>

        <h3 className="text-xl font-semibold mb-4 text-center">
          Create your account
        </h3>

        {/* Name */}
        <div className="mb-4">
          <label className="block mb-1 text-sm">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300
            outline-none focus:bg-white/30 transition"
            placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300
            outline-none focus:bg-white/30 transition"
            placeholder="Enter your email"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-1 text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-gray-300
            outline-none focus:bg-white/30 transition"
            placeholder="Choose a strong password"
          />
        </div>

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          className="w-full py-2 rounded-xl bg-white text-[#4c4cf0] font-semibold
          hover:bg-gray-200 transition"
        >
          Sign Up
        </button>

        {/* Redirect to Login */}
        <div className="text-center text-sm mt-4 opacity-80">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="font-semibold hover:underline cursor-pointer"
          >
            Login
          </span>
        </div>
      </motion.div>
    </div>
  );
}
