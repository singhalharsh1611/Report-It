import { useState, useEffect, useContext } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Users, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import AuthContext, { useAuth } from "@/contexts/AuthContext";

const ModeratorLayout = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const{user, loading, logout} = useContext(AuthContext);
  const [moderatorName, setModeratorName] = useState("harsh");

useEffect(() => {
  if (!loading && user) {
    console.log(user.name);
    setModeratorName(user.name);
  }
}, [user, loading]);

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = true;
      if (!isAuthenticated) {
        toast({
          title: "Authentication required",
          description: "Please log in to access the moderator dashboard",
          variant: "destructive",
        });
        navigate("/auth/login");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/moderator/dashboard?tab=overview",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Issues",
      path: "/moderator/dashboard?tab=issues",
      icon: <ShieldAlert className="h-5 w-5" />,
    },
    
    {
      name: "Notifications",
      path: "/moderator/dashboard?tab=notifications",
      icon: <Bell className="h-5 w-5" />,
    },
    
  ];

  const closeMobileMenu = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background text-foreground">
      {/* Mobile Header */}
      <div className="md:hidden bg-sidebar border-b border-sidebar-border flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">ReportIt</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-0 z-50 md:relative
          md:flex flex-col w-64 border-r border-sidebar-border 
          bg-sidebar text-sidebar-foreground md:h-screen
          transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'flex' : 'hidden'}
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center space-x-2 h-16">
          <ShieldAlert className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">ReportIt Mod Center</span>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto" 
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <Separator className="bg-sidebar-border" />
        
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
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                  }
                `}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </ScrollArea>
        
        {/* Sidebar Footer */}
        <div className="border-t border-sidebar-border p-4 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-sm font-medium">
                {moderatorName.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{moderatorName}</p>
              <p className="text-xs text-sidebar-foreground/60">Moderator</p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full justify-start text-sidebar-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container max-w-7xl mx-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ModeratorLayout;