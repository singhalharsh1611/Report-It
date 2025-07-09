import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const ProtectedAdminRoute = ({ children }) => {
  const { adminToken, loading } = useAdminAuth();

  if (loading) return <div className="text-white p-4">Loading...</div>;

  if (!adminToken) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
