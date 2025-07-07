import axios from "axios";
import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  FaPlus,
  FaSearch,
  FaDownload,
  FaEye,
  FaBox,
  FaExclamationTriangle,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { GoTrash } from "react-icons/go";
import { MdOutlineModeEdit } from "react-icons/md";
import toast from "react-hot-toast";
import Loader from "../../components/loader";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();
  const downloadRef = useRef(null);

  useEffect(() => {
    if (!loaded) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/product`)
        .then((res) => {
          setProducts(res.data);
          setLoaded(true);
        })
        .catch(() => {
          toast.error("Failed to load products");
        });
    }
  }, [loaded]);

  async function deleteProduct(id) {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in");
      return;
    }
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Product deleted successfully");
      setLoaded(false);
    } catch (error) {
      console.error(error);
      toast.error("Error deleting product");
    }
  }

  // Filtered products based on search
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesName = product.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      return matchesName;
    });
  }, [products, searchName]);

  // Pagination calculation
  const pageCount = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredProducts, currentPage]);

  // CSV Export function
  const exportToCSV = () => {
    const headers = ["Product ID", "Name", "Price", "Labeled Price", "Stock"];
    const rows = filteredProducts.map((p) => [
      p.productId,
      p.name,
      p.price,
      p.labeledPrice,
      p.stock,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((e) => e.map((v) => `"${v}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    downloadRef.current.href = encodedUri;
    downloadRef.current.download = "products.csv";
    downloadRef.current.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <FaBox className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Product Management</h1>
                <p className="text-blue-100 text-sm">
                  Manage your product inventory
                </p>
              </div>
            </div>
            <Link
              to="addProduct/"
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              <FaPlus /> Add Product
            </Link>
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
                placeholder="Search products by name..."
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200"
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
                    <FaBox className="text-2xl" />
                    <div>
                      <p className="text-sm opacity-90">Total Products</p>
                      <p className="text-2xl font-bold">
                        {filteredProducts.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaCheckCircle className="text-2xl" />
                    <div>
                      <p className="text-sm opacity-90">In Stock</p>
                      <p className="text-2xl font-bold">
                        {filteredProducts.filter((p) => p.stock >= 5).length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FaExclamationTriangle className="text-2xl" />
                    <div>
                      <p className="text-sm opacity-90">Low Stock</p>
                      <p className="text-2xl font-bold">
                        {filteredProducts.filter((p) => p.stock < 5).length}
                      </p>
                    </div>
                  </div>
                </div>
                {/* <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">₹</span>
                    <div>
                      <p className="text-sm opacity-90">Avg Price</p>
                      <p className="text-2xl font-bold">
                        {filteredProducts.length > 0
                          ? Math.round(
                              filteredProducts.reduce(
                                (sum, p) => sum + p.price,
                                0
                              ) / filteredProducts.length
                            )
                          : 0}
                      </p>
                    </div>
                  </div>
                </div> */}
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <FaBox className="text-blue-500" />
                          Product
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Labeled Price
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginatedProducts.map((product, index) => (
                      <tr
                        key={product.productId}
                        className={`hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        } ${product.stock < 5 ? "bg-red-50" : ""}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              <img
                                src={product.image[0]}
                                className="rounded-full"
                                alt=""
                              />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500 font-mono">
                                ID: {product.productId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          ₹{product.price}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          ₹{product.labeledPrice}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                              product.stock < 5
                                ? "bg-red-100 text-red-800"
                                : product.stock < 10
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {product.stock < 5 ? (
                              <FaExclamationTriangle />
                            ) : (
                              <FaCheckCircle />
                            )}
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 transform hover:scale-105 shadow-sm"
                              onClick={() => {
                                navigate("editProduct/", { state: product });
                              }}
                            >
                              <MdOutlineModeEdit />
                              Edit
                            </button>
                            <button
                              className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-red-500 hover:bg-red-600 text-white transition-all duration-200 transform hover:scale-105 shadow-sm"
                              onClick={() => deleteProduct(product.productId)}
                            >
                              <GoTrash />
                              Delete
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
                    Showing {(currentPage - 1) * pageSize + 1} to{" "}
                    {Math.min(currentPage * pageSize, filteredProducts.length)}{" "}
                    of {filteredProducts.length} products
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="flex items-center gap-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 text-sm font-medium"
                    >
                      <FaChevronLeft />
                      Previous
                    </button>

                    <div className="flex gap-1">
                      {[...Array(pageCount).keys()].map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum + 1)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentPage === pageNum + 1
                              ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={currentPage === pageCount}
                      onClick={() => setCurrentPage((p) => p + 1)}
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
