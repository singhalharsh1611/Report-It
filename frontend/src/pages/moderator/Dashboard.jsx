import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

import IssueFeed from "@/components/moderator/IssueFeed";
import StatsSummary from "@/components/moderator/StatsSummary";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { toast } from "sonner";

const backend = import.meta.env.VITE_BACKEND_URL; 
const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({
    totalReviewed: 0,
    verified: 0,
    rejected: 0,
    pending: 0,
  });
  const {token, user} = useAuth();
  useEffect(() => {
    if (user===null || !token || user.role!=="moderator") {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const handleTabChange = (value) => {
    setActiveTab(value);
    navigate(
      `/moderator/dashboard${value !== "overview" ? `?tab=${value}` : ""}`,
      {
        replace: true,
      }
    );
  };

  useEffect(() => {
    const fetchIssues = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${backend}/api/issue`);
        const allIssues = response.data.issues;
        const totalReviewed = allIssues.length;
        const verified = allIssues.filter((issue) => issue.status !== "open").length;
        const rejected = allIssues.filter((issue) => issue.status === "rejected").length;
        const pendingIssues = allIssues.filter((issue) => (issue.status === "open" || issue.status==="under review"));
        const pending = pendingIssues.length;
        

        setStats({
          totalReviewed, verified, rejected, pending
        });

        setIssues(allIssues);


      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await axios.patch(
        `${backend}/api/issue/${issueId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedIssues = issues.map((issue) => {
        if (issue._id === issueId) {
          // Return a new issue object with the updated status
          return {
            ...issue,
            status: newStatus,
          };
        }

        // For all other issues, return them as-is
        return issue;
      });

      setIssues(updatedIssues);

      const totalReviewed = updatedIssues.filter(
        (issue) => issue.status !== "open"
      ).length;
      const verified = updatedIssues.filter(
        (issue) => (issue.status === "in progress" || issue.status === "resolved") 
      ).length;
      const rejected = updatedIssues.filter(
        (issue) => issue.status === "rejected"
      ).length;
      const pending = updatedIssues.filter(
        (issue) => (issue.status === "open" || issue.status === "under review")
      ).length;

      setStats({ totalReviewed, verified, rejected, pending });
      
    } catch (error) {
      console.log(error);
      toast.error("Failed to change status");
    }
    


  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Moderator Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage and review reported issues on the ReportIt platform
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>

          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <p className="text-3xl font-bold tracking-tight">
          Summary of All Moderators
        </p>

        <TabsContent value="overview" className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[180px] w-full rounded-lg" />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-[180px] rounded-lg" />
                <Skeleton className="h-[180px] rounded-lg" />
                <Skeleton className="h-[180px] rounded-lg" />
              </div>
            </div>
          ) : (
            <>
              <StatsSummary stats={stats} />
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Recent Issues</h2>
                  <IssueFeed
                    issues={issues.filter((issue) => issue.status !== "open" && issue.status!="under review").slice(0, 6)}
                    onStatusChange={handleStatusChange}
                    isCompact={true}
                  />
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Pending Reviews</h2>
                  <IssueFeed
                    issues={issues
                      .filter((issue) => (issue.status === "open" || issue.status==="under review"))}
                    onStatusChange={handleStatusChange}
                    isCompact={true}
                  />
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <h2 className="text-xl font-semibold">All Reported Issues</h2>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-[100px] w-full rounded-lg" />
              <Skeleton className="h-[100px] w-full rounded-lg" />
              <Skeleton className="h-[100px] w-full rounded-lg" />
            </div>
          ) : (
            <IssueFeed
              issues={issues}
              onStatusChange={handleStatusChange}
              isCompact={false}
            />
          )}
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <h2 className="text-xl font-semibold">Notifications</h2>
          <p className="text-muted-foreground">
            View and manage system notifications and alerts.
          </p>
          <div className="p-8 text-center border rounded-lg border-dashed">
            <h3 className="text-lg font-medium">
              Notifications Center Coming Soon
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              This feature is currently under development.
            </p>
          </div>
        </TabsContent>
        
      </Tabs>
    </div>
  );
};

export default Dashboard;
