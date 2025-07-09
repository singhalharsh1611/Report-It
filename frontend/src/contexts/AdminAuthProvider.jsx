import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminAuthContext from "./AdminAuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAdmin = async () => {
    if (!adminToken) return;

    try {
      const res = await axios.get(`${backendUrl}/api/admin/me`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setAdmin(res.data.user);
    } catch (err) {
      console.error("Admin auth error", err);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    setAdmin(null);
    setAdminToken(null);
    navigate("/admin");
  };

  useEffect(() => {
    if (adminToken) {
      fetchAdmin();
    }
    setLoading(false);
  }, [adminToken]);

  return (
    <AdminAuthContext.Provider
      value={{ admin, adminToken, setAdmin, setAdminToken, logout, loading }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthProvider;
