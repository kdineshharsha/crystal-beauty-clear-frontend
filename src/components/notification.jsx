import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { MdNotificationsActive } from "react-icons/md";
import { toast } from "react-hot-toast";

export default function Notification({ onNotificationCount }) {
  const [notifications, setNotifications] = useState([]);
  const [email, setEmail] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userRes = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/user/current",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const userEmail = userRes.data.user.email;
        setEmail(userEmail);
        const res = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/order/notifications/${userEmail}`
        );
        setNotifications(res.data);
        onNotificationCount(res.data.length); // ✅ Now this will work
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [token]);

  // 💖 Add this function before return
  const clearAllNotifications = async () => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/order/notifications/clear/${email}`
      );
      setNotifications([]);
      onNotificationCount(0); // 👈 Reset count when cleared
      // instantly clears from UI
      toast.success("All notifications cleared 💨");
    } catch (error) {
      console.error("Failed to clear notifications", error);
      toast.error("Something went wrong 🥺");
    }
  };

  return (
    <div className="w-full max-h-94 h-auto overflow-y-auto max-w-lg mx-auto  backdrop-blur-lg shadow-lg rounded-lg p-4 bg-white/80">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <MdNotificationsActive className="text-pink-500 text-2xl mr-2" />
        Notifications
      </h3>

      <div className="flex justify-end items-center my-4">
        {notifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="text-xs text-red-500 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-sm text-gray-500">No new notifications</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((item, index) => (
            <div
              key={index}
              className="flex items-start p-4 bg-white shadow-md rounded-lg transition-transform hover:scale-[1.02] duration-300"
            >
              <MdNotificationsActive className="text-pink-500 text-xl mt-1" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  Order{" "}
                  <span className="text-pink-600 font-semibold">
                    #{item.orderId}
                  </span>{" "}
                  is now{" "}
                  <span className="capitalize font-semibold text-gray-800">
                    {item.status}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(item.updatedAt), "MMMM d, yyyy • h:mm a")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
