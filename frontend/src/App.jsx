// import React from "react";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Layout from "./components/layout/Layout.jsx";
// import HomePage from "./pages/HomePage.jsx";
// import LoginPage from "./pages/LoginPage.jsx";
// import { Toaster } from "./components/ui/sonner.jsx";
// import { Toaster as Sonner } from "./components/ui/sonner";
// import RegisterPage from "./pages/RegisterPage.jsx";
// import ReportIssuePage from "./pages/ReportIssuePage.jsx";
// import { AuthProvider } from "./contexts/AuthProvider.jsx";
// import GoogleSuccess from "./components/GoogleSuccess.jsx";
// import ForgotPassword from "./pages/ForgotPassword.jsx";
// import IssueFeedPage from "./pages/IssueFeedPage.jsx";
// import MapPage from "./pages/MapPage.jsx";
// import ModeratorLayout from "./components/moderator/ModeratorLayout.jsx";
// import Dashboard from "./pages/moderator/Dashboard.jsx";
// import Index from "./pages/moderator/Index.jsx";
// import IssueDetail from "./pages/moderator/IssueDetail.jsx";
// import Login from "./pages/moderator/Login.jsx";
// import Signup from "./pages/moderator/Signup.jsx";

// const App = () => {
//   return (
//     <>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <AuthProvider>
//           <Routes>
//             <Route path="/moderator" element={<Index />} />
//             {/* use layout component */}
//             <Route
//               path="/"
//               element={
//                 <Layout>
//                   <HomePage />
//                 </Layout>
//               }
//             />
//             <Route
//               path="/report"
//               element={
//                 <Layout>
//                   <ReportIssuePage />
//                 </Layout>
//               }
//             />
//             <Route
//               path="/issues"
//               element={
//                 <Layout>
//                   <IssueFeedPage />
//                 </Layout>
//               }
//             />
//             <Route
//               path="/map"
//               element={
//                 <Layout>
//                   <MapPage />
//                 </Layout>
//               }
//             />
//              <Route
//                path="/status"
//                element={
//                  <Layout>
//                    <StatusTrackingPage />
//                  </Layout>
//                }
//              />
//             <Route path="/moderator" element={<ModeratorLayout />}>
//               <Route path="dashboard" element={<Dashboard />} />
//               <Route path="issues/:issueId" element={<IssueDetail />} />
//             </Route>
//             {/* don't use layout component */}
//             <Route path="/login" element={<LoginPage />} />
//             <Route path="/register" element={<RegisterPage />} />
//             <Route path="/google-success" element={<GoogleSuccess />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             {/* <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="issues/:issueId" element={<IssueDetail />} /> */}
//             <Route path="/auth/login" element={<Login />} />
//             <Route path="/auth/signup" element={<Signup />} />
//           </Routes>
//         </AuthProvider>
//       </BrowserRouter>
//     </>
//   );
// };

// export default App;

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
import IssueFeedPage from "./pages/IssueFeedPage.jsx";
import MapPage from "./pages/MapPage.jsx";
import StatusTrackingPage from "./pages/StatusTrackingPage.jsx";

// Moderator
import Index from "./pages/moderator/Index.jsx";
import ModeratorLayout from "./components/moderator/ModeratorLayout.jsx";
import Dashboard from "./pages/moderator/Dashboard.jsx";
import IssueDetail from "./pages/moderator/IssueDetail.jsx";
import Signup from "./pages/moderator/Signup.jsx";
import Login from "./pages/moderator/Login.jsx";

const App = () => {
  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/moderator" element={<Index />} />
            {/* Public Routes with Layout */}
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
              path="/map"
              element={
                <Layout>
                  <MapPage />
                </Layout>
              }
            />
            <Route
              path="/status"
              element={
                <Layout>
                  <StatusTrackingPage />
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

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/google-success" element={<GoogleSuccess />} />

            {/* Moderator Routes */}

            <Route path="/moderator" element={<ModeratorLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="issues/:issueId" element={<IssueDetail />} />
            </Route>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
