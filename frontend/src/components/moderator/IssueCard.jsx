import { useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { 
  ArrowUpRight,
  Calendar,
  ChevronDown,
  ChevronRight,
  Mail,
  Tag,
  Image as ImageIcon
} from "lucide-react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const IssueCard = ({ issue, onStatusChange, isCompact = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const formattedDate = format(new Date(issue.submissionDate), 'MMM d, yyyy');

  const statusColors = {
    pending: "bg-yellow-500/10 text-status-pending border-yellow-500/20",
    verified: "bg-green-500/10 text-status-verified border-green-500/20",
    rejected: "bg-red-500/10 text-status-rejected border-red-500/20",
  };

  return (
    <Card className={cn(
      "border-border/40 transition-all hover:shadow-md",
      issue.status === "pending" && "border-l-4 border-l-status-pending"
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {issue.title}
            </CardTitle>
            {!isCompact && (
              <CardDescription className="line-clamp-1">
                {issue.description}
              </CardDescription>
            )}
          </div>
          <Badge className={cn("ml-2", statusColors[issue.status])}>
            {issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className={cn(isCompact ? "pb-2" : "pb-4")}>
        {isCompact ? (
          <div className="flex items-center text-sm text-muted-foreground space-x-4">
            <div className="flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
            <Badge variant="outline">{issue.category}</Badge>
          </div>
        ) : (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
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
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              <p className="text-sm mt-2">
                {issue.description}
              </p>
              {issue.imageUrl && (
                <div className="mt-2 rounded-md overflow-hidden border border-border">
                  <img 
                    src={issue.imageUrl} 
                    alt={`Evidence for issue ${issue.id}`} 
                    className="w-full h-auto max-h-64 object-cover"
                  />
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-0">
        <div className={cn(
          "flex items-center gap-2", 
          isCompact ? "w-full justify-between" : "w-auto"
        )}>
          <Select
            defaultValue={issue.status}
            onValueChange={(value) => onStatusChange(issue.id, value)}
          >
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Set status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Link to={`/moderator/issues/${issue.id}`}>
            <Button variant="ghost" size="sm" className="h-8">
              <span className="mr-1">{isCompact ? "View" : "Details"}</span>
              <ArrowUpRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default IssueCard;
