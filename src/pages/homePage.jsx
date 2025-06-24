import React from "react";
import Header from "../components/header";
import { Route, Routes } from "react-router-dom";
import ProductPage from "./client/productPage";
import ProductOverview from "./client/productOverview";
import CartPage from "./client/cart";
import CheckoutPage from "./client/checkout";
import BottomNavbar from "../components/bottomNavbar";
import AdvertisementBanner from "../components/advertisementBanner";
import Trending from "../components/trending";
import MainPage from "./client/mainPage";
import Profile from "./client/profile";
import Order from "./client/order";
import Contact from "./client/contact";
import Wishlist from "./client/wishlist";
import Settings from "./client/settings";
import EditProfile from "./client/edit-profile";
import About from "./client/aboutUs";

export default function HomePage() {
  return (
    <div className="w-full  mb-16 h-full  bg-primary ">
      <Header />

      <div className="w-full  ">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/overview/:id" element={<ProductOverview />} />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/contacts" element={<Contact />} />
          <Route path="/reviews" element={<h1>Reviews</h1>} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings/edit-profile" element={<EditProfile />} />
        </Routes>
      </div>
      <BottomNavbar />
    </div>
  );
}
