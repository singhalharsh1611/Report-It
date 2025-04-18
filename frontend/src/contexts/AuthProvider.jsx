import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthContext from "./AuthContext.js";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getCurrentUser = async () => {
    if (!token) return;

    try {
      const response = await axios.get(`${backendUrl}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data.user);
    } catch (error) {
      console.log("Error fetching user: ", error);
      logout(); //if token is invalid
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${backendUrl}/auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        setToken(token);
        setUser(user);
        toast.success("Login sucessful");
        navigate("/");
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      // console.log("Login error: ", error);
      toast.error(error.response.data.message || "Login Error", error);
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${backendUrl}/auth/register`, {
        name,
        email,
        password,
      });
      if (response.data.success) {
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        setToken(token);
        setUser(user);
        toast.success("Signup sucessful");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message || "Login Error", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/");
    toast.success("Logged Out Successfully");
  };

  useEffect(() => {
    if (token) {
      getCurrentUser();
    }
    setLoading(false);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout,getCurrentUser, register, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
