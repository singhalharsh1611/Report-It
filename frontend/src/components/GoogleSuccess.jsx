import AuthContext from "@/contexts/AuthContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const {token, setToken, setUser, getCurrentUser} = useContext(AuthContext);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      localStorage.setItem("token", token);
      setToken(token);
      getCurrentUser();
      navigate("/");
    } else {
      console.error("No token found");
    }
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default GoogleSuccess;
