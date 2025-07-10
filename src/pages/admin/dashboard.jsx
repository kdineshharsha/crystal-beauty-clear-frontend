import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
  FaFileExport,
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
} from "react-icons/fa";
import Chart from "react-apexcharts";
import * as XLSX from "xlsx";
import DashboardAnalytics from "../../components/dashboardAnalytics";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState({
    users: 0,
    orders: 0,
    revenue: 0,
    recentOrders: [],
    usersPerPeriod: [],
    topProducts: [],
    lowStock: [],
  });

  const [period, setPeriod] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 5;
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/summary`, {
        params: { period, page, limit },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAnalytics(res.data))
      .catch(console.error);
  }, [period, page]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(analytics.recentOrders);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, "recent_orders.xlsx");
  };

  const StatCard = ({ label, value, icon, color, trend }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color.bg}`}>
          <div className={`text-2xl ${color.text}`}>{icon}</div>
        </div>
        {trend && (
          <div className="flex items-center text-sm font-medium text-green-600">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
        <p className={`text-2xl font-bold ${color.text}`}>{value}</p>
      </div>
    </div>
  );

  const cards = [
    {
      label: "Total Users",
      value: analytics.users.toLocaleString(),
      icon: <FaUsers />,
      color: { bg: "bg-blue-50", text: "text-blue-600" },
      trend: "+12%",
    },
    {
      label: "Total Orders",
      value: analytics.orders.toLocaleString(),
      icon: <FaShoppingCart />,
      color: { bg: "bg-purple-50", text: "text-purple-600" },
      trend: "+8%",
    },
    {
      label: "Total Revenue",
      value: `Rs.${analytics.revenue.toLocaleString()}`,
      icon: <FaDollarSign />,
      color: { bg: "bg-green-50", text: "text-green-600" },
      trend: "+15%",
    },
  ];

  const chartOptions = {
    chart: {
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    grid: {
      borderColor: "#F3F4F6",
      strokeDashArray: 5,
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
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
      },
    },
    tooltip: {
      theme: "light",
    },
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor your business performance and manage operations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <StatCard key={i} {...card} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Revenue Trend
                </h2>
                <p className="text-sm text-gray-500">
                  Recent order revenue performance
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Revenue</span>
              </div>
            </div>
            {analytics.recentOrders && analytics.recentOrders.length > 0 ? (
              <Chart
                type="area"
                height={300}
                options={{
                  ...chartOptions,
                  colors: ["#22c55e"],
                  xaxis: {
                    ...chartOptions.xaxis,
                    categories: analytics.recentOrders.map((o) =>
                      new Date(o.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    ),
                  },
                  stroke: { curve: "smooth", width: 3 },
                  fill: {
                    type: "gradient",
                    gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.7,
                      opacityTo: 0.2,
                    },
                  },
                }}
                series={[
                  {
                    name: "Revenue",
                    data: analytics.recentOrders.map((o) => o.total || 0),
                  },
                ]}
              />
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FaDollarSign className="text-2xl text-gray-400" />
                  </div>
                  <p className="text-sm">No revenue data available</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Data will appear when orders are placed
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* User Growth Chart */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  User Growth
                </h2>
                <p className="text-sm text-gray-500">
                  New user registrations over time
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>New Users</span>
              </div>
            </div>
            {analytics.usersPerPeriod && analytics.usersPerPeriod.length > 0 ? (
              <Chart
                type="area"
                height={300}
                options={{
                  ...chartOptions,
                  colors: ["#3b82f6"],
                  xaxis: {
                    ...chartOptions.xaxis,
                    categories: analytics.usersPerPeriod.map(
                      (u) => u._id || "N/A"
                    ),
                  },
                  stroke: { curve: "smooth", width: 3 },
                  fill: {
                    type: "gradient",
                    gradient: {
                      shadeIntensity: 1,
                      opacityFrom: 0.7,
                      opacityTo: 0.2,
                    },
                  },
                }}
                series={[
                  {
                    name: "New Users",
                    data: analytics.usersPerPeriod.map((u) => u.count || 0),
                  },
                ]}
              />
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FaUsers className="text-2xl text-gray-400" />
                  </div>
                  <p className="text-sm">No user growth data available</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Data will appear when users register
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Products & Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top-Selling Products */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Top-Selling Products
              </h2>
              <p className="text-sm text-gray-500">
                Most popular items by sales volume
              </p>
            </div>
            {analytics.topProducts && analytics.topProducts.length > 0 ? (
              <Chart
                type="bar"
                height={300}
                options={{
                  ...chartOptions,
                  colors: ["#6366f1"],
                  xaxis: {
                    ...chartOptions.xaxis,
                    categories: analytics.topProducts.map(
                      (p) => p.name || "Unknown"
                    ),
                  },
                  plotOptions: {
                    bar: {
                      borderRadius: 8,
                      horizontal: false,
                    },
                  },
                }}
                series={[
                  {
                    name: "Units Sold",
                    data: analytics.topProducts.map((p) => p.count || 0),
                  },
                ]}
              />
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <FaShoppingCart className="text-2xl text-gray-400" />
                  </div>
                  <p className="text-sm">No product sales data available</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Data will appear when products are sold
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Low Stock Alerts
              </h2>
              <p className="text-sm text-gray-500">
                Products requiring immediate attention
              </p>
            </div>
            <div className="space-y-4">
              {analytics.lowStock.length > 0 ? (
                analytics.lowStock.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-full">
                        <FaExclamationTriangle className="text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Only {product.stock} units left
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      Low Stock
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500">
                    All products are well-stocked!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">
                Time Period:
              </label>
              <select
                value={period}
                onChange={(e) => {
                  setPeriod(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              >
                <option value="all">All Time</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <FaFileExport />
                Export Excel
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <FaChevronLeft />
                </button>
                <span className="px-3 py-2 text-sm text-gray-500">
                  Page {page}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={analytics.recentOrders.length < limit}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Recent Orders
            </h2>
            <p className="text-sm text-gray-500">
              Latest customer transactions and order details
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
                {analytics.recentOrders.map((order, index) => (
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
                            {order.orderId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {order.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {order.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        Rs.{order.total.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {order.status}
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
