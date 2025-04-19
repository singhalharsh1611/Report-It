import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    age: "",
    aadhaarNumber: "",
    panNumber: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "panNumber" ? value.toUpperCase() : value,
    }));
  };

  const validateForm = () => {
    const { fullName, email, password, age, aadhaarNumber, panNumber } =
      formData;

    if (fullName.length < 3) {
      toast.error("Full name must be at least 3 characters.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email address.");
      return false;
    }

    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      toast.error(
        "Password must be at least 8 characters with uppercase, lowercase, and a number."
      );
      return false;
    }

    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      toast.error("You must be at least 18 years old.");
      return false;
    }

    if (!/^\d{12}$/.test(aadhaarNumber)) {
      toast.error("Aadhaar number must be 12 digits.");
      return false;
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)) {
      toast.error("Invalid PAN format.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: "moderator",
        aadharCard: formData.aadhaarNumber,
        panCard: formData.panNumber,
      });
      if (result?.waitingApproval) {
        setSubmitted(true);
        return;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-border/40 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Application Submitted
            </CardTitle>
            <CardDescription>
              Thank you for applying to be a ReportIt moderator.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>
              Your application is pending review. You'll receive an email once
              processed.
            </p>
            <p className="text-sm text-muted-foreground">
              Average review time: 1-2 business days
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button onClick={() => navigate("/auth/login")} className="w-full">
              Go to Login
            </Button>
            <div className="text-xs text-muted-foreground text-center w-full">
              <Link to="/" className="hover:underline">
                Return to Home
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="border-border/40 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-2">
              <ShieldCheck className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Become a Moderator
            </CardTitle>
            <CardDescription>
              Apply to be a moderator at ReportIt
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isLoading}
              />

              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />

              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Min. 8 characters with uppercase, lowercase & numbers
              </p>

              <Input
                name="age"
                type="number"
                placeholder="Age"
                min="18"
                max="100"
                value={formData.age}
                onChange={handleChange}
                disabled={isLoading}
              />

              <Input
                name="aadhaarNumber"
                type="text"
                placeholder="Aadhaar Number"
                maxLength={12}
                value={formData.aadhaarNumber}
                onChange={handleChange}
                disabled={isLoading}
              />

              <Input
                name="panNumber"
                type="text"
                placeholder="PAN Number"
                maxLength={10}
                value={formData.panNumber}
                onChange={handleChange}
                disabled={isLoading}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center w-full">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-primary hover:underline">
                Login here
              </Link>
            </div>
            <div className="text-xs text-muted-foreground text-center w-full">
              <Link to="/" className="hover:underline">
                Return to Home
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
