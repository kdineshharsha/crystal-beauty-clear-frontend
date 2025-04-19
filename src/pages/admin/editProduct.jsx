import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import MediaUpload from "../../utils/mediaUpload";
import Loader from "../../components/loader";

export default function EditProductForm() {
  const locationData = useLocation();
  const navigate = useNavigate();
  console.log(locationData);

  if (locationData.state == null) {
    toast("Product not found");
    window.location.href = "/admin/products";
  }

  // Declare state variables at the top level of the component
  const [productId, setProductId] = useState(locationData.state.productId);
  const [name, setName] = useState(locationData.state.name);
  const [altNames, setAltNames] = useState(
    locationData.state.altNames.join(",")
  );
  const [price, setPrice] = useState(locationData.state.price);
  const [labeledPrice, setLabeledPrice] = useState(
    locationData.state.labeledPrice
  );
  const [stock, setStock] = useState(locationData.state.stock);
  const [description, setDescription] = useState(
    locationData.state.description
  );
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    const promisesArray = [];
    for (let i = 0; i < images.length; i++) {
      const promise = MediaUpload(images[i]);
      promisesArray[i] = promise;
    }
    try {
      let result = await Promise.all(promisesArray);
      if (images.length == 0) {
        result = locationData.state.image;
      }

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
      console.log(err);
      setLoading(false);
      toast.error("Product not updated");
    }
  }

  return (
    <div className="w-full bg-amber-200 flex justify-center">
      <div className="h-full w-100 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md ">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6 text-center">
          Edit Product
        </h2>

        <div className="space-y-4">
          {/* Product ID */}
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
              Product ID
            </label>
            <input
              disabled
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
              {loading ? (
                <div className="flex items-center space-x-2 justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving</span>
                </div>
              ) : (
                "Save"
              )}
            </button>
            <button className="w-1/2 bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
