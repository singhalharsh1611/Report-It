import React, { useContext, useEffect, useState } from 'react';
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
import AuthContext from '@/contexts/AuthContext';
import { toast } from 'sonner';
const backend = import.meta.env.VITE_BACKEND_URL;

const StatusTrackingPage = () => {
  const [statusTimeline, setStatusTimeline] = useState([]);
  const [showMyIssues, setShowMyIssues] = useState(false);
  const [allIssue, setAllIssue] = useState([])
  const { token, user } = useContext(AuthContext);
  // console.log(user.name ,token);
  const statusStages = [
    "open",
    "under review",
    "in progress",
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
        const processedIssues = response.data.issues.map(issue => ({
          id: issue._id,
          title: issue.title,
          category: issue.category,
          reportedOn: issue.createdAt,
          currentStatus: issue.status,
          timeline: issue.statusHistory,
          createdBy: issue.createdBy?._id,
          createdByUser: issue.createdBy?.name  // make sure _id exists
        }));

        const filtered = showMyIssues
          ? processedIssues.filter(issue => issue.createdBy === user._id)
          : processedIssues;
        setStatusTimeline(filtered);
        setAllIssue(processedIssues);
        // console.log("pro", processedIssues)
        // console.log("hi", filtered);
        // console.log("filter", filtered);
      } else {
        console.error(response.data.message || 'Failed to load issues');
      }
    } catch (err) {
      console.error('Error fetching issues:', err);
    }
  };

  function dateConvertion(event) {
    return new Date(event).toLocaleString('en-US', {
      dateStyle: 'medium', // e.g., "Jun 25, 2025"
      timeStyle: 'short',  // e.g., "5:30 PM"
    })
  }


  useEffect(() => {
    if (user?.name) {
      getIssueFeed();

    }
    else{
      toast.error("please login first");
    }
  }, [user]);

  return (
    <div className="h-screen ">
      <div className="pb-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Status Tracking</h1>
            <p className="text-muted-foreground mt-2">
              Track the progress of your reported issues
            </p>
          </div>
          <Button
            onClick={() => {
              setShowMyIssues(prev => !prev);
              const filtered = !showMyIssues
                ? allIssue.filter(issue => issue.createdBy === user._id)
                : allIssue;
              setStatusTimeline(filtered);
            }}
          >
            {showMyIssues ? 'All Issues' : 'My Issues'}
          </Button>
        </div>


        <div className="space-y-6 w-full">
          {statusTimeline.map((issue) => (
            <Card key={issue.id} className="border border-white/10">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{issue.title} </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">{issue.category}</span>
                      <span>•</span>
                      <span className="text-sm text-muted-foreground">Reported on {dateConvertion(issue.reportedOn)}</span>
                      <span>•</span>
                      <span className="text-sm text-muted-foreground">Reported by {issue.createdByUser}</span>
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
                    <div key={`${event._id}`}
                      className="relative mb-5">
                      {/* Status  */}
                      <div
                        className={`absolute -left-8 w-6 h-6 rounded-full border-4 border-background 
    ${event.status === 'open' ? 'bg-status-open' : ''}
    ${event.status === 'in progress' ? 'bg-status-inProgress' : ''}
    ${event.status === 'under review' ? 'bg-status-underReview' : ''}
    ${event.status === 'resolved' ? 'bg-status-resolved' : ''}
    ${event.status === 'rejected' ? 'bg-status-rejected' : ''}
  `}
                      ></div>


                      <div className="bg-card border border-white/5 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium capitalize">
                            {event.status.replace('-', ' ')}
                          </h4>
                          <span className="text-sm text-muted-foreground">update on : {dateConvertion(event.updatedAt)}<br></br>update by : {event.updatedBy.name} ({event.updatedBy.role})</span>

                        </div>
                        <p className="text-sm text-muted-foreground">{statusComments[event.status]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatusTrackingPage;
