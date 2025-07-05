import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../../components/productCard";
import ProductSkeleton from "../../components/productSkeletion";

function ProductPage() {
  const [productList, setProductList] = useState([]);
  const [productLoaded, setProductLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );

  // Sample categories - replace with your actual categories
  const categoryList = [
    { id: "all", name: "All Categories", icon: "🌟" },
    { id: "nail", name: "Nails", icon: "💅" },
    { id: "lips", name: "Lips", icon: "💄" },
    { id: "skincare", name: "Skincare", icon: "🧴" },
    { id: "fragrance", name: "Fragrance", icon: "💇" },
    { id: "eye", name: "Eye", icon: "👀" },
  ];

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategory(category);
    }
    fetchProducts();
  }, [searchParams]);

  function fetchProducts() {
    setProductLoaded(false);
    const category = searchParams.get("category");

    let url = import.meta.env.VITE_BACKEND_URL + "/api/product/";

    // Add category parameter if it exists and is not "all"
    if (category) {
      url += `?category=${category}`;
    }

    axios
      .get(url)
      .then((res) => {
        setProductList(res.data);
        setProductLoaded(true);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        setProductLoaded(true);
      });
  }

  function searchProduct() {
    if (search.length > 0) {
      setProductLoaded(false);
      const category = searchParams.get("category");
      let url =
        import.meta.env.VITE_BACKEND_URL + "/api/product/search/" + search;

      // Add category parameter to search if it exists
      if (category && category !== "all") {
        url += `?category=${category}`;
      }

      axios
        .get(url)
        .then((res) => {
          setProductList(res.data.products);
          setProductLoaded(true);
        })
        .catch((err) => {
          console.log(err);
          setProductLoaded(true);
        });
    }
  }

  function handleCategoryChange(categoryId) {
    setSelectedCategory(categoryId);
    setSearch(""); // Clear search when changing category

    if (categoryId === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId });
    }
  }

  function resetProducts() {
    setSearch("");
    setSelectedCategory("all");
    setSearchParams({});
    fetchProducts();
  }

  // Handle search on Enter key
  function handleKeyPress(e) {
    if (e.key === "Enter") {
      searchProduct();
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="w-full mx-auto md:p-8 p-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Our Products
          </h1>
          <p className="text-gray-600">
            Discover our amazing collection of beauty products
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {categoryList.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-103 flex items-center gap-2 shadow-md ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30"
                    : "bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600 hover:shadow-lg"
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="relative w-full md:w-1/2">
              <input
                value={search}
                type="text"
                placeholder="Search for products..."
                className="w-full h-12 rounded-full px-6 border-2 border-gray-200 focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300 text-gray-700 shadow-md"
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full px-8 py-3 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-103 shadow-lg shadow-pink-500/30 font-medium"
                onClick={searchProduct}
              >
                Search
              </button>
              <button
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full px-8 py-3 hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-103 shadow-lg font-medium"
                onClick={resetProducts}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Active filters display */}
          {(selectedCategory !== "all" || search) && (
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                  Category:{" "}
                  {categoryList.find((c) => c.id === selectedCategory)?.name}
                  <button
                    onClick={() => handleCategoryChange("all")}
                    className="ml-2 text-pink-600 hover:text-pink-800"
                  >
                    ✕
                  </button>
                </span>
              )}
              {search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  Search: "{search}"
                  <button
                    onClick={() => setSearch("")}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Products Grid */}
        {productLoaded ? (
          <>
            {productList.length > 0 ? (
              <div className="grid grid-cols-2   lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {productList.map((product, index) => (
                  <div
                    key={index}
                    className="transform  transition-transform duration-300"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-600 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search or browse different categories
                </p>
                <button
                  onClick={resetProducts}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full px-8 py-3 hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-103 shadow-lg shadow-pink-500/30 font-medium"
                >
                  View All Products
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-2  lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductPage;
