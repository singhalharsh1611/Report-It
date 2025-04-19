import React, { useContext, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PenSquare, Activity, Map, BarChart3, ArrowRight } from 'lucide-react';
import AuthContext from '@/contexts/AuthContext';

// const token
const HomePage = () => {
  const { token, user } = useContext(AuthContext);
  // navigate(location.pathname, { replace: true });
  useEffect(() => {
  }, [token]);
  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Top of page */}
      <section className="relative flex flex-col items-center text-center pt-8 md:pt-12">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(var(--primary),0.08),transparent_55%)]" />
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl text-gradient">
          Connecting Citizens with Local Solutions
        </h1>
        <p className="mt-6 text-md md:text-xl text-muted-foreground max-w-2xl">
          Report local civic issues, track their status, and see how your community is improving. 
          CivicConnect helps residents and local governments work together.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
         {/* Redirect to report page */}
          <Link to="/report">
            <Button size="lg" className="gap-2">
              <PenSquare className="h-4 w-4" />
              Report an Issue
            </Button>
          </Link>
          {/* Redirect to issues page */}
          <Link to="/issues">
            <Button size="lg" variant="outline" className="gap-2">
              View Issue Feed
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16 w-full max-w-4xl">
          {[
            { value: "1,234+", label: "Issues Registered" },
            { value: "85%", label: "Resolution Rate" },
            { value: "24hrs", label: "Avg Response Time" },
            { value: "5,000+", label: "Active Citizens" },
          ].map((stat, i) => (
            <div key={i} className="bg-card/50 p-4 rounded-lg border border-white/10">
              <p className="text-2xl md:text-3xl sm:text-xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="glass-card p-6 rounded-xl">
          <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
            <PenSquare className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Report Local Issues</h2>
          <p className="text-muted-foreground mb-4">
            Submit detailed reports about infrastructure problems, public services, 
            safety concerns and more. Include images, location data, and categorize 
            your issues for faster resolution.
          </p>
          {/* Redirect to report page */}
          <Link to="/report">
            <Button variant="link" className="p-0 h-auto flex items-center gap-1 text-primary">
              Report an Issue <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Track Status Updates</h2>
          <p className="text-muted-foreground mb-4">
            Follow the progress of reported issues from submission to resolution.
            Get notified when your reports change status or receive comments from 
            officials or other community members.
          </p>
          {/* Redierct to status page */}
          <Link to="/status">
            <Button variant="link" className="p-0 h-auto flex items-center gap-1 text-primary">
              Track Reports <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
            <Map className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Interactive Map View</h2>
          <p className="text-muted-foreground mb-4">
            Explore issues in your community through an interactive map. Discover 
            problem areas, see clustering of similar issues, and find reports in 
            your neighborhood.
          </p>
          {/* Redirect to map page */}
          <Link to="/map">
            <Button variant="link" className="p-0 h-auto flex items-center gap-1 text-primary">
              View Map <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Analytics Dashboard</h2>
          <p className="text-muted-foreground mb-4">
            Access comprehensive analytics about civic issues in your area. View trends 
            over time, resolution metrics, and insights about the most common 
            problems in your community.
          </p>
          {/* Redirrect to analytics page */}
          <Link to="/analytics">
            <Button variant="link" className="p-0 h-auto flex items-center gap-1 text-primary">
              See Analytics <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-8 flex flex-col items-center text-center">
        <div className="w-full max-w-3xl p-8 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 border border-white/10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Join the Community Improvement Movement</h2>
          <p className="text-muted-foreground mb-6">
            Be part of the solution. Create an account to start reporting issues, 
            tracking updates, and helping make your community better.
          </p>
          {(!token)?
          <Link to="/register">
            <Button size="lg">
              Create Free Account 
            </Button>
          </Link>
          :<></>}
        </div>
      </section>
    </div>
  );
};

export default HomePage;