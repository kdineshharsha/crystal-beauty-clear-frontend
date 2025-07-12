import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const user = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    phone: phone,
  };

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

  console.log(user);

  const navigate = useNavigate();

  function handleRegister() {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/user/register", user)
      .then((res) => {
        toast.success("Registration successful");
        navigate("/login");
      })
      .catch((err) => {
        console.error("Registration failed", err);
        toast.error("Registration failed");
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className="w-full h-screen  lg:flex ">
      <div className="w-1/2 h-full  lg:flex bg-[url('/img3.jpeg')] bg-cover  hidden relative"></div>
      <div className="lg:w-1/2 w-full h-auto flex justify-center items-center bg-[url('/blob2.svg')]  bg-cover bg-center px-4">
        <div className="w-full h-full max-w-md bg-white rounded-3xl shadow-2xl p-8 transition-all duration-300 hover:shadow-pink-200">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <img
              src="/logo_sm.png"
              alt="logo"
              className="w-20 h-20 object-contain animate-pulse"
            />
          </div>

          {/* Headings */}
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Register an Account
          </h2>

          {/* Form */}
          <form className="space-y-4 " autoComplete="off">
            {/* Email */}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                placeholder="Enter your first Name"
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                placeholder="Enter your last Name"
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                placeholder="Enter your Email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                placeholder="Enter your Phone Number"
                onChange={(e) => setPhone(e.target.value)}
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
                  value={password}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  placeholder="Re-enter your Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition pr-10"
                />
                <div
                  className="absolute top-2.5 right-3 text-gray-500 cursor-pointer"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-accent text-white py-2 rounded-lg hover:bg-accent-hover transition font-medium"
              onClick={(e) => {
                e.preventDefault();
                handleRegister();
              }}
            >
              Register
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
              SignUp with Google
            </button>

            {/* Create Account */}
            <p className="text-center text-sm mt-4 text-gray-600">
              Have an account?{" "}
              <a href="#" className="text-pink-500 hover:underline font-medium">
                <Link to="/login">Sign In</Link>
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
