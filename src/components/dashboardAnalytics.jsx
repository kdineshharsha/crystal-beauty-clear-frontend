import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

export default function DashboardAnalytics() {
  const [summary, setSummary] = useState({
    users: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/admin/summary", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setSummary(res.data);
      })
      .catch((err) => {
        console.error("Error fetching summary:", err);
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h4 className="text-sm text-gray-500">Total Users</h4>
          <p className="text-2xl font-bold text-blue-600">{summary.users}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h4 className="text-sm text-gray-500">Total Orders</h4>
          <p className="text-2xl font-bold text-green-600">
            {summary.totalOrders}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h4 className="text-sm text-gray-500">Total Revenue</h4>
          <p className="text-2xl font-bold text-amber-600">
            Rs.{summary.totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Orders Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Orders Overview
        </h3>
        <Chart
          type="line"
          height={300}
          options={{
            chart: { id: "orders" },
            xaxis: {
              categories: summary.recentOrders.map((order) =>
                new Date(order.createdAt).toLocaleDateString()
              ),
            },
          }}
          series={[
            {
              name: "Revenue",
              data: summary.recentOrders.map((order) => order.totalAmount),
            },
          ]}
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Recent Orders
        </h3>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Order ID</th>
              <th className="py-2">User</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {summary.recentOrders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="py-2">{order._id.slice(-6).toUpperCase()}</td>
                <td className="py-2">{order.user?.email || "Guest"}</td>
                <td className="py-2">Rs.{order.totalAmount.toFixed(2)}</td>
                <td className="py-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
