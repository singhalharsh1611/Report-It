import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
} from "lucide-react";
import OverviewTab from "@/components/admin/OverviewTab";
import ModeratorTable from "@/components/admin/ModeratorTable";
import IssueReviewTable from "@/components/admin/IssueReviewTable";
import StatisticsTab from "@/components/admin/StatisticsTab";

const AdminDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const [stats, setStats] = useState({
    totalModerators: 12,
    pendingModerators: 3,
    totalIssues: 145,
    completedIssues: 89,
    rejectedIssues: 23,
    pendingIssues: 33,
    lastSync: new Date().toLocaleString(),
  });

  const [moderatorApplications, setModeratorApplications] = useState([
    {
      id: "MOD001",
      name: "Ravi Kumar",
      email: "ravi@example.com",
      phone: "9876543210",
      aadhaarNumber: "123456781234",
      panNumber: "ABCDE1234F",
      address: "123 Main St, Agra",
      qualifications: "B.Tech in Civil Engineering",
      experience: "3 years in municipal operations",
      status: "pending",
    },
    {
      id: "MOD002",
      name: "Sonal Gupta",
      email: "sonal@example.com",
      phone: "9988776655",
      aadhaarNumber: "432143214321",
      panNumber: "XYZPQ9876L",
      address: "22 Park Lane, Delhi",
      qualifications: "M.Tech Urban Planning",
      experience: "5 years in field inspections",
      status: "verified",
    },
  ]);

  const [issues, setIssues] = useState([
    {
      id: "ISSUE001",
      title: "Broken streetlight",
      category: "Infrastructure",
      reporterEmail: "user1@example.com",
      moderatorName: "Ravi Kumar",
      moderatorId: "MOD001",
      moderatorUpdate: "Replaced the bulb and fixed wiring",
      moderatorAction: "completed",
      adminStatus: "pending",
      evidence: "Photo of new bulb",
      updateDate: "2025-07-01",
      priority: "High",
    },
    {
      id: "ISSUE002",
      title: "Garbage accumulation",
      category: "Sanitation",
      reporterEmail: "user2@example.com",
      moderatorName: "Sonal Gupta",
      moderatorId: "MOD002",
      moderatorUpdate: "Cleared the garbage, awaiting pickup confirmation",
      moderatorAction: "in_progress",
      adminStatus: "verified",
      evidence: "Before and after images",
      updateDate: "2025-07-02",
      priority: "Medium",
    },
  ]);

  const handleTabChange = (value) => {
    setSearchParams({ tab: value });
  };

  const handleModeratorAction = (id, action) => {
    setModeratorApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, status: action === "approve" ? "verified" : "rejected" }
          : app
      )
    );
    setStats((prev) => ({
      ...prev,
      pendingModerators: Math.max(0, prev.pendingModerators - 1),
    }));
  };

  const handleIssueStatusChange = (id, status) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, adminStatus: status } : issue
      )
    );

    setStats((prev) => ({
      ...prev,
      pendingIssues: Math.max(0, prev.pendingIssues - 1),
      completedIssues:
        status === "approved" ? prev.completedIssues + 1 : prev.completedIssues,
      rejectedIssues:
        status === "rejected" ? prev.rejectedIssues + 1 : prev.rejectedIssues,
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-600 text-white";
      case "verified":
      case "approved":
        return "bg-green-600 text-white";
      case "rejected":
        return "bg-red-600 text-white";
      case "in_progress":
        return "bg-blue-600 text-white";
      case "completed":
        return "bg-emerald-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-400 font-semibold";
      case "Medium":
        return "text-yellow-400 font-semibold";
      case "Low":
        return "text-green-400 font-semibold";
      default:
        return "text-gray-400";
    }
  };

  const maskAadhaar = (aadhaar) => aadhaar?.replace(/\d(?=\d{4})/g, "*");
  const maskPAN = (pan) => pan?.replace(/^.{0,6}/, "XXXXXX");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1A1F2C" }}>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Manage moderator applications and review issue completions</p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4" style={{ backgroundColor: "#2A2F3C" }}>
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-purple-600">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="moderators" className="text-white data-[state=active]:bg-purple-600">
              <Users className="h-4 w-4 mr-2" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="issues" className="text-white data-[state=active]:bg-purple-600">
              <FileText className="h-4 w-4 mr-2" />
              Issue Reviews
            </TabsTrigger>
            <TabsTrigger value="stats" className="text-white data-[state=active]:bg-purple-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab stats={stats} onNavigate={handleTabChange} />
          </TabsContent>

          <TabsContent value="moderators">
            <ModeratorTable
              moderatorApplications={moderatorApplications}
              handleModeratorAction={handleModeratorAction}
              getStatusColor={getStatusColor}
              maskAadhaar={maskAadhaar}
              maskPAN={maskPAN}
            />
          </TabsContent>

          <TabsContent value="issues">
            <IssueReviewTable
              issues={issues}
              handleIssueStatusChange={handleIssueStatusChange}
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
            />
          </TabsContent>

          <TabsContent value="stats">
            <StatisticsTab stats={stats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;


