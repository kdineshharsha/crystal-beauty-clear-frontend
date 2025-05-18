import React from "react";
import Header from "../components/header";
import { Route, Routes } from "react-router-dom";
import ProductPage from "./client/productPage";
import ProductOverview from "./client/productOverview";
import CartPage from "./client/cart";
import CheckoutPage from "./client/checkout";
import BottomNavbar from "../components/bottomNavbar";

export default function HomePage() {
  return (
    <div className="w-full h-screen max-h-screen bg-primary">
      <Header />
      <div className="w-full h-[calc(100vh-64px)]">
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/overview/:id" element={<ProductOverview />} />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/contacts" element={<h1>Contacts</h1>} />
          <Route path="/reviews" element={<h1>Reviews</h1>} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </div>
      <BottomNavbar />
    </div>
  );
}
