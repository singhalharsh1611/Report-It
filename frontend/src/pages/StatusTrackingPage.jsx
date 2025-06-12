import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import axios from "axios";
const backend = import.meta.env.VITE_BACKEND_URL;

const StatusTrackingPage = () => {
  const [statusTimeline, setStatusTimeline] = useState([]);

  const statusStages = [
    "open",
    "underReview",
    "inProgress",
    "resolved",
    "rejected"
  ];

  const statusComments = {
    "open": "Report received and logged.",
    "under review": "Investigation or action has started.",
    "in progress": "Work completed and under review.",
    "resolved": "Issue resolved successfully.",
    "rejected": "Issue has been reviewed and rejected."
  };

  const getIssueFeed = async () => {
    try {
      const response = await axios.get(`${backend}/api/issue`);

      if (response.data.success) {
        const processedIssues = response.data.issues.map(issue => {
          const timeline = [];
          const reportedDate = issue.createdAt || new Date().toISOString().split("T")[0]; // Use createdAt or current date
          const currentIndex = statusStages.indexOf(issue.status);

          // Add category (if available)
          const category = issue.category || 'Unknown';  // Default to 'Unknown' if not available

          // Generate timeline for each status up to currentStatus
          for (let i = 0; i <= currentIndex; i++) {
            timeline.push({
              status: statusStages[i],
              date: "reportedDate",  // Use the latest date for each status
              comment: statusComments[statusStages[i]]
            });
          }

          return {
            id: issue._id,
            title: issue.title,
            category: category,
            reportedOn: reportedDate,
            currentStatus: issue.status,
            timeline
          };
        });

        setStatusTimeline(processedIssues);
      } else {
        console.error(response.data.message || 'Failed to load issues');
      }
    } catch (err) {
      console.error('Error fetching issues:', err);
    }
  };




  useEffect(() => {
    getIssueFeed();
    console.log(statusTimeline);
  }, []);
  useEffect(() => {
    console.log('Updated statusTimeline:', statusTimeline);
  }, [statusTimeline]);
  return (
    <div className="pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Status Tracking</h1>
        <p className="text-muted-foreground mt-2">
          Track the progress of your reported issues
        </p>
      </div>

      <div className="space-y-6">
        {statusTimeline.map((issue) => (
          <Card key={issue.id} className="border border-white/10">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{issue.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-muted-foreground">{issue.category}</span>
                    <span>•</span>
                    <span className="text-sm text-muted-foreground">Reported on {issue.reportedOn}</span>
                  </div>
                </div>
                <StatusBadge status={issue.currentStatus} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative pl-8 pb-1">
                {/* timeline  */}
                <div className="absolute left-3 top-2 bottom-0 w-0.5 bg-secondary"></div>

                {issue.timeline.map((event, index) => (
                  <div key={`${event.status}-${event.date}`}
                    className="relative mb-5">
                    {/* Status  */}
                    <div
                      className={`absolute -left-8 w-6 h-6 rounded-full border-4 border-background 
    ${event.status === 'open' ? 'bg-status-open' : ''}
    ${event.status === 'inProgress' ? 'bg-status-inProgress' : ''}
    ${event.status === 'underReview' ? 'bg-status-underReview' : ''}
    ${event.status === 'resolved' ? 'bg-status-resolved' : ''}
    ${event.status === 'rejected' ? 'bg-status-rejected' : ''}
  `}
                    ></div>


                    <div className="bg-card border border-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium capitalize">
                          {event.status.replace('-', ' ')}
                        </h4>
                        <span className="text-sm text-muted-foreground">{event.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.comment}</p>
                    </div>
                  </div>
                ))}

                {/*Comment Button */}
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Add Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StatusTrackingPage;
