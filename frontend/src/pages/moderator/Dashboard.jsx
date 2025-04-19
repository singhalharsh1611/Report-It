import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

import IssueFeed from "@/components/moderator/IssueFeed";
import StatsSummary from "@/components/moderator/StatsSummary";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for issues
const MOCK_ISSUES = [
  {
    id: "1",
    title: "Inappropriate content in public forum",
    description:
      "A user has posted offensive content that violates community guidelines in the tech forum.",
    category: "Content Violation",
    status: "pending",
    reporterEmail: "user1@example.com",
    submissionDate: "2023-04-15T10:30:00Z",
    imageUrl: "https://picsum.photos/seed/issue1/300/200",
  },
  {
    id: "2",
    title: "Spam accounts creating multiple posts",
    description:
      "Multiple bot accounts are flooding the photography section with spam links.",
    category: "Spam",
    status: "verified",
    reporterEmail: "user2@example.com",
    submissionDate: "2023-04-16T09:15:00Z",
    imageUrl: null,
  },
  {
    id: "3",
    title: "Harassment of minority users",
    description:
      "A group of users are systematically harassing minority members in the gaming community.",
    category: "Harassment",
    status: "pending",
    reporterEmail: "user3@example.com",
    submissionDate: "2023-04-17T14:45:00Z",
    imageUrl: "https://picsum.photos/seed/issue3/300/200",
  },
  {
    id: "4",
    title: "False information about COVID-19",
    description:
      "User spreading misinformation about COVID-19 vaccines in the health forum.",
    category: "Misinformation",
    status: "rejected",
    reporterEmail: "user4@example.com",
    submissionDate: "2023-04-18T11:20:00Z",
    imageUrl: null,
  },
  {
    id: "5",
    title: "Copyright infringement in art section",
    description:
      "User has uploaded copyrighted artwork without attribution or permission.",
    category: "Copyright",
    status: "verified",
    reporterEmail: "user5@example.com",
    submissionDate: "2023-04-19T16:05:00Z",
    imageUrl: "https://picsum.photos/seed/issue5/300/200",
  },
];

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
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIssues(MOCK_ISSUES);

        const totalReviewed = MOCK_ISSUES.filter(
          (issue) => issue.status !== "pending"
        ).length;
        const verified = MOCK_ISSUES.filter(
          (issue) => issue.status === "verified"
        ).length;
        const rejected = MOCK_ISSUES.filter(
          (issue) => issue.status === "rejected"
        ).length;
        const pending = MOCK_ISSUES.filter(
          (issue) => issue.status === "pending"
        ).length;

        setStats({
          totalReviewed,
          verified,
          rejected,
          pending,
        });
      } catch (error) {
        console.error("Error fetching issues:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleStatusChange = (issueId, newStatus) => {
    const updatedIssues = issues.map((issue) =>
      issue.id === issueId ? { ...issue, status: newStatus } : issue
    );
    setIssues(updatedIssues);

    const totalReviewed = updatedIssues.filter(
      (issue) => issue.status !== "pending"
    ).length;
    const verified = updatedIssues.filter(
      (issue) => issue.status === "verified"
    ).length;
    const rejected = updatedIssues.filter(
      (issue) => issue.status === "rejected"
    ).length;
    const pending = updatedIssues.filter(
      (issue) => issue.status === "pending"
    ).length;

    setStats({
      totalReviewed,
      verified,
      rejected,
      pending,
    });
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
        <p className="text-3xl font-bold tracking-tight">Summary of All Moderators</p>

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
                    issues={issues.slice(0, 3)}
                    onStatusChange={handleStatusChange}
                    isCompact={true}
                  />
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Pending Reviews</h2>
                  <IssueFeed
                    issues={issues
                      .filter((issue) => issue.status === "pending")
                      .slice(0, 3)}
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

        <TabsContent value="users" className="space-y-4">
          <h2 className="text-xl font-semibold">User Management</h2>
          <p className="text-muted-foreground">
            This section will allow you to manage users, view user reports, and
            take actions on user accounts.
          </p>
          <div className="p-8 text-center border rounded-lg border-dashed">
            <h3 className="text-lg font-medium">User Management Coming Soon</h3>
            <p className="text-sm text-muted-foreground mt-2">
              This feature is currently under development.
            </p>
          </div>
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

        <TabsContent value="settings" className="space-y-4">
          <h2 className="text-xl font-semibold">Moderator Settings</h2>
          <p className="text-muted-foreground">
            Manage your moderator account settings and preferences.
          </p>
          <div className="p-8 text-center border rounded-lg border-dashed">
            <h3 className="text-lg font-medium">Settings Panel Coming Soon</h3>
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
