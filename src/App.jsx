import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import AdminPage from "./pages/adminPage";
import { Toaster } from "react-hot-toast";
import Testing from "./pages/testing";
import RegisterPage from "./pages/client/register";
import HomePage from "./pages/homePage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ForgetPassword from "./pages/client/forgetPassword";
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/testing" element={<Testing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset" element={<ForgetPassword />} />
          <Route path="/*" element={<HomePage />} />
          {/* <Route path="*" element={<h1>404 NOT FOUND</h1>} />{" "} */}
          {/* Default route */}
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
