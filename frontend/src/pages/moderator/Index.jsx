import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight, Sun, Moon } from "lucide-react";
import {ArrowLeft } from "lucide-react";

const Index = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/40 py-6">
        <div className="container max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">ReportIt</span>
          </div>
          <Link to="/">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">back</span>
                  </Button>
                </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="max-w-3xl">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            ReportIt Moderator Control Center
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A powerful dashboard for moderators to review and manage reported issues on the ReportIt platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/login">
              <Button size="lg" className="w-full sm:w-auto">
                Moderator Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth/signup">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Apply to be a Moderator
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Feature Section */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Moderator Responsibilities</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border/40">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Review Reports</h3>
              <p className="text-muted-foreground">
                Efficiently process user-submitted reports with our streamlined review interface.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border/40">
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verify Issues</h3>
              <p className="text-muted-foreground">
                Validate legitimate reports and take appropriate actions to maintain platform safety.
              </p>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border/40">
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reject False Reports</h3>
              <p className="text-muted-foreground">
                Identify and dismiss inaccurate or malicious reports to ensure fair moderation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6">
        <div className="container max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 ReportIt Moderator Dashboard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
