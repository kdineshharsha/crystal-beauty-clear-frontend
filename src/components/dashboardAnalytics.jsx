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

  const chartOptions = {
    chart: {
      id: "orders",
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: ["#3B82F6"],
    grid: {
      borderColor: "#F3F4F6",
      strokeDashArray: 5,
    },
    xaxis: {
      categories: summary.recentOrders.map((order) =>
        new Date(order.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      ),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
        formatter: (value) => `Rs.${value.toFixed(0)}`,
      },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (value) => `Rs.${value.toFixed(2)}`,
      },
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
  };

  const StatCard = ({ title, value, color, icon, trend }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color.bg}`}>
          <div className={`w-6 h-6 ${color.text}`}>{icon}</div>
        </div>
        {trend && (
          <span className="text-sm text-green-600 font-medium flex items-center">
            ↗ {trend}
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className={`text-2xl font-bold ${color.text}`}>{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Analytics
          </h1>
          <p className="text-gray-600">
            Track your business performance and key metrics
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value={summary.users.toLocaleString()}
            color={{
              bg: "bg-blue-50",
              text: "text-blue-600",
            }}
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
            trend="+12%"
          />
          <StatCard
            title="Total Orders"
            value={summary.totalOrders.toLocaleString()}
            color={{
              bg: "bg-green-50",
              text: "text-green-600",
            }}
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H2m5 10v6a1 1 0 001 1h1m0 0a2 2 0 104 0m-4 0a2 2 0 104 0m0 0V9a1 1 0 011-1h2a1 1 0 011 1v10" />
              </svg>
            }
            trend="+8%"
          />
          <StatCard
            title="Total Revenue"
            value={`Rs.${summary.totalRevenue.toLocaleString()}`}
            color={{
              bg: "bg-amber-50",
              text: "text-amber-600",
            }}
            icon={
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            }
            trend="+15%"
          />
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Revenue Overview
              </h2>
              <p className="text-sm text-gray-500">
                Track your revenue performance over time
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <Chart
              type="area"
              height={320}
              options={chartOptions}
              series={[
                {
                  name: "Revenue",
                  data: summary.recentOrders.map((order) => order.totalAmount),
                },
              ]}
            />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Recent Orders
            </h2>
            <p className="text-sm text-gray-500">
              Latest transactions from your customers
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {summary.recentOrders.map((order, index) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            #{order._id.slice(-6).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {(order.user?.email || "G").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {order.user?.email || "Guest"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        Rs.{order.totalAmount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
