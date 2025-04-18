import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Menu, Search, User, LogIn, UserPlus, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import AuthContext from "@/contexts/AuthContext";

const Navbar = ({ toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token")); //check status using token from local storage
  const {logout}=useContext(AuthContext);
  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  if (isAuthPage) return null;
  

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-card to-card/70 backdrop-blur-md border-b border-white/5">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center">
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link to="/" className="flex items-center">
            <div className="relative flex items-center">
              <div className="h-8 w-8 flex items-center justify-center rounded-md bg-primary text-primary-foreground mr-2">
                <span className="font-bold text-lg">R</span>
              </div>
              <h1 className="text-xl font-bold text-gradient">ReportIt</h1>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex max-w-md w-full mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search issues..."
              className="w-full pl-10 pr-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full"></span>
          </Button>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                </Link>

                <Link to="/register">
                  <Button variant="outline" size="sm" className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Register</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
