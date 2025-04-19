import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const user = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    phone: phone,
  };

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
    <div className="h-screen w-full flex bg-[url('/login-bg.jpg')] bg-cover bg-center">
      {/* Left Side Panel */}
      <div className="w-1/2 h-full bg-amber-500 bg-opacity-70 flex items-center justify-center">
        <h1 className="text-5xl font-bold text-black drop-shadow-md">
          Join Us Today 💛
        </h1>
      </div>

      {/* Right Side - Register Section */}
      <div className="w-1/2 h-full flex items-center justify-center">
        <div className="w-[400px] h-auto overflow-y-auto backdrop-blur-md bg-white/10 border border-white shadow-2xl rounded-2xl p-8">
          <h2 className="text-2xl text-gray-900 font-semibold mb-6 text-center">
            Create a new account
          </h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-gray-800 text-sm mb-1 block">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-1 block">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-1 block">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-1 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div>
              <label className="text-gray-800 text-sm mb-1 block">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <button
              onClick={handleRegister}
              className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition duration-300 cursor-pointer"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </div>

          <p className="mt-6 text-sm text-center text-gray-700">
            Already have an account? &nbsp;
            <span className="underline cursor-pointer text-blue-500 hover:text-amber-500">
              <Link to="/login">Login</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
