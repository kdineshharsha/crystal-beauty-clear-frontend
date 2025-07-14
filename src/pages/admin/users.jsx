import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Loader from "../../components/loader";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaSearch,
  FaDownload,
  FaEye,
  FaUserCheck,
  FaUserTimes,
  FaUserShield,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
} from "react-icons/fa";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const limit = 10;
  const downloadRef = useRef(null);

  useEffect(() => {
    setLoaded(false);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
        params: { page, limit },
      })
      .then((res) => {
        const sortedUsers = res.data.users.sort((a, b) => {
          if (a.role === "admin" && b.role === "user") return -1;
          if (a.role === "user" && b.role === "admin") return 1;
          return 0;
        });
        setUsers(sortedUsers);
        setTotalPages(res.data.totalPages);
        setLoaded(true);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoaded(true);
      });
  }, [page]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
        params: { all: true },
      })
      .then((res) => setAllUsers(res.data.users))
      .catch((err) => console.error("Error fetching all users:", err));
  }, []);

  const toggleDisable = async (userId, currentStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/${userId}/disable`,
        { isDisabled: !currentStatus }
      );
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isDisabled: !currentStatus } : u
        )
      );
    } catch (error) {
      console.error("Error disabling user", error);
    }
  };

  const filteredUsers = search
    ? allUsers.filter(
        (user) =>
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  const exportToCSV = () => {
    const headers = ["First Name", "Last Name", "Email", "Role", "Status"];
    const rows = allUsers.map((u) => [
      u.firstName,
      u.lastName,
      u.email,
      u.role,
      u.isDisabled ? "Disabled" : "Active",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((e) => e.map((v) => `"${v}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    downloadRef.current.href = encodedUri;
    downloadRef.current.download = "user_list.csv";
    downloadRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <FaUsers className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">User Management</h1>
              <p className="text-purple-100 text-sm">
                Manage and monitor user accounts
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white p-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <FaDownload className="text-sm" />
                Export CSV
              </button>
              <a ref={downloadRef} style={{ display: "none" }} />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-b-3xl shadow-2xl overflow-hidden">
          {loaded ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 border-b border-gray-200">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaUsers className="text-2xl" />
                    <div>
                      <p className="text-sm opacity-90">Total Users</p>
                      <p className="text-2xl font-bold">
                        <p className="text-2xl font-bold">{allUsers.length}</p>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaUserCheck className="text-2xl" />
                    <div>
                      <p className="text-sm opacity-90">Active Users</p>
                      <p className="text-2xl font-bold">
                        {allUsers.filter((u) => !u.isDisabled).length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaUserTimes className="text-2xl" />
                    <div>
                      <p className="text-sm opacity-90">Disabled Users</p>
                      <p className="text-2xl font-bold">
                        {allUsers.filter((u) => u.isDisabled).length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaUserShield className="text-2xl" />
                    <div>
                      <p className="text-sm opacity-90">Admins</p>
                      <p className="text-2xl font-bold">
                        {allUsers.filter((u) => u.role === "admin").length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-purple-500" />
                          User
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredUsers.map((user, index) => (
                      <tr
                        key={user._id}
                        className={`hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                              {user.firstName?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {user._id.slice(-6)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role === "admin" ? (
                              <FaUserShield />
                            ) : (
                              <FaUser />
                            )}
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              user.isDisabled
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {user.isDisabled ? (
                              <FaUserTimes />
                            ) : (
                              <FaUserCheck />
                            )}
                            {user.isDisabled ? "Disabled" : "Active"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                toggleDisable(user._id, user.isDisabled)
                              }
                              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 transform hover:scale-105 shadow-sm ${
                                user.isDisabled
                                  ? "bg-green-500 hover:bg-green-600 text-white"
                                  : "bg-red-500 hover:bg-red-600 text-white"
                              }`}
                            >
                              {user.isDisabled ? (
                                <FaUserCheck />
                              ) : (
                                <FaUserTimes />
                              )}
                              {user.isDisabled ? "Enable" : "Disable"}
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/admin/users/${user.email}`)
                              }
                              className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105 shadow-sm"
                            >
                              <FaEye />
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {(page - 1) * limit + 1} to{" "}
                    {Math.min(page * limit, filteredUsers.length)} of{" "}
                    {filteredUsers.length} users
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="flex items-center gap-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      <FaChevronLeft />
                      Previous
                    </button>

                    <div className="flex gap-1">
                      {[...Array(totalPages).keys()].map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum + 1)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            page === pageNum + 1
                              ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="flex items-center gap-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      Next
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 flex justify-center">
              <Loader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
