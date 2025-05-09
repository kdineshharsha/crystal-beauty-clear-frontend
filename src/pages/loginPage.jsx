import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
        console.log("Login failed", err);
        toast.error("Login failed");
      });
  }

  return (
    <div className="h-screen w-full flex bg-[url('/login-bg.jpg')] bg-cover bg-center">
      {/* Left Side Panel */}
      <div className="w-1/2 h-full bg-amber-500 bg-opacity-70 flex items-center justify-center">
        <h1 className="text-5xl font-bold text-black drop-shadow-md">
          Welcome Back 💛
        </h1>
      </div>

      {/* Right Side - Login Section */}
      <div className="w-1/2 h-full flex items-center justify-center">
        <div className="w-[400px] h-[500px] backdrop-blur-md bg-white/10 border border-white shadow-2xl rounded-2xl p-8">
          <h2 className="text-2xl text-gray-900 font-semibold mb-6 text-center">
            Login to your account
          </h2>

          {/* Login Fields */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-gray-800 text-sm mb-1 block">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-1 block">
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition duration-300  cursor-pointer"
            >
              {loading ? "Loading..." : "Login"}
            </button>

            <button
              onClick={() => loginWithGoogle()}
              className="w-full flex items-center justify-center mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-lg transition duration-300 cursor-pointer"
            >
              <FcGoogle className="text-2xl mr-2" />
              {loading ? "Loading" : " Login with Google"}
            </button>
          </div>

          <p className="mt-6 text-sm text-center text-gray-700">
            Don’t have an account? &nbsp;
            <span className="underline cursor-pointer text-blue-500 hover:text-amber-500">
              <Link to="/register">Sign Up</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
