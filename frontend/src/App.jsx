import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { Toaster } from "./components/ui/sonner.jsx";
import { Toaster as Sonner } from "./components/ui/sonner";
import RegisterPage from "./pages/RegisterPage.jsx";
import ReportIssuePage from "./pages/ReportIssuePage.jsx";

const App = () => {
  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          {/* don't use layout component */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
