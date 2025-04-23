import React from "react";
import Header from "../components/header";
import { Route, Routes } from "react-router-dom";
import ProductPage from "./client/productPage";
import ProductOverview from "./client/productOverview";

export default function HomePage() {
  return (
    <div className="w-full h-screen max-h-screen ">
      <Header />
      <div className="w-full min-h-calc(100vh - 64px) ">
        <Routes path="/">
          <Route path="/" element={<h1>Home</h1>}></Route>
          <Route path="/products" element={<ProductPage />}></Route>
          <Route path="/overview/:id" element={<ProductOverview />}></Route>
          <Route path="/contacts" element={<h1>Contacts</h1>}></Route>
          <Route path="/reviews" element={<h1>Reviews</h1>}></Route>
        </Routes>
      </div>
    </div>
  );
}
