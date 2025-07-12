import React, { useState, useEffect } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  Sparkles,
  Heart,
} from "lucide-react";

const FeedbackCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: "Nuwan Pathirana",
      location: "Colombo, SL",
      rating: 5,
      text: "This product completely transformed my skin! The crystal-clear glow I've achieved is absolutely incredible. I've never felt more confident in my natural beauty.",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      product: "Crystal Glow Serum",
    },
    {
      id: 2,
      name: "Amani Hewage",
      location: "Kandy, SL",
      rating: 5,
      text: "I was skeptical at first, but after just 2 weeks, my friends kept asking what I was using! My skin has never looked this radiant and clear.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      product: "Radiance Boost Kit",
    },
    {
      id: 3,
      name: "Akarsha Perera",
      location: "Galle, SL",
      rating: 5,
      text: "Finally found my holy grail! The results are beyond what I expected. My complexion is smoother, brighter, and absolutely glowing.",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      product: "Crystal Clear Complex",
    },
    {
      id: 4,
      name: "Dushenika Silva",
      location: "Matara, SL",
      rating: 5,
      text: "As someone with sensitive skin, I was worried about trying new products. But this has been gentle yet incredibly effective. My skin barrier feels stronger than ever!",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      product: "Gentle Crystal Cleanser",
    },
    {
      id: 5,
      name: "Emily Johnson",
      location: "New Delhi, IND",
      rating: 5,
      text: "I've tried everything, but nothing compares to this! The way it makes my skin look and feel is absolutely magical. I'm glowing from within!",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      product: "Complete Beauty System",
    },
    {
      id: 6,
      name: "Tharushini Silva",
      location: "Colombo, SL",
      rating: 5,
      text: "This isn't just skincare, it's self-care luxury! Every application feels like a spa treatment, and the results speak for themselves. Pure perfection!",
      image:
        "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
      product: "Luxury Crystal Mask",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, testimonials.length]);

  const StarRating = ({ rating }) => (
    <div className="flex gap-1 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 sm:w-5 sm:h-5 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          } transition-colors duration-200`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 px-4">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Sparkles className="text-pink-500 animate-pulse w-6 h-6 sm:w-7 sm:h-7" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-rose-600 bg-clip-text text-transparent leading-tight">
              Real Results, Real Beauty
            </h2>
            <Sparkles className="text-purple-500 animate-pulse w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover why thousands of women trust Crystal Beauty Clear for their
            skincare journey
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="relative backdrop-blur-xl bg-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 border border-white/30 shadow-2xl overflow-hidden mx-4 sm:mx-6 lg:mx-8"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 hover:bg-white/50 transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <ChevronLeft className="text-gray-700 w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 hover:bg-white/50 transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <ChevronRight className="text-gray-700 w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Testimonial Content */}
          <div className="text-center max-w-4xl mx-auto px-4 sm:px-6">
            <div className="relative overflow-hidden">
              {/* Quote Icon */}
              <Quote className="text-pink-300 mx-auto mb-4 sm:mb-6 opacity-50 transition-all duration-700 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />

              {/* Carousel Track */}
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className="w-full flex-shrink-0 px-2 sm:px-4"
                  >
                    <div
                      className={`transition-all duration-700 transform ${
                        index === currentIndex
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-95"
                      }`}
                    >
                      <div className="mb-4 sm:mb-6">
                        <StarRating rating={testimonial.rating} />
                      </div>

                      <blockquote className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-gray-800 leading-relaxed my-6 sm:my-8 italic px-4 sm:px-0">
                        "{testimonial.text}"
                      </blockquote>

                      {/* Customer Info */}
                      <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="relative">
                              <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover border-4 border-white/50 shadow-lg transition-transform duration-700 hover:scale-110"
                              />
                              <Heart className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-5 h-5 sm:w-6 sm:h-6 fill-pink-500 text-pink-500 animate-pulse" />
                            </div>
                            <div className="text-center sm:text-left">
                              <h4 className="font-semibold text-gray-800 text-base sm:text-lg">
                                {testimonial.name}
                              </h4>
                              <p className="text-gray-600 text-sm">
                                {testimonial.location}
                              </p>
                            </div>
                          </div>

                          <div className="hidden sm:block w-px h-8 md:h-12 bg-gray-300"></div>

                          <div className="text-center">
                            <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wide">
                              Verified Purchase
                            </p>
                            <p className="font-medium text-gray-700 text-sm sm:text-base">
                              {testimonial.product}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6 sm:mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-500 hover:scale-125 ${
                  index === currentIndex
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 scale-125 shadow-lg"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCarousel;
