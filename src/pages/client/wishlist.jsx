import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../components/loader";
import { IoMdHeartDislike } from "react-icons/io";
import ProductCard from "../../components/productCard";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!token) {
        console.warn("No token found. User not logged in.");
        return;
      }

      try {
        console.log("🔄 Fetching wishlist...");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const wishlistItems = res.data;
        console.log("✅ Wishlist product IDs:", wishlistItems);

        const productDetails = await Promise.all(
          wishlistItems.map(async (item) => {
            try {
              const productRes = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/product/${
                  item.productId
                }`
              );

              const product = productRes.data.product;

              return {
                ...product,
                wishlistId: item._id, // Attach wishlist entry ID
              };
            } catch (productErr) {
              console.error(
                `❌ Error fetching product ${item.productId}:`,
                productErr
              );
              return null;
            }
          })
        );

        const validProducts = productDetails.filter((p) => p !== null);
        setWishlist(validProducts);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching wishlist:", err);
        toast.error("Failed to fetch wishlist");
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  const removeFromWishlist = async (wishlistId) => {
    try {
      console.log(`🗑 Removing from wishlist ID: ${wishlistId}`);
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/wishlist/${wishlistId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWishlist((prev) =>
        prev.filter((item) => item.wishlistId !== wishlistId)
      );
      toast.success("Removed from wishlist 💔");
    } catch (err) {
      console.error("❌ Error removing item from wishlist:", err);
      toast.error("Failed to remove item");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 w-full ">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty 😢</p>
      ) : (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-4">
          {wishlist.map((product) => (
            <ProductCard
              key={product.wishlistId}
              product={product}
              wishlistMode={true}
              removeFromWishlist={() => removeFromWishlist(product.wishlistId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
