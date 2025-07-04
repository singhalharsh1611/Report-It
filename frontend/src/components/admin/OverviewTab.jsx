import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Clock, CheckCircle, AlertTriangle, FileText } from "lucide-react";

const OverviewTab = ({ stats, handleTabChange }) => {
  return (
    <div className="space-y-6">
      {/* Overview Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card style={{ backgroundColor: '#2A2F3C', borderColor: '#3A3F4C' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Moderators</CardTitle>
            <Users className="h-4 w-4" style={{ color: '#9b87f5' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalModerators}</div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#2A2F3C', borderColor: '#3A3F4C' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Pending Applications</CardTitle>
            <Clock className="h-4 w-4" style={{ color: '#F59E0B' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.pendingModerators}</div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#2A2F3C', borderColor: '#3A3F4C' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Completed Issues</CardTitle>
            <CheckCircle className="h-4 w-4" style={{ color: '#10B981' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.completedIssues}</div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: '#2A2F3C', borderColor: '#3A3F4C' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Pending Reviews</CardTitle>
            <AlertTriangle className="h-4 w-4" style={{ color: '#F59E0B' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.pendingIssues}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card style={{ backgroundColor: '#2A2F3C', borderColor: '#3A3F4C' }}>
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              style={{ backgroundColor: '#9b87f5' }}
              onClick={() => handleTabChange('moderators')}
            >
              <Users className="mr-2 h-4 w-4" />
              Review Applications ({stats.pendingModerators})
            </Button>
            <Button
              className="w-full justify-start"
              style={{ backgroundColor: '#D6BCFA', color: '#1A1F2C' }}
              onClick={() => handleTabChange('issues')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Review Issue Updates ({stats.pendingIssues} pending)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
