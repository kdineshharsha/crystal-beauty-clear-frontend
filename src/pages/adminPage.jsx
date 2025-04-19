import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import { FaUsers, FaBoxOpen, FaClipboardList } from "react-icons/fa"; // Import the icons
import AdminProductsPage from "./admin/products";
import AddProductForm from "./admin/addProductForm";
import EditProductForm from "./admin/editProduct";

export default function AdminPage() {
  return (
    <div className="w-full h-screen bg-gray-300 flex poppins-regular">
      <div className="h-full w-60 bg-gray-800 flex flex-col p-4">
        <Link
          to="/admin/users"
          className="text-white flex items-center space-x-2 py-2 hover:bg-gray-700 rounded-md"
        >
          <FaUsers className="text-xl" />
          <span>Users</span>
        </Link>
        <Link
          to="/admin/products"
          className="text-white flex items-center space-x-2 py-2 hover:bg-gray-700 rounded-md"
        >
          <FaBoxOpen className="text-xl" />
          <span>Products</span>
        </Link>
        <Link
          to="/admin/orders"
          className="text-white flex items-center space-x-2 py-2 hover:bg-gray-700 rounded-md"
        >
          <FaClipboardList className="text-xl" />
          <span>Orders</span>
        </Link>
      </div>

      <div className="h-full w-full bg-white rounded-md p-2 overflow-auto">
        <Routes>
          <Route path="users" element={<h1>Users</h1>} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="/products/addProduct" element={<AddProductForm />} />
          <Route path="/products/editProduct" element={<EditProductForm />} />

          <Route path="orders" element={<h1>Orders</h1>} />
        </Routes>
      </div>
    </div>
  );
}
