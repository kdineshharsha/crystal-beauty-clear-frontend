import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const FlashSaleAdmin = () => {
  const { register, handleSubmit, reset } = useForm();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch all products
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/product")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const onSubmit = async (data) => {
    try {
      const payload = {
        title: data.title,
        saleType: data.saleType,
        discountType: data.discountType,
        discountValue: parseFloat(data.discountValue),
        startDate: data.startDate,
        endDate: data.endDate,
        products: data.products,
      };

      await axios.post("http://localhost:3000/api/sale", payload);
      alert("Sale created successfully!");
      reset();
    } catch (err) {
      console.error(err);
      alert("Failed to create sale");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">Create New Sale</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Sale Type */}
        {/* Sale Type */}
        <div>
          <label className="block font-medium mb-1">Sale Type</label>
          <select
            {...register("saleType", { required: true })}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Select Type --</option>
            <option value="flash">Flash Sale</option>
            <option value="11:11">11:11 Sale</option>
            <option value="weekly">Weekly Sale</option>
          </select>
        </div>

        {/* Discount */}
        <div>
          <label className="block font-medium mb-1">Discount %</label>
          <input
            type="number"
            step="0.1"
            min="1"
            max="99"
            {...register("discountValue", { required: true })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Products */}
        <div>
          <label className="block font-medium mb-1">Products</label>
          <select
            {...register("products", { required: true })}
            multiple
            className="w-full border px-3 py-2 rounded h-32"
          >
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Hold Ctrl/Command to select multiple.
          </p>
        </div>

        {/* Discount */}
        <div>
          <label className="block font-medium mb-1">Discount %</label>
          <input
            type="number"
            step="0.1"
            min="1"
            max="99"
            {...register("discount", { required: true })}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Date Range */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block font-medium mb-1">Start Date</label>
            <input
              type="date"
              {...register("startDate", { required: true })}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div className="w-1/2">
            <label className="block font-medium mb-1">End Date</label>
            <input
              type="date"
              {...register("endDate", { required: true })}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Sale
        </button>
      </form>
    </div>
  );
};

export default FlashSaleAdmin;
