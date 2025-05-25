import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  function sendEmail() {
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/user/sendMail", {
        email: email,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Email sent successfully");
          toast.success("Email sent successfully");
        } else {
          console.error("Error sending email");
        }
      })
      .catch((error) => {
        console.error("Error sending email", error);
      });
  }

  function changePassword() {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    axios
      .post(import.meta.env.VITE_BACKEND_URL + "/api/user/changePW", {
        email: email,
        otp: otp,
        password: password,
      })
      .then((response) => {
        console.log(response.data);
        toast.success("Password changed successfully");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong");
        //reload page
      });
  }

  return (
    <div className="h-screen w-full flex justify-center items-center bg-primary">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 transition-all duration-300 hover:shadow-pink-200 h-auto overflow-hidden relative">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="/logo_sm.png"
            alt="logo"
            className="w-20 h-20 object-contain animate-pulse"
          />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-1">
          Welcome
        </h2>
        <h3 className="text-xl font-semibold text-accent text-center mb-6">
          Crystal Beauty Clear
        </h3>

        {/* Sliding Section Container */}
        <div className="relative w-full h-[350px] overflow-hidden">
          <div
            className={`absolute top-0 left-0 w-[200%] flex transition-transform duration-500 ease-in-out ${
              emailSent ? "-translate-x-1/2" : "translate-x-0"
            }`}
          >
            {/* Send Email Section */}
            <form className="w-1/2 px-4 space-y-4">
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
              <button
                type="submit"
                className="w-full bg-accent text-white py-2 rounded-lg hover:bg-accent-hover transition font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  setEmailSent(true);
                  sendEmail();
                }}
              >
                Send Code
              </button>
            </form>

            {/* Change Password Section */}
            <form className="w-1/2 px-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OTP
                </label>
                <input
                  value={otp}
                  type="text"
                  placeholder="Enter your OTP"
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  value={password}
                  type="password"
                  placeholder="Enter your New Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  value={confirmPassword}
                  type="password"
                  placeholder="Re Enter your New Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-accent text-white py-2 rounded-lg hover:bg-accent-hover transition font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  changePassword();
                }}
              >
                Change Password
              </button>
              <p className="text-center text-sm mt-2 text-gray-600">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setEmailSent(false);
                  }}
                  className="text-accent hover:underline font-medium"
                >
                  REENTER
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
