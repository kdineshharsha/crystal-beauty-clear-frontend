import { useEffect, useState } from "react";
import axios from "axios";
export default function UserData() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token != null) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/user/current", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("API response:", response.data); // Debugging line
          setUser(response.data.user); // Adjust this if needed
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setUser(null);
        });
    }
  }, []);

  console.log("User state:", user); // Debugging line

  return user ? (
    <>
      <div className="flex mb-4 w-full items-center justify-start">
        <img src="/user.png" alt="" className="size-12" />
        <div className="ml-2 overflow-y-hidden">
          <p className="text-gray-500 text-sm">Welcome back,</p>
          <p className="font-semibold overflow-">{user.firstName}</p>
        </div>
      </div>
      <button
        onClick={() => {
          localStorage.removeItem("token");

          window.location = "/login";
          setUser(null);
        }}
        className="px-8 py-2 bg-accent text-white rounded-4xl font-semibold mb-2 w-full hover:bg-accent-hover transition duration-300"
      >
        Log out
      </button>
    </>
  ) : (
    <>
      <button
        className="px-8 py-2 bg-accent text-white rounded-4xl font-semibold mb-2 w-full"
        onClick={() => (window.location = "/login")}
      >
        Login
      </button>
      <button className="px-4 py-2 bg-white text-black rounded-4xl border-2 border-secondary font-semibold w-full">
        Register
      </button>
    </>
  );
}
