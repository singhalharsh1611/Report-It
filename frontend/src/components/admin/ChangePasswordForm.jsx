import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

// console.log("Form rendered");

const ChangePasswordForm = ({ adminInfo, onSuccess }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");



  const handleChangePassword = async (e) => {
    e.preventDefault();
    // console.log("handler called");
    // console.log("Passwords:", newPassword, confirmPassword);
    if (newPassword !== confirmPassword) {
  toast("Password mismatch", {
    description: "Password and Confirm Password do not match.",
    duration: 5000,
  });
  return;
}
    

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/change-password`,
        {
          email: adminInfo.email,
          oldPassword: adminInfo.oldPassword,
          newPassword,
        }
      );

      if (res.data.success) {
        onSuccess(); // call parent
      } else {
        setError(res.data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Server error. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleChangePassword} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
            <Input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          placeholder="Re-enter new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required          
          />
          
        </div>
        
        
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
};

export default ChangePasswordForm;