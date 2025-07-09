import { useState, useEffect, useContext } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import AdminAuthContext from "@/contexts/AdminAuthContext";

const AdminLayout = () => {
  const{logout }=useContext(AdminAuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = true;
      if (!isAuthenticated) {
        toast({
          title: "Authentication required",
          description: "Please log in to access the admin dashboard",
          variant: "destructive",
        });
        navigate("/admin/login");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleLogout = () => {
    toast("Logged Out", {
    description: "Admin has been successfully logged out.",
    duration: 5000,
  });
    logout();
    navigate("/admin");
  };

  const navItems = [
    {
      name: "Overview",
      path: "/admin/dashboard?tab=overview",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Moderators",
      path: "/admin/dashboard?tab=moderators",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Issues",
      path: "/admin/dashboard?tab=issues",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Statistics",
      path: "/admin/dashboard?tab=stats",
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ];

  const closeMobileMenu = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row text-white" style={{ backgroundColor: '#1A1F2C' }}>
      {/* Mobile Header */}
      <div className="md:hidden border-b flex items-center justify-between p-4" style={{ backgroundColor: '#2A2F3C', borderColor: '#3A3F4C' }}>
        <div className="flex items-center space-x-2">
          <ShieldAlert className="h-6 w-6" style={{ color: '#9b87f5' }} />
          <span className="font-bold text-lg text-white">ReportIt Admin</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-0 z-50 md:relative
          md:flex flex-col w-64 border-r 
          text-white md:h-screen
          transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'flex' : 'hidden'}
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
        `}
        style={{ backgroundColor: '#2A2F3C', borderColor: '#3A3F4C' }}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center space-x-2 h-16 border-b" style={{ borderColor: '#3A3F4C' }}>
          <ShieldAlert className="h-6 w-6" style={{ color: '#9b87f5' }} />
          <span className="font-bold text-lg text-white">ReportIt Admin</span>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto text-white hover:bg-gray-700" 
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        {/* Navigation Links */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeMobileMenu}
                className={`
                  flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors
                  ${location.pathname + location.search === item.path 
                    ? 'text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }
                `}
                style={location.pathname + location.search === item.path ? { backgroundColor: '#9b87f5' } : {}}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </ScrollArea>
        
        {/* Sidebar Footer */}
        <div className="border-t p-4 space-y-4" style={{ borderColor: '#3A3F4C' }}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#9b87f5' }}>
              <span className="text-sm font-medium text-white">
                {adminName.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{adminName}</p>
              <p className="text-xs" style={{ color: '#8E9196' }}>Administrator</p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full justify-start text-white hover:text-red-400"
            style={{ borderColor: '#3A3F4C', backgroundColor: 'transparent' }}
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1" style={{ backgroundColor: '#1A1F2C' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
