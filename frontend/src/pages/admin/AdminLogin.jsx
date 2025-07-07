import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldAlert, LogIn } from "lucide-react";
import axios from "axios";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";
import { toast } from "sonner";


const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState({ email: "", oldPassword: "" });
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/login`, formData, {
      withCredentials: true,
    });

    const data = res.data;

    if (data.user.role === "admin") {
      if(!data.user.hasChangedPassword) {
        setShowChangePassword(true); // toggle the form
        setAdminInfo({
        email: data.user.email,
        oldPassword: formData.password,
    });
        toast.success("Login Successful", {
            description: "Please update your password.",
          });
      }
      else{
          toast.success("Login Successful", {
            description: "Welcome to the Admin Dashboard",
          });
          navigate("/admin/dashboard");
      }
      
    } 
      else {
      toast.error("Access Denied", {
          description: "You are not authorized as admin.",
        });
    }
  } catch (err) {
    toast.error("Login Failed", {
        description: err.response?.data?.message || "Something went wrong",
      });
  } finally {
    setIsLoading(false);
  }
};


 return (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <ShieldAlert className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
        <p className="text-muted-foreground">
          Access the ReportIt Admin Dashboard
        </p>
      </CardHeader>

      <CardContent>
        {showChangePassword ? (
          // Show password change form
          <ChangePasswordForm
            adminInfo={adminInfo}
            onSuccess={() => {
              toast.success("Password updated", {
                description: "Please log in again with the new password.",
                });
              setShowChangePassword(false);          // hide the form
              setFormData({ email: "", password: "" }); // clear login fields
            }}
          />
        ) : (
          // Show login form
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@reportit.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  </div>
);

};

export default AdminLogin;
