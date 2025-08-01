import React, { useEffect, useRef, useState } from "react";
import Trending from "../../components/trending";
import AdvertisementBanner from "../../components/advertisementBanner";
import WhatsNew from "../../components/whatsNew";
import Footer from "../../components/footer";
import FlashSale from "../../components/flashSale";
import { Link } from "react-router-dom";
import ProductCategory from "../../components/productCategory";
import SocialShowcase from "../../components/socialShowCase";
import AdPopupModal from "../../components/popup";
import FeedbackCarousel from "../../components/feedbackCarousel";

const categories = [
  { id: 1, title: "LIPS", image: "/assets/lips.jpeg" },
  { id: 2, title: "BROWS", image: "/assets/brows.jpeg" },
  { id: 3, title: "TAN", image: "/assets/tan.webp" },
  { id: 4, title: "NAILS", image: "/assets/nails.webp" },
  { id: 5, title: "FACE", image: "/assets/face.jpg" },
];

export default function MainPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const [paused, setPaused] = useState(false);

  // Auto-scroll logic
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [paused]);

  // Scroll to selected item
  useEffect(() => {
    const container = carouselRef.current;
    if (container) {
      const cardWidth = container.scrollWidth / categories.length;
      container.scrollTo({
        left: currentIndex * cardWidth,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);
  return (
    <div className="w-full  bg-primary relative ">
      <AdvertisementBanner />

      <Trending />
      <WhatsNew />
      <FlashSale />
      <SocialShowcase />
      <AdPopupModal />

      {/* <ProductCategory
        title="Lip Collection"
        buttonText="Shop Lips"
        buttonLink="/products?category=lips"
        category="lips"
      /> */}
      <ProductCategory
        title="Nail Collection"
        buttonLink="/products?category=nail"
        category="nail"
      />
      <ProductCategory
        title="Face Collection"
        buttonLink="/products?category=face"
        category="face"
      />

      <ProductCategory
        title="Skin Care Collection"
        buttonLink="/products?category=skin"
        category="skincare"
      />
      <ProductCategory
        title="Eye Collection"
        buttonLink="/products?category=eye"
        category="eye"
      />
      <ProductCategory
        title="Fragreance Collection"
        buttonLink="/products?category=fragrance"
        category="fragrance"
      />

      {/* Shop by category */}
      <div className="w-full bg-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold tracking-wide">
              SHOP BY CATEGORY
            </h2>
          </div>

          <div
            className="flex gap-4 overflow-x-auto scrollbar-hide"
            ref={carouselRef}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {categories.map((item) => (
              <div
                key={item.id}
                className="min-w-[250px] sm:min-w-[280px] md:min-w-[300px] lg:h-[360px] h-[300px] rounded-xl overflow-hidden shadow-lg relative group cursor-pointer flex-shrink-0"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0  bg-black opacity-60 flex items-center justify-center">
                  <h3 className="text-white text-xl font-semibold">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Indicators */}
          <div className="flex justify-center mt-6 gap-2">
            {categories.map((_, index) => (
              <button
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentIndex === index ? "w-8 bg-black" : "w-4 bg-gray-400"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
      <FeedbackCarousel />

      <Footer />
      <div className="fixed md:bottom-6 md:right-6 bottom-20 right-6 z-50 p-2 bg-white rounded-full shadow-lg">
        <Link to="whatsapp://send?phone=+94752552137&text=Hello%20Crystal%20Beauty%20Clear!">
          {" "}
          <img
            src="/whatsapp_logo.png"
            alt=""
            className="size-10 md:size-12 "
          />
        </Link>
      </div>
    </div>
  );
}
