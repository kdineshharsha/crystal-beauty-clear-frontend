import React from "react";

export default function RatingSummary({ reviews = [] }) {
  const total = reviews.length;

  // Calculate average
  const average =
    total === 0
      ? 0
      : (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(2);

  // Count each star rating
  const counts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length
  );

  return (
    <div className="w-full lg:max-w-sm bg-white sm:p-8 p-6 rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text mb-2">
          {average}
        </div>
        <div className="text-orange-500 mb-3 text-3xl tracking-wide">
          {"★".repeat(Math.round(average)) +
            "☆".repeat(5 - Math.round(average))}
        </div>
        <p className="text-sm text-gray-600 font-medium">
          Based on{" "}
          <span className="font-semibold text-gray-800">
            {total.toLocaleString()}
          </span>{" "}
          reviews
        </p>
      </div>

      {/* Star bars */}
      <div className="space-y-3 mb-4">
        {counts.map((count, index) => {
          const star = 5 - index;
          const percent = total ? (count / total) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-3">
              <span className="text-sm font-medium w-4 text-gray-700">
                {star}
              </span>
              <span className="text-orange-500 text-lg">★</span>
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 w-12 text-right font-medium">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
