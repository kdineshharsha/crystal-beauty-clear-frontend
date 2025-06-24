import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function Sales() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    saleType: "Flash Sale",
    discountType: "percentage",
    discountValue: "",
    startDate: "",
    endDate: "",
    selectedProducts: [],
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/product`)
      .then((res) => setProducts(res.data))
      .catch(() => toast.error("Failed to load products"));
  }, []);

  const handleAddProduct = (product) => {
    if (!form.selectedProducts.find((p) => p.product === product._id)) {
      setForm((prev) => ({
        ...prev,
        selectedProducts: [
          ...prev.selectedProducts,
          { product: product._id, customSalePrice: "" },
        ],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: form.title,
        saleType: form.saleType,
        discountType: form.discountType,
        discountValue: parseFloat(form.discountValue),
        startDate: form.startDate,
        endDate: form.endDate,
        products: form.selectedProducts.map((p) => ({
          product: p.product,
          customSalePrice: parseFloat(p.customSalePrice || 0),
        })),
      };
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/sale`, payload);
      toast.success("Sale created successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create sale");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create Sale</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded shadow"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Sale Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <select
            value={form.saleType}
            onChange={(e) => setForm({ ...form, saleType: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option>Flash Sale</option>
            <option>Hot Sale</option>
            <option>11.11 Sale</option>
          </select>
          <select
            value={form.discountType}
            onChange={(e) => setForm({ ...form, discountType: e.target.value })}
            className="border p-2 rounded w-full"
          >
            <option value="percentage">Percentage</option>
            <option value="flat">Flat</option>
          </select>
          <input
            type="number"
            placeholder="Discount Value"
            value={form.discountValue}
            onChange={(e) =>
              setForm({ ...form, discountValue: e.target.value })
            }
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <h3 className="mt-6 font-semibold">Select Products</h3>
        <input
          type="text"
          placeholder="Search product by name..."
          onChange={(e) => {
            const term = e.target.value.toLowerCase();
            setProducts((prev) =>
              prev.map((p) => ({
                ...p,
                hidden: !p.name.toLowerCase().includes(term),
              }))
            );
          }}
          className="border p-2 rounded w-full mb-4"
        />

        <div className="grid sm:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
          {products
            .filter((p) => !p.hidden)
            .map((p) => (
              <div
                key={p._id}
                className="border p-2 flex justify-between items-center rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => handleAddProduct(p)}
              >
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-500">Price: Rs.{p.price}</p>
                </div>
                <button className="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                  Add
                </button>
              </div>
            ))}
        </div>

        {form.selectedProducts.length > 0 && (
          <>
            <h3 className="mt-6 font-semibold">Selected Products</h3>
            <div className="space-y-3">
              {form.selectedProducts.map((p, i) => (
                <div
                  key={i}
                  className="border p-2 rounded flex justify-between items-center"
                >
                  <span>Product ID: {p.product}</span>
                  <input
                    type="number"
                    placeholder="Custom Sale Price"
                    value={p.customSalePrice}
                    onChange={(e) => {
                      const updated = [...form.selectedProducts];
                      updated[i].customSalePrice = e.target.value;
                      setForm({ ...form, selectedProducts: updated });
                    }}
                    className="border p-1 rounded w-40"
                  />
                </div>
              ))}
            </div>
          </>
        )}

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 mt-6 rounded hover:bg-green-700"
        >
          Publish Sale
        </button>
      </form>
    </div>
  );
}
