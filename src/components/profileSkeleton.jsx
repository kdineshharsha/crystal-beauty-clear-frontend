import React from "react";

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-secondary rounded-b-3xl px-6 py-8 text-white ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/30" />
            <div>
              <div className="h-4 w-24 bg-white/50 rounded mb-2" />
              <div className="h-4 w-20 bg-primary/80 rounded-full" />
            </div>
          </div>
          <div className="w-6 h-6 bg-white/30 rounded-full" />
        </div>

        {/* Stats Skeleton */}
        <div className="flex justify-around mt-6 text-center">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="h-4 w-6 bg-white/40 rounded mb-1 mx-auto" />
              <div className="h-3 w-12 bg-white/30 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* My Orders Skeleton */}
      <div className="bg-white rounded-lg p-4 shadow-md mt-6 mx-4">
        <div className="flex justify-between items-center mb-4">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-14 bg-accent/30 rounded" />
        </div>
        <div className="grid grid-cols-5 gap-2 text-center text-sm">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 bg-accent/30 rounded-full" />
              <div className="h-3 w-12 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Services Skeleton */}
      <div className="bg-white rounded-lg p-4 shadow-md mt-4 mx-4 mb-6">
        <div className="h-4 w-20 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-4 gap-4 text-center text-sm">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 bg-accent/30 rounded-full" />
              <div className="h-3 w-12 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
