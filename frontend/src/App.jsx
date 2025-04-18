import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { Toaster } from "./components/ui/sonner.jsx";
import { Toaster as Sonner } from "./components/ui/sonner";
import RegisterPage from "./pages/RegisterPage.jsx";
import ReportIssuePage from "./pages/ReportIssuePage.jsx";
import { AuthProvider } from "./contexts/AuthProvider.jsx";
import GoogleSuccess from "./components/GoogleSuccess.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";

const App = () => {
  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* use layout component */}
            <Route
              path="/"
              element={
                <Layout>
                  <HomePage />
                </Layout>
              }
            />
            {/* don't use layout component */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/google-success" element={<GoogleSuccess />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
