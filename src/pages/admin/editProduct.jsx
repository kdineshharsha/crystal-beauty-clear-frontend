import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import MediaUpload from "../../utils/mediaUpload";
import {
  FaEdit,
  FaImage,
  FaTag,
  FaDollarSign,
  FaLayerGroup,
  FaSpinner,
  FaSave,
  FaFileImage,
  FaBarcode,
  FaWarehouse,
} from "react-icons/fa";

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

  async function handleSubmit(e) {
    e.preventDefault();
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
              <FaEdit className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Edit Product</h1>
              <p className="text-purple-100 text-sm">
                Update your product information
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-b-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product ID */}
            <div className="space-y-2">
              <label className=" text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaBarcode className="text-purple-500" />
                Product ID
              </label>
              <input
                type="text"
                value={productId}
                disabled
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed transition-all duration-200"
              />
            </div>

            {/* Product Name */}
            <div className="space-y-2">
              <label className=" text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaTag className="text-purple-500" />
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter product name..."
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value.replace(/\b\w/g, (c) => c.toUpperCase())
                  )
                }
                required
              />
            </div>

            {/* Alternative Names */}
            <div className="space-y-2">
              <label className=" text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaEdit className="text-purple-500" />
                Alternative Names
              </label>
              <input
                type="text"
                placeholder="Comma separated alternative names..."
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200"
                value={altNames}
                onChange={(e) => setAltNames(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Enter different names or variations separated by commas
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Product Description <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Describe your product in detail..."
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200 resize-none"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Price Fields */}
            <div className="space-y-2">
              <label className=" text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaDollarSign className="text-purple-500" />
                Pricing Information
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Actual Price (LKR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Labeled Price (LKR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200"
                    value={labeledPrice}
                    onChange={(e) => setLabeledPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className=" text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaLayerGroup className="text-purple-500" />
                Category
              </label>
              <select
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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

            {/* Stock */}
            <div className="space-y-2">
              <label className=" text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaWarehouse className="text-purple-500" />
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="Enter stock quantity..."
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-200"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className=" text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FaImage className="text-purple-500" />
                Update Product Images
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  id="product-image-input"
                  className="hidden"
                  onChange={(e) => setImages(e.target.files)}
                  multiple
                />
                <label
                  htmlFor="product-image-input"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 transition-colors cursor-pointer group"
                >
                  <div className="flex flex-col items-center">
                    <FaFileImage className="text-3xl text-gray-400 group-hover:text-purple-500 transition-colors mb-2" />
                    <p className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors">
                      Click to upload new images
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {images && images.length > 0
                        ? `${images.length} image(s) selected`
                        : "Leave empty to keep existing images"}
                    </p>
                  </div>
                </label>
              </div>

              {/* Image Preview */}
              {images && images.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className="flex flex-wrap gap-3 max-h-40 overflow-auto">
                    {Array.from(images).map((file, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200 shadow-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="pt-6 flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Updating Product...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Update Product
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
