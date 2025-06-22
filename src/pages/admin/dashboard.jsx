import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
  FaFileExport,
} from "react-icons/fa";
import Chart from "react-apexcharts";
import * as XLSX from "xlsx";

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

  const cards = [
    {
      label: "Total Users",
      value: analytics.users,
      icon: <FaUsers className="text-2xl text-blue-500" />,
    },
    {
      label: "Total Orders",
      value: analytics.orders,
      icon: <FaShoppingCart className="text-2xl text-purple-500" />,
    },
    {
      label: "Total Revenue",
      value: `Rs.${analytics.revenue.toFixed(2)}`,
      icon: <FaDollarSign className="text-2xl text-green-500" />,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <div
            key={i}
            className="bg-white shadow-md rounded-xl p-6 flex items-center gap-4"
          >
            <div className="p-4 bg-gray-100 rounded-full">{c.icon}</div>
            <div>
              <h2 className="text-xl font-semibold">{c.value}</h2>
              <p className="text-gray-500 text-sm">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Revenue Chart */}
        <div className="bg-white shadow-md rounded-xl p-6 w-full lg:w-1/2">
          <h2 className="text-xl font-semibold mb-4">
            Revenue (Recent Orders)
          </h2>
          <Chart
            type="line"
            height={300}
            options={{
              chart: { id: "revenue-chart", toolbar: { show: false } },
              xaxis: {
                categories: analytics.recentOrders.map((o) =>
                  new Date(o.date).toLocaleDateString()
                ),
              },
              stroke: { curve: "smooth" },
              colors: ["#22c55e"],
            }}
            series={[
              {
                name: "Revenue",
                data: analytics.recentOrders.map((o) => o.total),
              },
            ]}
          />
        </div>

        {/* User Growth Chart */}
        <div className="bg-white shadow-md rounded-xl p-6 w-full lg:w-1/2">
          <h2 className="text-xl font-semibold mb-4">User Growth</h2>
          <Chart
            type="area"
            height={300}
            options={{
              chart: { id: "user-growth-chart", toolbar: { show: false } },
              xaxis: {
                categories: analytics.usersPerPeriod.map((u) => u._id),
              },
              stroke: { curve: "smooth" },
              colors: ["#3b82f6"],
            }}
            series={[
              {
                name: "New Users",
                data: analytics.usersPerPeriod.map((u) => u.count),
              },
            ]}
          />
        </div>
      </div>

      {/* Top-Selling Products */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Top-Selling Products</h2>
        <Chart
          type="bar"
          height={300}
          options={{
            chart: { id: "top-products", toolbar: { show: false } },
            xaxis: {
              categories: analytics.topProducts.map((p) => p.name),
            },
            colors: ["#6366f1"],
          }}
          series={[
            {
              name: "Sold",
              data: analytics.topProducts.map((p) => p.count),
            },
          ]}
        />
      </div>

      {/* Low Stock Alerts */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Low Stock Alerts</h2>
        <ul className="list-disc pl-6 text-red-500">
          {analytics.lowStock.length > 0 ? (
            analytics.lowStock.map((p) => (
              <li key={p._id}>
                {p.name} – {p.stock} left
              </li>
            ))
          ) : (
            <li>No products with low stock.</li>
          )}
        </ul>
      </div>

      {/* Filters */}
      <div className="flex justify-between items-center">
        <select
          value={period}
          onChange={(e) => {
            setPeriod(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="all">All Time</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={exportToExcel}
            className="px-3 py-1 bg-green-600 text-white rounded flex items-center gap-2"
          >
            <FaFileExport /> Export
          </button>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={analytics.recentOrders.length < limit}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="py-2">Order ID</th>
              <th className="py-2">User</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Date</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {analytics.recentOrders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="py-2">{order.orderId}</td>
                <td className="py-2">{order.email}</td>
                <td className="py-2">Rs.{order.total.toFixed(2)}</td>
                <td className="py-2">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
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
  );
}
