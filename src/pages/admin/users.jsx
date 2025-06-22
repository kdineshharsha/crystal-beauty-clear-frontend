import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Loader from "../../components/loader";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
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

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ["First Name", "Last Name", "Email", "Role", "Status"];
    const rows = filteredUsers.map((u) => [
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
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">User Management</h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            Export to Excel
          </button>
          <a ref={downloadRef} style={{ display: "none" }} />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl shadow ring-1 ring-gray-200 bg-white">
        {loaded ? (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                      {user.role}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 inline-block text-xs rounded-full font-semibold ${
                          user.isDisabled
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {user.isDisabled ? "Disabled" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => toggleDisable(user._id, user.isDisabled)}
                        className={`px-3 py-1 rounded text-sm font-medium shadow transition-colors ${
                          user.isDisabled
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                      >
                        {user.isDisabled ? "Enable" : "Disable"}
                      </button>
                      <button
                        onClick={() => navigate(`/admin/users/${user.email}`)}
                        className="px-3 py-1 rounded text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 shadow"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
}
