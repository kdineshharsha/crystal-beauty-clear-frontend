import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import RatingSummary from "./ratingSummury";

export default function Review() {
  const { id: productId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/review/${productId}`)
      .then((res) => setReviews(res.data))
      .catch(() => toast.error("Failed to load reviews"));
  }, [productId]);

  const submitReview = async () => {
    if (!text) return toast.error("Please enter a review");
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/review`,
        {
          productId,
          text,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Review submitted!");
      setReviews((prev) => [res.data.review, ...prev]);
      setText("");
      setRating(5);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error submitting review");
    }
    setLoading(false);
  };

  return (
    <div className="w-full p-6 bg-blue-50 mt-10 rounded-xl shadow-inner  mx-auto pb-20">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Customer Reviews
      </h2>
      <div className="flex flex-col md:flex-row md:justify-between gap-6">
        <RatingSummary reviews={reviews} />
        <div className="flex-1">
          {/* Your existing review form + list here */}
          {/* Review Form */}
          <div className="mb-6">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows="4"
              placeholder="Write your review..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <div className="flex items-center justify-between mt-3">
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="p-2 rounded-md border text-sm text-gray-600"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r !== 1 && "s"}
                  </option>
                ))}
              </select>
              <button
                onClick={submitReview}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                {loading ? "Posting..." : "Post Review"}
              </button>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white p-4 rounded-lg shadow flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-700">
                      {review.username}
                    </h4>
                    <div className="text-yellow-500">
                      {"★".repeat(review.rating) +
                        "☆".repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{review.text}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(review.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
