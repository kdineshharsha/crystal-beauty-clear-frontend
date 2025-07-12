import React from "react";

export default function UnderMaintenance() {
  return (
    <div className="h-[calc(100vh-120px)] bg-primary flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Under Maintenance
          </h1>
          <p className="text-gray-600 mb-6">
            We're currently updating our cosmetic collection to serve you
            better. Please check back soon!
          </p>
          <p className="text-sm text-gray-500">Thank you for your patience.</p>
        </div>
      </div>
    </div>
  );
}
