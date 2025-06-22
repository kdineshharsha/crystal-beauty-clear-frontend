import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
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

  // Filtered products based on search and maxPrice
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
  function exportToCSV() {
    const headers = ["Product ID", "Name", "Price", "Labeled Price", "Stock"];
    const rows = filteredProducts.map((p) => [
      p.productId,
      p.name,
      p.price,
      p.labeledPrice,
      p.stock,
    ]);
    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((e) => e.map((v) => `"${v}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Product Management</h2>
        <Link
          to="addProduct/"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm shadow"
        >
          <FaPlus /> Add Product
        </Link>
      </div>

      {/* Search and Filter Inputs */}

      <div className="mb-4 flex flex-wrap items-center gap-4 justify-between">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          title="Export filtered products to CSV"
        >
          Export CSV
        </button>
      </div>

      {loaded ? (
        <>
          <div className="overflow-x-auto rounded-xl shadow ring-1 ring-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Product ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Labeled Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-800">
                {paginatedProducts.map((product, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-gray-50 transition duration-150 ${
                      product.stock < 5 ? "bg-red-100" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-mono">
                      {product.productId}
                    </td>
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">Rs.{product.price}</td>
                    <td className="px-6 py-4">Rs.{product.labeledPrice}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow"
                          onClick={() => {
                            navigate("editProduct/", { state: product });
                          }}
                          title="Edit"
                        >
                          <MdOutlineModeEdit className="size-5" />
                        </button>
                        <button
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow"
                          onClick={() => deleteProduct(product.productId)}
                          title="Delete"
                        >
                          <GoTrash className="size-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>
            {[...Array(pageCount).keys()].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === page + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {page + 1}
              </button>
            ))}
            <button
              disabled={currentPage === pageCount}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center mt-20">
          <Loader />
        </div>
      )}
    </div>
  );
}
