import {
    ArrowDown,
    ArrowUp,
    CheckCircle2,
    Clock,
    XCircle
  } from "lucide-react";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
  } from "@/components/ui/card";
  
  const StatsSummary = ({ stats }) => {
    const totalIssues = stats.pending + stats.totalReviewed;
  
    const verifiedPercentage = totalIssues
      ? Math.round((stats.verified / totalIssues) * 100)
      : 0;
    const rejectedPercentage = totalIssues
      ? Math.round((stats.rejected / totalIssues) * 100)
      : 0;
    const pendingPercentage = totalIssues
      ? Math.round((stats.pending / totalIssues) * 100)
      : 0;
  
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Reviewed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reviewed</CardTitle>
            <div className="bg-primary/10 p-1 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalReviewed}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalIssues
                ? Math.round((stats.totalReviewed / totalIssues) * 100)
                : 0}
              % of all issues
            </p>
          </CardContent>
        </Card>
  
        {/* Verified Issues */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Issues</CardTitle>
            <div className="bg-green-500/10 p-1 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-status-verified" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.verified}</div>
            <div className="flex items-center text-xs text-green-500 mt-1">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>{verifiedPercentage}%</span>
            </div>
          </CardContent>
        </Card>
  
        {/* Rejected Issues */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected Issues</CardTitle>
            <div className="bg-red-500/10 p-1 rounded-full">
              <XCircle className="h-4 w-4 text-status-rejected" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.rejected}</div>
            <div className="flex items-center text-xs text-red-500 mt-1">
              <ArrowDown className="h-3 w-3 mr-1" />
              <span>{rejectedPercentage}%</span>
            </div>
          </CardContent>
        </Card>
  
        {/* Pending Issues */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <div className="bg-yellow-500/10 p-1 rounded-full">
              <Clock className="h-4 w-4 text-status-pending animate-pulse-status" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pending}</div>
            <div className="flex items-center text-xs text-yellow-500 mt-1">
              <span>{pendingPercentage}% needs review</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  export default StatsSummary;
  