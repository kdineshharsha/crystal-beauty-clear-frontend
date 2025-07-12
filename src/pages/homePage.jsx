import React from "react";
import Header from "../components/header";
import { Route, Routes } from "react-router-dom";
import ProductPage from "./client/productPage";
import ProductOverview from "./client/productOverview";
import CartPage from "./client/cart";
import CheckoutPage from "./client/checkout";
import BottomNavbar from "../components/bottomNavbar";
import MainPage from "./client/mainPage";
import Profile from "./client/profile";
import Order from "./client/order";
import Contact from "./client/contact";
import Wishlist from "./client/wishlist";
import Settings from "./client/settings";
import EditProfile from "./client/edit-profile";
import About from "./client/aboutUs";
import AddressBook from "./client/addressBook";
import EditAddress from "./client/edit-address";
import AddAddress from "./client/addAddress";
import History from "./client/history";
import UnderMaintenance from "./client/underMaintenance";

export default function HomePage() {
  return (
    <div className="w-full  mb-16 md:mb-0 h-full  bg-primary ">
      <Header />

      <div className="w-full  ">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/overview/:id" element={<ProductOverview />} />

          <Route path="/cart" element={<CartPage />} />
          <Route path="/contacts" element={<Contact />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/history" element={<History />} />
          <Route path="/reviews" element={<UnderMaintenance />} />

          <Route path="/address-book" element={<AddressBook />} />
          <Route path="/edit-address" element={<EditAddress />} />
          <Route path="/add-address" element={<AddAddress />} />

          <Route path="/settings/edit-profile" element={<EditProfile />} />
        </Routes>
      </div>
      <BottomNavbar />
    </div>
  );
}
