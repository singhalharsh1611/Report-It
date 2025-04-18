import React from "react";
import Navbar from "./components/layout/Navbar.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { Toaster } from "./components/ui/sonner.jsx";
import { Toaster as Sonner } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/AuthProvider.jsx";

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
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
