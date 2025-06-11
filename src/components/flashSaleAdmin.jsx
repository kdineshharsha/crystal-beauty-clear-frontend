import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function FlashSaleAdmin() {
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/product")
        .then((res) => {
          setProducts(res.data);
          setLoaded(true);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to load products");
        });
    }
  }, [loaded]);

  const toggleFlashSale = async (productId, currentStatus) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You're not logged in");
      return;
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/${productId}`,
        { flashSale: !currentStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Flash Sale status updated");
      setLoaded(false); // Reload the product list
    } catch (error) {
      console.error(error);
      toast.error("Failed to update Flash Sale status");
    }
  };

  return (
    <div className="p-4 max-w-screen-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6">Flash Sale Manager</h2>
      {loaded ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
            <thead className="bg-gray-100 text-left text-gray-600">
              <tr>
                <th className="p-3 border-b">Product</th>
                <th className="p-3 border-b">Price</th>
                <th className="p-3 border-b">Flash Sale</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image?.[0]}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td className="p-3 border-b">₹{product.price}</td>
                  <td className="p-3 border-b">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={product.flashSale}
                        onChange={() =>
                          toggleFlashSale(product._id, product.flashSale)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full peer transition-all duration-300"></div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-gray-500">Loading products...</div>
      )}
    </div>
  );
}
