import React from "react";
import AdPopupModal from "../../components/popup";

export default function About() {
  return (
    <div className="w-full bg-pink-50 min-h-screen text-gray-800">
      <AdPopupModal />
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-pink-100 via-white to-pink-200 py-16 px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-pink-600">
          About Us
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-base sm:text-lg text-gray-600">
          Welcome to{" "}
          <span className="font-semibold text-pink-500">
            Crystal Beauty Clear
          </span>{" "}
          — your destination for pure, radiant beauty 🌸
        </p>
      </div>

      {/* Our Story */}
      <section className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-pink-600 mb-4">
          Our Story
        </h2>
        <p className="text-base leading-relaxed text-gray-700">
          Crystal Beauty Clear was born from a vision — to empower every woman
          to feel confident in her own skin. Our products are crafted with love,
          care, and a touch of magic ✨.
          <br />
          <br />
          From humble beginnings to a growing beauty movement, we stay true to
          our roots: clean ingredients, cruelty-free formulas, and glow-worthy
          results.
        </p>
      </section>

      {/* Our Values */}
      <section className="bg-white py-10 px-6">
        <div className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3 text-center">
          <div className="p-6 bg-pink-100 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-bold text-pink-600 mb-2">
              Clean Beauty
            </h3>
            <p className="text-sm text-gray-600">
              No harsh chemicals, parabens, or sulfates — only love and nature.
            </p>
          </div>
          <div className="p-6 bg-pink-100 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-bold text-pink-600 mb-2">
              Cruelty-Free
            </h3>
            <p className="text-sm text-gray-600">
              We never test on animals, because beauty should be kind 🐰.
            </p>
          </div>
          <div className="p-6 bg-pink-100 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-bold text-pink-600 mb-2">
              Confidence First
            </h3>
            <p className="text-sm text-gray-600">
              We believe beauty starts from within — our products just enhance
              it.
            </p>
          </div>
        </div>
      </section>

      {/* Meet Us */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold text-pink-600 mb-6">
          Meet the Team 💖
        </h2>
        <p className="text-base text-gray-700">
          Our passionate team of skincare lovers, product experts, and dreamers
          are committed to bringing you the very best — because you deserve
          nothing less.
        </p>
      </section>

      {/* Footer CTA */}
      <div className="w-full bg-pink-200 py-10 px-6 text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-pink-700">
          Ready to glow with us?
        </h3>
        <p className="mt-2 text-sm text-gray-700">
          Explore our range and feel the Crystal Beauty difference.
        </p>
        <button className="mt-4 px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full shadow-lg transition">
          Shop Now
        </button>
      </div>
    </div>
  );
}
