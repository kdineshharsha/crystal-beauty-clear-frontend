import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/product")
      .then((res) => {
        setProducts(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="w-full h-full rounded-lg">
      <table className="w-full table-auto border-collapse shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-600 text-white text-sm uppercase">
          <tr>
            <th className="px-4 py-3 text-left border-b">Product ID</th>
            <th className="px-4 py-3 text-left border-b">Name</th>
            <th className="px-4 py-3 text-left border-b">Price</th>
            <th className="px-4 py-3 text-left border-b">Labeled Price</th>
            <th className="px-4 py-3 text-left border-b">Stock</th>
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
            </tr>
          ))}
        </tbody>
      </table>
      <Link
        to="addProduct/"
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full size-12 flex items-center justify-center cursor-pointer"
      >
        <FaPlus />
      </Link>
    </div>
  );
}
