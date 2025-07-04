import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

import { Eye, CheckCircle, X } from "lucide-react";


const IssueReviewTable = ({
  issues,
  handleIssueStatusChange,
  getStatusColor,
  getPriorityColor
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow style={{ borderColor: "#3A3F4C" }}>
          <TableHead className="text-gray-300">Issue</TableHead>
          <TableHead className="text-gray-300">Moderator</TableHead>
          <TableHead className="text-gray-300">Update</TableHead>
          <TableHead className="text-gray-300">Action</TableHead>
          <TableHead className="text-gray-300">Status</TableHead>
          <TableHead className="text-gray-300">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.map((issue) => (
          <TableRow key={issue.id} style={{ borderColor: "#3A3F4C" }}>
            <TableCell className="text-white font-medium">
              <div className="space-y-1">
                <div>{issue.title}</div>
                <div className="text-sm text-gray-400">{issue.category}</div>
              </div>
            </TableCell>
            <TableCell className="text-gray-300">
              <div className="space-y-1">
                <div>{issue.moderatorName}</div>
                <div className="text-sm text-gray-400">{issue.moderatorId}</div>
              </div>
            </TableCell>
            <TableCell className="text-gray-300 max-w-xs">
              <div className="truncate">{issue.moderatorUpdate}</div>
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(issue.moderatorAction)}>
                {issue.moderatorAction.replace("_", " ")}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(issue.adminStatus)}>
                {issue.adminStatus}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                {issue.adminStatus === "pending" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleIssueStatusChange(issue.id, "approved")}
                      style={{ backgroundColor: "#10B981" }}
                      title="Approve completion"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleIssueStatusChange(issue.id, "rejected")}
                      style={{ backgroundColor: "#EF4444" }}
                      title="Needs more work"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      style={{ borderColor: "#3A3F4C", color: "#9b87f5" }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    style={{ backgroundColor: "#2A2F3C", borderColor: "#3A3F4C" }}
                  >
                    <DialogHeader>
                      <DialogTitle className="text-white">{issue.title}</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Detailed issue update review
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300">
                          Original Reporter:
                        </label>
                        <p className="text-white">{issue.reporterEmail}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">
                          Category:
                        </label>
                        <p className="text-white">{issue.category}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">
                          Moderator:
                        </label>
                        <p className="text-white">
                          {issue.moderatorName} ({issue.moderatorId})
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">
                          Moderator Update:
                        </label>
                        <p className="text-white">{issue.moderatorUpdate}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">
                          Evidence:
                        </label>
                        <p className="text-white">{issue.evidence}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">
                          Update Date:
                        </label>
                        <p className="text-white">{issue.updateDate}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">
                          Priority:
                        </label>
                        <p className={getPriorityColor(issue.priority)}>{issue.priority}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default IssueReviewTable;
