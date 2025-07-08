const OrderSkeleton = () => {
  const skeletonCards = Array.from({ length: 4 });

  return (
    <div className="p-6">
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {skeletonCards.map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 animate-pulse"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 space-y-4">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-4 w-32 bg-gray-300 rounded" />
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-5 w-28 bg-gray-300 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                  <div className="h-4 w-24 bg-gray-300 rounded" />
                </div>
              </div>
            </div>

            {/* Items Preview */}
            <div className="p-6 space-y-3">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              {[...Array(2)].map((_, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 rounded" />
                    <div className="h-3 w-1/2 bg-gray-300 rounded" />
                  </div>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="px-6 pb-6 flex gap-3">
              <div className="h-10 w-full bg-gray-200 rounded-xl" />
              <div className="h-10 w-10 bg-gray-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderSkeleton;
