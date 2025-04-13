import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import MediaUpload from "../../utils/mediaUpload";

// https://howhygpegujbbfzexagh.supabase.co
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhvd2h5Z3BlZ3VqYmJmemV4YWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NjM3OTAsImV4cCI6MjA2MDAzOTc5MH0.BTpJcykEkYRkKOMo1GFtvtVHrCSwhR97jUVN3TBojdM

export default function AddProductForm() {
  // Declare state variables at the top level of the component
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altNames, setAltNames] = useState("");
  const [price, setPrice] = useState("");
  const [labeledPrice, setLabeledPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  async function handleSubmit() {
    const promisesArray = [];
    for (let i = 0; i < images.length; i++) {
      const promise = MediaUpload(images[i]);
      promisesArray[i] = promise;
    }
    try {
      const result = await Promise.all(promisesArray);
      console.log(result);
      // return;

      const altNamesInArray = altNames.split(",");
      const token = localStorage.getItem("token");

      const product = {
        productId: productId,
        name: name,
        altNames: altNamesInArray,
        price: price,
        labeledPrice: labeledPrice,
        stock: stock,
        description: description,
        image: result,
      };
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/product",
        product,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Product added successfully");
      navigate("/admin/products");
    } catch (err) {
      console.log(err);
      toast.error("Product not added");
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
        Add New Product
      </h2>

      <div className="space-y-4">
        {/* Product ID */}
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Product ID
          </label>
          <input
            onChange={(e) => setProductId(e.target.value)}
            type="text"
            value={productId}
            placeholder="Enter Product ID"
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            value={name}
            placeholder="Enter Product Name"
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Alternative Names
          </label>
          <input
            onChange={(e) => setAltNames(e.target.value)}
            type="text"
            value={altNames}
            placeholder="Enter Alternative Names"
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            placeholder="Write description..."
            rows={3}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          ></textarea>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Price ($)
          </label>
          <input
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            value={price}
            placeholder="Enter price"
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Labeled Price */}
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Labeled Price ($)
          </label>
          <input
            onChange={(e) => setLabeledPrice(e.target.value)}
            type="number"
            value={labeledPrice}
            placeholder="Enter labeled price"
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Add Image
          </label>
          <input
            onChange={(e) => setImages(e.target.files)}
            multiple
            type="file"
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
            Stock Quantity
          </label>
          <input
            onChange={(e) => setStock(e.target.value)}
            type="number"
            value={stock}
            placeholder="Enter stock amount"
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Buttons */}
        <div className="pt-4 flex justify-between space-x-4">
          <button
            onClick={handleSubmit}
            className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
          >
            Add Product
          </button>
          <button className="w-1/2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
