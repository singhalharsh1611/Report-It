import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (token) {
      localStorage.setItem("token", token);

      navigate("/");
    } else {
      console.error("No token found");
    }
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default GoogleSuccess;
