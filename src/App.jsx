import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import AdminPage from "./pages/adminPage";
import { Toaster } from "react-hot-toast";
import Testing from "./pages/testing";
import RegisterPage from "./pages/client/register";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/testing" element={<Testing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* <Route path="*" element={<h1>404 NOT FOUND</h1>} />{" "} */}
        {/* Default route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
