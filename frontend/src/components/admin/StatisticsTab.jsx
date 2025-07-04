import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const StatisticsTab = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card style={{ backgroundColor: '#2A2F3C', borderColor: '#3A3F4C' }}>
        <CardHeader>
          <CardTitle className="text-white">Platform Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-300">Total Moderators:</span>
            <span className="font-bold text-white">{stats.totalModerators}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Pending Applications:</span>
            <span className="font-bold text-white">{stats.pendingModerators}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Total Issues:</span>
            <span className="font-bold text-white">{stats.totalIssues}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Completed Issues:</span>
            <span className="font-bold" style={{ color: '#10B981' }}>{stats.completedIssues}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Rejected Issues:</span>
            <span className="font-bold" style={{ color: '#EF4444' }}>{stats.rejectedIssues}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Pending Reviews:</span>
            <span className="font-bold" style={{ color: '#F59E0B' }}>{stats.pendingIssues}</span>
          </div>
          <div className="pt-4 border-t" style={{ borderColor: '#3A3F4C' }}>
            <div className="text-sm text-gray-400">
              Last Updated: {stats.lastSync}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card style={{ backgroundColor: '#2A2F3C', borderColor: '#3A3F4C' }}>
        <CardHeader>
          <CardTitle className="text-white">Issue Resolution Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Completed</span>
                <span className="text-white">{Math.round((stats.completedIssues / stats.totalIssues) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    backgroundColor: '#10B981',
                    width: `${(stats.completedIssues / stats.totalIssues) * 100}%`
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Rejected</span>
                <span className="text-white">{Math.round((stats.rejectedIssues / stats.totalIssues) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    backgroundColor: '#EF4444',
                    width: `${(stats.rejectedIssues / stats.totalIssues) * 100}%`
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Pending</span>
                <span className="text-white">{Math.round((stats.pendingIssues / stats.totalIssues) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="h-2 rounded-full" 
                  style={{ 
                    backgroundColor: '#F59E0B',
                    width: `${(stats.pendingIssues / stats.totalIssues) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsTab;
