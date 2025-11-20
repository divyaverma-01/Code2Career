"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Add validation + API call logic here
    router.push("/dashboard"); // redirect after login
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative px-6 text-white
      bg-gradient-to-br from-[#4c4cf0]/90 to-[#6717d0]/90 bg-cover bg-center"
      style={{ backgroundImage: "url('/images/image.png')" }}
    >
      {/* Overlay to soften background */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      {/* Login Card */}
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
          Login to your account
        </h3>

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
            placeholder="Enter your password"
          />
        </div>

        {/* CTA Button */}
        <button
          onClick={handleLogin}
          className="w-full py-2 rounded-xl bg-white text-[#4c4cf0] font-semibold
          hover:bg-gray-200 transition"
        >
          Login
        </button>

        {/* Divider */}
        <div className="text-center text-sm mt-4 opacity-80">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="font-semibold hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Eye, EyeOff } from "lucide-react";
// import { toast } from "react-toastify";

// const backendUrl = import.meta.env.VITE_API_URL;

// function Login() {
//   const navigate = useNavigate();

//   const handleGoogleLogin = () => {
//     window.location.href = `${backendUrl}/auth/google`;
//   };

//   const [showPassword, setShowPassword] = useState(false);
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//     watch,
//   } = useForm();
//   const onSubmit = async (data) => {
//     console.log("Form submitted:", data);
//     try {
//       const url = `${backendUrl}/login`;
//       const response = await axios.post(url, data);
//       console.log(response.data);
//       reset();
//       const token = response.data.token;
//       const activationToken = response.data.activationToken;

//       if (token) {
//         localStorage.setItem("token", token);
//         localStorage.setItem("activationToken", activationToken);
//       }
//       toast.success("Login successful! Welcome back.");
//       navigate("/");
//     } catch (error) {
//       console.error(`Login failed:`, error.response?.data || error.message);
//       toast.error(error.response?.data?.error || "An error occurred");
//     }
//   };

//   const password = watch("Password", "");
//   const [strength, setStrength] = useState(0);

//   const strengthLevels = [
//     { level: "Very Weak", color: "text-red-500" },

//     { level: "Weak", color: "text-orange-500" },

//     { level: "Medium", color: "text-yellow-500" },

//     { level: "Strong", color: "text-green-500" },

//     { level: "Very Strong", color: "text-emerald-600" },
//   ];

//   const passwordEdgeCases = (pwd) => {
//     let score = 0;

//     if (pwd.trim().length >= 6) score++;
//     if (/\d/.test(pwd)) score++;
//     if (/[A-Z]/.test(pwd)) score++;
//     if (/[a-z]/.test(pwd)) score++;
//     if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;
//     return score;
//   };

//   useEffect(() => {
//     setStrength(passwordEdgeCases(password));
//   }, [password]);

//   return (
//     <div className="space-y-8 ">
//       <div className="text-center ">
//         <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-300 mb-2">
//           Welcome Back
//         </h2>
//         <p className="text-gray-600 dark:text-gray-400">
//           Sign in to your account
//         </p>
//       </div>
//       <button
//         onClick={handleGoogleLogin}
//         className="flex items-center justify-center  gap-2 border border-gray-400 rounded-xl text-black dark:text-white font-semibold p-2 text-lg w-full"
//       >
//         <img src="/GoogleIcon.svg" alt="Google sign-in" className="size-6" />

//         <p>Continue with google</p>
//       </button>

//       {/* or  */}
//       <div className="flex items-center my-6">
//         <div className="flex-grow h-px bg-gray-300"></div>
//         <span className="mx-4 text-gray-500 font-medium text-sm">OR</span>
//         <div className="flex-grow h-px bg-gray-300"></div>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         <div>
//           <label
//             htmlFor="email"
//             className="block text-sm font-medium text-gray-900 dark:text-gray-300"
//           >
//             Email
//           </label>
//           <div className="mt-3">
//             <input
//               id="email"
//               type="email"
//               placeholder="you@example.com"
//               {...register("Email", {
//                 required: "Email is required",
//                 pattern: {
//                   value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                   message: "Enter a valid email address",
//                 },
//               })}
//               className="block w-full rounded-xl border border-gray-400 px-3 py-2 text-gray-900 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm bg-transparent"
//             />
//             {errors.Email && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.Email.message}
//               </p>
//             )}
//           </div>
//         </div>

//         <div>
//           <label
//             htmlFor="password"
//             className="block text-sm font-medium text-gray-900 dark:text-gray-300"
//           >
//             Password{" "}
//             <span
//               className={`text-sm ml-52 font-semibold ${
//                 strengthLevels[strength - 1]?.color
//               }`}
//             >
//               {strengthLevels[strength - 1]?.level}
//             </span>
//           </label>
//           <div className="mt-3 relative">
//             <input
//               id="password"
//               type={showPassword ? "text" : "password"}
//               placeholder="********"
//               {...register("Password", {
//                 required: "Password is required",
//                 minLength: {
//                   value: 6,
//                   message: "Password must be at least 6 characters",
//                 },
//               })}
//               className="block w-full rounded-xl bg-transparent border border-gray-400 px-3 py-2 text-gray-900 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword((prev) => !prev)}
//               className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-indigo-600"
//             >
//               {showPassword ? <Eye size={19} /> : <EyeOff size={19} />}
//             </button>
//             {errors.Password && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.Password.message}
//               </p>
//             )}
//           </div>
//           <div className="text-right mt-2 mb-4">
//             <a
//               href="#"
//               className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
//             >
//               Forgot password?
//             </a>
//           </div>
//         </div>

//         <div>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className={`w-full rounded-md py-2 px-4 text-white font-semibold ${
//               isSubmitting
//                 ? "opacity-50 cursor-not-allowed bg-gray-400"
//                 : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
//             }`}
//           >
//             {isSubmitting ? "Submitting..." : "Log In"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default Login;
