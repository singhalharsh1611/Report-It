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
// exapmle data
// const status = [
//     { 
//       id: '1',
//       title: 'Broken Streetlight on SVBH',
//       category: 'Street Light',
//       reportedOn: '2023-04-12',
//       currentStatus: 'open',
//       timeline: [
//         { 
//           status: 'open', 
//           date: '2023-04-12',
//           comment: 'Report received and logged in our system.' 
//         }
//       ]
//     },
//     { 
//       id: '2',
//       title: 'Large Pothole on Teliyarganj Road',
//       category: 'Roads',
//       reportedOn: '2023-04-10',
//       currentStatus: 'in-progress',
//       timeline: [
//         { 
//           status: 'open', 
//           date: '2023-04-10',
//           comment: 'Report received and logged in our system.' 
//         },
//         { 
//           status: 'in-progress', 
//           date: '2023-04-11',
//           comment: 'Repair team dispatched to inspect the pothole.' 
//         }
//       ]
//     },
//     { 
//       id: '3',
//       title: 'Overflowing Trash Bins',
//       category: 'Garbage',
//       reportedOn: '2023-04-08',
//       currentStatus: 'review',
//       timeline: [
//         { 
//           status: 'open', 
//           date: '2023-04-08',
//           comment: 'Report received and logged in our system.' 
//         },
//         { 
//           status: 'in-progress', 
//           date: '2023-04-09',
//           comment: 'Sanitation crew notified to clean the area.' 
//         },
//         { 
//           status: 'review', 
//           date: '2023-04-10',
//           comment: 'Cleanup completed, under review by local authority.' 
//         }
//       ]
//     },
//     { 
//       id: '4',
//       title: 'Fallen Tree',
//       category: 'Others',
//       reportedOn: '2023-04-02',
//       currentStatus: 'resolved',
//       timeline: [
//         { 
//           status: 'open', 
//           date: '2023-04-02',
//           comment: 'Report received and logged in our system.' 
//         },
//         { 
//           status: 'in-progress', 
//           date: '2023-04-03',
//           comment: 'Clearance crew dispatched to the location.' 
//         },
//         { 
//           status: 'review', 
//           date: '2023-04-04',
//           comment: 'Tree removal confirmed. Reviewing safety compliance.' 
//         },
//         { 
//           status: 'resolved', 
//           date: '2023-04-05',
//           comment: 'Issue resolved. Area cleared for public access.' 
//         }
//       ]
//     },
//     { 
//       id: '5',
//       title: 'Malicious Water',
//       category: 'Water',
//       reportedOn: '2023-04-01',
//       currentStatus: 'in-progress',
//       timeline: [
//         { 
//           status: 'open', 
//           date: '2023-04-01',
//           comment: 'Water quality complaint received.' 
//         },
//         { 
//           status: 'in-progress', 
//           date: '2023-04-03',
//           comment: 'Water samples collected and testing underway.' 
//         }
//       ]
//     }
//   ];


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
      const response = await axios.get(`${backend}/issue`);

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
