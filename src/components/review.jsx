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
    <div className="w-full p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 mt-10 rounded-2xl shadow-2xl mx-auto pb-20">
      <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Customer Reviews
      </h2>
      <div className="flex flex-col lg:flex-row lg:justify-between gap-8">
        <RatingSummary reviews={reviews} />
        <div className="flex-1">
          {/* Review Form */}
          <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Write a Review
            </h3>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
              rows="5"
              placeholder="Share your thoughts about this product..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <div className="flex items-center justify-between mt-4">
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="p-3 rounded-xl border border-gray-300 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r !== 1 && "s"} {"★".repeat(r)}
                  </option>
                ))}
              </select>
              <button
                onClick={submitReview}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Posting...
                  </span>
                ) : (
                  "Post Review"
                )}
              </button>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-800">
              All Reviews ({reviews.length})
            </h3>
            {reviews.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No reviews yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  Be the first to share your experience!
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {review.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="">
                        <h4 className="font-semibold text-gray-800 text-lg truncate max-w-xs">
                          {review.username.length > 11
                            ? `${review.username.slice(0, 11)}...`
                            : review.username}
                        </h4>

                        <p className="text-xs text-gray-500 inline-block  rounded-full">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-yellow-500 text-xl">
                      {"★".repeat(review.rating) +
                        "☆".repeat(5 - review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {review.text}
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
