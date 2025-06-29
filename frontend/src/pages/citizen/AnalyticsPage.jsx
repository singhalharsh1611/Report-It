import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useContext } from "react";
import AuthContext from "@/contexts/AuthContext";


const backend = import.meta.env.VITE_BACKEND_URL;


const AnalyticsPage = () => {
  const { user } = useContext(AuthContext);
  const [total, setTotal] = useState(0);
  const [totalResolved, setTotalResolved] = useState(0);
  const [totalRejected, setTotalRejected] = useState(0);
  const [resolution, setResolution] = useState(0);
  const [statusData, setStatusData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await axios.get(`${backend}/api/issue`);
      const issues = res.data.issues;
      const resolvedIssues = issues.filter(
        (issue) => issue.status === "resolved"
      );
      const rejectedIssues = issues.filter(
        (issue) => issue.status === "rejected"
      );
      const pendingIssues = issues.filter(
        (issue) => issue.status === "open" || issue.status === "under review"
      );
      const inProgressIssues = issues.filter(
        (issue) => issue.status === "in progress"
      );

      setTotal(issues.length);
      setTotalResolved(resolvedIssues.length);
      setTotalRejected(rejectedIssues.length);
      const resolution = Math.floor(
        ((totalResolved + totalRejected) * 100) / total
      );
      setResolution(resolution);
      setStatusData([
        { name: "Pending", value: pendingIssues.length },
        { name: "In Progress", value: inProgressIssues.length },
        { name: "Resolved", value: resolvedIssues.length },
        { name: "Rejected", value: rejectedIssues.length },
      ]);

      const categoryMap = {};
      issues.forEach((issue) => {
        const category = issue.category;
        categoryMap[category] = (categoryMap[category] || 0) + 1;
      });

      const categoryArray = Object.entries(categoryMap).map(
        ([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
        })
      );

      setCategoryData(categoryArray);
    };

    fetchAnalytics();
  }, [total, totalRejected, totalResolved]);

  const handleExport = async () => {
    try {
      const res = await axios.get(`${backend}/api/issue`);
      const issues = res.data.issues;
      console.log(issues);
      const userId = user?._id;
      if (!userId) {
        alert("User not found, please login again.");
        return;
      }

      const userIssues = issues.filter((issue) => issue.createdBy._id === userId);

      const headers = [
        "ID",
        "Title",
        "Description",
        "Category",
        "Status",
        "Created At",
        "Updated At",
      ];

      const csvRows = [
        headers.join(","),
        ...userIssues.map((issue) =>
          [
            issue._id,
            `"${issue.title}"`,
            `"${issue.description}"`,
            issue.category,
            issue.status,
            new Date(issue.createdAt).toLocaleString(),
            new Date(issue.updatedAt).toLocaleString(),
          ].join(",")
        ),
      ];

      const csvContent = csvRows.join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "my_issues.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting CSV", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      <p className="text-muted-foreground mt-2">
        Analysis of the reported issues
      </p>

      {/* boxes analytics */}
      <div className="pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4 md:gap-8 mt-16 w-full">
          <div className="bg-card/50 p-4 rounded-lg border border-white/10 px-8 text-center">
            <p className="text-2xl md:text-3xl sm:text-xl font-bold text-primary">
              {total}
            </p>
            <p className="text-sm text-muted-foreground">
              Total Issues Reported
            </p>
          </div>
          <div className="bg-card/50 p-4 rounded-lg border border-white/10 px-8 text-center">
            <p className="text-2xl md:text-3xl sm:text-xl font-bold text-primary">
              {totalResolved}
            </p>
            <p className="text-sm text-muted-foreground">
              Total Issues Resolved
            </p>
          </div>
          <div className="bg-card/50 p-4 rounded-lg border border-white/10 px-8 text-center">
            <p className="text-2xl md:text-3xl sm:text-xl font-bold text-primary">
              {totalRejected}
            </p>
            <p className="text-sm text-muted-foreground">
              Total Issues Rejected
            </p>
          </div>
          <div className="bg-card/50 p-4 rounded-lg border border-white/10 px-8 text-center">
            <p className="text-2xl md:text-3xl sm:text-xl font-bold text-primary">
              {resolution}%
            </p>
            <p className="text-sm text-muted-foreground">Resolution rate</p>
          </div>
        </div>
      </div>

      <Separator />
      {/* pie chart analytics */}

      <div className="pb-8">
        <h2 className="text-2xl pt-5 font-bold">Issue Status Breakdown</h2>
        <div className="flex justify-center flex-col items-center">
          <PieChart width={480} height={480}>
            <Pie
              data={statusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={200}
              stroke="#ffffff"
              strokeWidth={2}

              // label
            >
              {statusData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={["#FF9F40", "#36A2EB", "#4BC0C0", "#FF6384"][index % 4]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
          <p className="opacity-55">
            (Kindly Hover over the chart to see more details)
          </p>
        </div>
      </div>

      <Separator />
      <div className="pb-8">
        <h2 className="text-2xl pt-5 font-bold">Issue Category Distribution</h2>
        <div className="flex justify-center flex-col items-center">
          <BarChart
            width={600}
            height={400}
            data={categoryData}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name">
              <Label
                value="Issue Categories"
                offset={-20}
                position="insideBottom"
                style={{ textAnchor: "middle" }}
              />
            </XAxis>
            <YAxis>
              <Label
                value="No. of issues"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: "middle" }}
              />
            </YAxis>
            <Bar
              dataKey="value"
              fill="#36A2EB"
              barSize={40}
              isAnimationActive={true}
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`bar-cell-${index}`}
                  fill={
                    [
                      "#FF9F40",
                      "#36A2EB",
                      "#4BC0C0",
                      "#FF6384",
                      "#9966FF",
                      "#00C49F",
                      "#FFD700",
                    ][index % 7]
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </div>
      </div>

      <Separator />
      <div className="pb-24">
        <h2 className="text-2xl font-medium pt-5">
          Export your reported issues to a CSV
        </h2>
        <button
          onClick={handleExport}
          className="mt-5 bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/80 transition-colors"
        >
          Download Now
        </button>
      </div>
    </div>
  );
};

export default AnalyticsPage;
