import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AuthContext from "./AuthContext.js";
import socket from "../socket/socket.js"

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const getCurrentUser = async () => {
    if (!token) return;

    try {
      const response = await axios.get(`${backendUrl}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data);
    } catch (error) {
      console.log("Error fetching user: ", error);
      logout(); //if token is invalid
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        setToken(token);
        setUser(user);
        toast.success("Login sucessful");
        console.log(user.role);
        if(user.role==="moderator"){
          navigate("/moderator/dashboard");
        }
        else{
          navigate("/");
        }
      } else {
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      // console.log("Login error: ", error);
      toast.error(error.response.data.message || "Login Error", error);
    }
  };

  const register = async (data) => {
    try {
      // console.log("l",data);
      const response = await axios.post(`${backendUrl}/api/auth/register`, data);
      if (response.data.success) {
        if (data.role === "moderator") {
          toast.success(response.data.message);
          return { waitingApproval: true };
        }
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
    const fetchUser = async () => {
      if (token) {
        await getCurrentUser();
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "moderator")) {
      socket.connect();
      // console.log("Socket connected");

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      // Optional: Listen to test messages
      // socket.on("new-issue", (data) => {
      //   console.log("New issue received:", data);
      // });

      return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("new-issue");
      socket.disconnect();
      // console.log("Socket disconnected");
    };
    }
  }, [user]);


  return (
    <AuthContext.Provider
      value={{ user, token, login, logout,getCurrentUser, register, loading, setToken, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
