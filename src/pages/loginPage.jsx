import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (response) => {
      setLoading(true);
      // console.log("Login successful", response);
      axios
        .post(import.meta.env.VITE_BACKEND_URL + "/api/user/google", {
          accessToken: response.access_token,
        })
        .then((response) => {
          console.log("Login successful", response.data);
          toast.success("Login successful");
          localStorage.setItem("token", response.data.token);
          const user = response.data.user;
          if (user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
          setLoading(false);
        });
    },

    onError: (error) => {
      console.log("Login failed", error);
      toast.error("Login failed");
    },
  });

  function handleLogin() {
    setLoading(true);
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/user/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        console.log("Login successful", res.data);
        toast.success("Login successful");
        localStorage.setItem("token", res.data.token);
        const user = res.data.user;
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("Login failed", err.response.data.message);
        toast.error(err.response.data.message || "Login failed");
      });
  }

  return (
    <div className="h-screen w-full flex">
      <div className="w-1/2 h-full  lg:flex bg-[url('/img3.jpeg')] bg-cover  hidden relative">
        <div className="  w-full  absolute  "></div>
      </div>
      <div className="lg:w-1/2 w-full h-full flex justify-center items-center bg-[url('/blob2.svg')]  bg-cover bg-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 transition-all duration-300 hover:shadow-pink-200">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="/logo_sm.png"
              alt="logo"
              className="w-20 h-20 object-contain animate-pulse"
            />
          </div>

          {/* Headings */}
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-1">
            Welcome
          </h2>
          <h3 className="text-xl font-semibold text-accent text-center mb-6">
            Crystal Beauty Clear
          </h3>

          {/* Form */}
          <form className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your Email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition pr-10"
                />
                <div
                  className="absolute top-2.5 right-3 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            {/* Remember Me + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="form-checkbox text-accent" />
                Remember Me
              </label>
              <a
                href="#"
                className="text-accent hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/reset");
                }}
              >
                {/* <Link to="/reset"> */}
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-accent text-white py-2 rounded-lg hover:bg-accent-hover transition font-medium"
              onClick={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              Login
            </button>

            {/* OR separator */}
            <div className="flex items-center justify-center text-sm text-gray-400">
              Or
            </div>

            {/* Google Login */}
            <button
              type="button"
              className="w-full border border-gray-300 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-gray-100 transition"
              onClick={() => loginWithGoogle()}
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Login with Google
            </button>

            {/* Create Account */}
            <p className="text-center text-sm mt-4 text-gray-600">
              Don’t have an account?{" "}
              <a href="#" className="text-accent hover:underline font-medium">
                <Link to="/register">Sign Up</Link>
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
