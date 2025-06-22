import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import MediaUpload from "../../utils/mediaUpload";

export default function AddProductForm() {
  const [category, setCategory] = useState("");
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
    if (!productId || !name || !price || !stock || !description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const promisesArray = [];
    for (let i = 0; i < images.length; i++) {
      promisesArray[i] = MediaUpload(images[i]);
    }
    try {
      const result = await Promise.all(promisesArray);

      const altNamesInArray = altNames
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name !== "");
      const token = localStorage.getItem("token");

      const product = {
        productId,
        name,
        altNames: altNamesInArray,
        price,
        labeledPrice,
        stock,
        description,
        image: result,
        category,
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
    <div className="w-full min-h-screen flex justify-center items-start bg-gray-50 p-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Add New Product
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Product ID */}
          <div>
            <label
              htmlFor="productId"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Product ID <span className="text-red-600">*</span>
            </label>
            <input
              id="productId"
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Enter Product ID"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none transition"
              required
            />
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Name <span className="text-red-600">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value.replace(/\b\w/g, (c) => c.toUpperCase()))
              }
              placeholder="Enter Product Name"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none transition"
              required
            />
          </div>

          {/* Alternative Names */}
          <div>
            <label
              htmlFor="altNames"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Alternative Names
            </label>
            <input
              id="altNames"
              type="text"
              value={altNames}
              onChange={(e) => setAltNames(e.target.value)}
              placeholder="Comma separated alternative names"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none transition"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write description..."
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 resize-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none transition"
              required
            />
          </div>

          {/* Price and Labeled Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Price (LKR) <span className="text-red-600">*</span>
              </label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none transition"
                required
              />
            </div>

            <div>
              <label
                htmlFor="labeledPrice"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Labeled Price (LKR)
              </label>
              <input
                id="labeledPrice"
                type="number"
                min="0"
                step="0.01"
                value={labeledPrice}
                onChange={(e) => setLabeledPrice(e.target.value)}
                placeholder="Enter labeled price"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none transition"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none transition"
            >
              <option value="">Select a Category</option>
              <option value="face">Face</option>
              <option value="skin">Skincare</option>
              <option value="nails">Nails</option>
              <option value="eye">Eyes</option>
              <option value="lips">Lips</option>
              <option value="fragrance">Fragrance</option>
            </select>
          </div>

          {/* Images */}
          <div>
            <label
              htmlFor="images"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Add Images
            </label>
            <input
              id="images"
              type="file"
              multiple
              onChange={(e) => setImages(e.target.files)}
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none transition"
            />
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3 max-h-40 overflow-auto">
                {Array.from(images).map((file, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-20 h-20 rounded-md object-cover border border-gray-300 shadow-sm"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Stock */}
          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Stock Quantity <span className="text-red-600">*</span>
            </label>
            <input
              id="stock"
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Enter stock amount"
              className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 outline-none transition"
              required
            />
          </div>

          {/* Buttons */}
          <div className="pt-6 flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md shadow transition"
            >
              Add Product
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-md shadow transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
