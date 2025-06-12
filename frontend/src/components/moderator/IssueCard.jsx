import { format } from "date-fns";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Calendar,
  Mail,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const IssueCard = ({ issue, onStatusChange }) => {
  const formattedDate = format(new Date(issue.createdAt), "MMM d, yyyy");

  const rawStatus = issue.status;
  let displayStatus = "Pending";
  let statusColor = "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";

  if (rawStatus === "in progress") {
    displayStatus = "Verified";
    statusColor = "bg-green-500/10 text-green-700 border-green-500/20";
  } else if (rawStatus === "rejected") {
    displayStatus = "Rejected";
    statusColor = "bg-red-500/10 text-red-700 border-red-500/20";
  }

  return (
    <Card
      className="border-border/40 transition-all hover:shadow-md border-l-4"
      style={{
        borderLeftColor:
          rawStatus === "under review"
            ? "#eab308"
            : rawStatus === "in progress"
            ? "#22c55e"
            : "#ef4444",
      }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {issue.title}
            </CardTitle>
            <CardDescription className="line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap">
              {issue.description}
            </CardDescription>
          </div>
          <Badge className={cn("ml-2", statusColor)}>
            {displayStatus}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="flex items-center justify-between space-x-4 text-sm text-muted-foreground mb-2">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <Mail className="mr-1 h-3 w-3" />
              <span>{issue.reporterEmail}</span>
            </div>
            <div className="flex items-center">
              <Tag className="mr-1 h-3 w-3" />
              <span>{issue.category}</span>
            </div>
            {issue.imageUrl && (
              <div className="flex items-center text-primary">
                <ImageIcon className="mr-1 h-3 w-3" />
                <span>Has image</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-0">
        <div className="flex items-center gap-2 w-full">
          <Select
            defaultValue={rawStatus}
            onValueChange={(value) => onStatusChange(issue._id, value)}
            
          >
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="under review">Pending</SelectItem>
                <SelectItem value="in progress">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Link to={`/moderator/issues/${issue._id}`} className="ml-auto">
            <Button variant="ghost" size="sm" className="h-8">
              <span className="mr-3">View Details</span>
              <ArrowUpRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default IssueCard;
