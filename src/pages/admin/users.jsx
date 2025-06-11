import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/loader";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const limit = 10;

  useEffect(() => {
    setLoaded(false);
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
        params: { page, limit },
      })
      .then((res) => {
        // 🟡 Sort admins first, then users
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
        setLoaded(true); // Even on error, stop loader
      });
  }, [page]);

  const toggleDisable = async (userId, currentStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/${userId}/disable`,
        { isDisabled: !currentStatus }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isDisabled: !currentStatus } : user
        )
      );
    } catch (error) {
      console.error("Error disabling user", error);
    }
  };

  return (
    <div className="p-6 w-full h-full">
      <h2 className="text-2xl font-semibold mb-6">User Management</h2>
      <div className="overflow-x-auto">
        {loaded ? (
          <>
            <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-md">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-left">
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">Role</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="py-3 px-6">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="py-3 px-6">{user.email}</td>
                    <td className="py-3 px-6 capitalize">{user.role}</td>
                    <td className="py-3 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          user.isDisabled
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {user.isDisabled ? "Disabled" : "Active"}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => toggleDisable(user._id, user.isDisabled)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow ${
                          user.isDisabled
                            ? "bg-green-500 text-white hover:bg-green-600"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                      >
                        {user.isDisabled ? "Enable" : "Disable"}
                      </button>
                      <button
                        onClick={() => navigate(`/admin/users/${user.email}`)}
                        className="ml-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow bg-blue-500 text-white hover:bg-blue-600"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination controls */}
            <div className="flex justify-center items-center mt-4 gap-4">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
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
