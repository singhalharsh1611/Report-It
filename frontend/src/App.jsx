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

import IssueFeedPage from "./pages/IssueFeedPage.jsx";

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
            <Route
              path="/report"
              element={
                <Layout>
                  <ReportIssuePage />
                </Layout>
              }
            />
            <Route
              path="/issues"
              element={
                <Layout>
                  <IssueFeedPage />
                </Layout>
              }
            />
            {/* don't use layout component */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
