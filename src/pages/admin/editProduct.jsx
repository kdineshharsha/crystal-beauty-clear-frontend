import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import MediaUpload from "../../utils/mediaUpload";

export default function EditProductForm() {
  const locationData = useLocation();
  const navigate = useNavigate();

  // Always declare hooks at top level
  const [category, setCategory] = useState("");
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altNames, setAltNames] = useState("");
  const [price, setPrice] = useState("");
  const [labeledPrice, setLabeledPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize state or redirect if no data
  useEffect(() => {
    if (!locationData.state) {
      toast.error("Product not found");
      navigate("/admin/products");
    } else {
      setCategory(locationData.state.category || "");
      setProductId(locationData.state.productId);
      setName(locationData.state.name);
      setAltNames(locationData.state.altNames.join(","));
      setPrice(locationData.state.price);
      setLabeledPrice(locationData.state.labeledPrice);
      setStock(locationData.state.stock);
      setDescription(locationData.state.description);
    }
  }, [locationData.state, navigate]);

  // If productId not set yet, don't render form (redirect will happen)
  if (!productId) return null;

  async function handleSubmit() {
    setLoading(true);

    if (!productId || !name || !price || !stock || !description) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      let result = [];
      if (images.length > 0) {
        const promisesArray = Array.from(images).map((file) =>
          MediaUpload(file)
        );
        result = await Promise.all(promisesArray);
      } else {
        result = locationData.state.image;
      }

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

      await axios.put(
        import.meta.env.VITE_BACKEND_URL + "/api/product/" + productId,
        product,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Product not updated");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start p-8">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-md p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Edit Product
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
              Product ID
            </label>
            <input
              id="productId"
              type="text"
              value={productId}
              disabled
              className="w-full rounded-md border border-gray-300 px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
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
                Price ($) <span className="text-red-600">*</span>
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
                Labeled Price ($)
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
              disabled={loading}
              className={`flex-1 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-semibold py-3 rounded-md shadow transition`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                "Save"
              )}
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
