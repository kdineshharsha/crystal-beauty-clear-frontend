import axios from "axios";
import React, { useEffect, useState } from "react";

import { FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { GoTrash } from "react-icons/go";
import { MdOutlineModeEdit } from "react-icons/md";
import toast from "react-hot-toast";
import Loader from "../../components/loader";
export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/product")
        .then((res) => {
          setProducts(res.data);
          console.log(res.data);
          setLoaded(true);
        });
    }
  }, [loaded]);

  async function deleteProduct(id) {
    const token = localStorage.getItem("token");
    if (token == null) {
      toast.error("You are not logged in");
      return;
    }
    try {
      await axios.delete(
        import.meta.env.VITE_BACKEND_URL + "/api/product/" + id,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoaded(false);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error deleting product");
      return;
    }
  }

  return (
    <div className="w-full h-full rounded-lg ">
      {loaded && (
        <table className="w-full table-auto border-collapse shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-600 text-white text-sm uppercase">
            <tr>
              <th className="px-4 py-3 text-left border-b">Product ID</th>
              <th className="px-4 py-3 text-left border-b">Name</th>
              <th className="px-4 py-3 text-left border-b">Price</th>
              <th className="px-4 py-3 text-left border-b">Labeled Price</th>
              <th className="px-4 py-3 text-left border-b">Stock</th>
              <th className="px-4 py-3 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 text-sm">
            {products.map((product, index) => (
              <tr
                key={index}
                className="hover:bg-gray-200 transition duration-200 cursor-pointer"
              >
                <td className="px-4 py-3 border-b">{product.productId}</td>
                <td className="px-4 py-3 border-b">{product.name}</td>
                <td className="px-4 py-3 border-b">${product.price}</td>
                <td className="px-4 py-3 border-b">${product.labeledPrice}</td>
                <td className="px-4 py-3 border-b">{product.stock}</td>
                <td className="px-4 py-3 border-b ">
                  <div className="flex items-center space-x-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-md "
                      onClick={() => {
                        navigate("editProduct/", { state: product });
                      }}
                    >
                      <MdOutlineModeEdit className="size-5" />
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md "
                      onClick={() => deleteProduct(product.productId)}
                    >
                      <GoTrash className="size-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!loaded && (
        <div className="w-full h-full flex items-center justify-center">
          <Loader />
        </div>
      )}
      <Link
        to="addProduct/"
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full size-12 flex items-center justify-center cursor-pointer"
      >
        <FaPlus />
      </Link>
    </div>
  );
}
