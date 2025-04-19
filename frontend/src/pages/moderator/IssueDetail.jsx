import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  Mail,
  Tag,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Send,
  User
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Mock issue data for demonstration
const MOCK_ISSUES = [
  {
    id: "1",
    title: "Inappropriate content in public forum",
    description: "A user has posted offensive content that violates community guidelines in the tech forum...",
    category: "Content Violation",
    status: "pending",
    reporterEmail: "user1@example.com",
    submissionDate: "2023-04-15T10:30:00Z",
    imageUrl: "https://picsum.photos/seed/issue1/600/400",
    reporterName: "John Smith",
    reporterStatus: "Verified User",
    comments: [
      {
        id: "c1",
        author: "admin",
        text: "Initial review shows this requires immediate attention.",
        timestamp: "2023-04-15T11:15:00Z",
      },
    ],
  },
  {
    id: "2",
    title: "Spam accounts creating multiple posts",
    description: "Multiple bot accounts are flooding the photography section with spam links...",
    category: "Spam",
    status: "verified",
    reporterEmail: "user2@example.com",
    submissionDate: "2023-04-16T09:15:00Z",
    imageUrl: null,
    reporterName: "Alex Johnson",
    reporterStatus: "Moderator",
    comments: [],
  },
  {
    id: "3",
    title: "Harassment of minority users",
    description: "A group of users are systematically harassing minority members in the gaming community...",
    category: "Harassment",
    status: "pending",
    reporterEmail: "user3@example.com",
    submissionDate: "2023-04-17T14:45:00Z",
    imageUrl: "https://picsum.photos/seed/issue3/600/400",
    reporterName: "Sarah Williams",
    reporterStatus: "Trusted User",
    comments: [],
  },
  {
    id: "4",
    title: "False information about COVID-19",
    description: "User spreading misinformation about COVID-19 vaccines in the health forum...",
    category: "Misinformation",
    status: "rejected",
    reporterEmail: "user4@example.com",
    submissionDate: "2023-04-18T11:20:00Z",
    imageUrl: null,
    reporterName: "Michael Brown",
    reporterStatus: "New User",
    comments: [],
  },
  {
    id: "5",
    title: "Copyright infringement in art section",
    description: "User has uploaded copyrighted artwork...",
    category: "Copyright",
    status: "verified",
    reporterEmail: "user5@example.com",
    submissionDate: "2023-04-19T16:05:00Z",
    imageUrl: "https://picsum.photos/seed/issue5/600/400",
    reporterName: "Emily Davis",
    reporterStatus: "Verified User",
    comments: [
      {
        id: "c2",
        author: "legal-team",
        text: "We've verified this is indeed a copyright violation...",
        timestamp: "2023-04-19T17:30:00Z",
      },
    ],
  },
];

const IssueDetail = () => {
  const { issueId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [issue, setIssue] = useState(null);
  const [status, setStatus] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchIssue = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const foundIssue = MOCK_ISSUES.find((i) => i.id === issueId);
        if (foundIssue) {
          setIssue(foundIssue);
          setStatus(foundIssue.status);
          setComments(foundIssue.comments || []);
        } else {
          toast({
            title: "Issue not found",
            description: "The requested issue could not be found.",
            variant: "destructive",
          });
          navigate("/moderator/dashboard");
        }
      } catch (error) {
        console.error("Error fetching issue:", error);
        toast({
          title: "Error",
          description: "Failed to load issue details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (issueId) fetchIssue();
  }, [issueId, navigate, toast]);

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    toast({
      title: "Status updated",
      description: `Issue status changed to ${newStatus}.`,
    });
  };

  const handleCommentSubmit = () => {
    if (!comment.trim()) return;

    const newComment = {
      id: `c${comments.length + 1}`,
      author: "moderator",
      text: comment,
      timestamp: new Date().toISOString(),
    };

    setComments([...comments, newComment]);
    setComment("");

    toast({
      title: "Comment added",
      description: "Your comment has been added to the issue.",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <AlertCircle className="h-5 w-5 text-status-pending" />;
      case "verified":
        return <CheckCircle2 className="h-5 w-5 text-status-verified" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-status-rejected" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const statusColors = {
    pending: "bg-yellow-500/10 text-status-pending border-yellow-500/20",
    verified: "bg-green-500/10 text-status-verified border-green-500/20",
    rejected: "bg-red-500/10 text-status-rejected border-red-500/20",
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" disabled>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Issue Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The issue you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/moderator/dashboard")}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const formattedDate = format(new Date(issue.submissionDate), "PPP");
  const formattedTime = format(new Date(issue.submissionDate), "p");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Link to="/moderator/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <Badge className={cn("ml-2", statusColors[status])}>
          {getStatusIcon(status)}
          <span className="ml-1">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </Badge>
      </div>

      <Card className="border-border/40">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{issue.title}</CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{formattedDate} at {formattedTime}</span>
            </div>
            <div className="flex items-center">
              <Tag className="mr-1 h-4 w-4" />
              <span>{issue.category}</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Issue Description</h3>
            <p className="text-foreground/90 whitespace-pre-line">{issue.description}</p>

            {issue.imageUrl && (
              <div className="mt-4 rounded-md overflow-hidden border border-border">
                <img
                  src={issue.imageUrl}
                  alt={`Evidence for issue ${issue.id}`}
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
            )}
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="text-lg font-medium">Reporter Information</h3>
            <div className="bg-secondary/30 rounded-lg p-4 flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center">
                  <p className="font-medium">{issue.reporterName}</p>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {issue.reporterStatus}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Mail className="mr-1 h-3 w-3" />
                  {issue.reporterEmail}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Comments & Notes</h3>
              <span className="text-sm text-muted-foreground">
                {comments.length} {comments.length === 1 ? "comment" : "comments"}
              </span>
            </div>

            {comments.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>No comments yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="bg-secondary/30 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium capitalize">{c.author}</p>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(c.timestamp), "PPp")}
                      </span>
                    </div>
                    <p className="text-foreground/90">{c.text}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <Textarea
                placeholder="Add a comment or note about this issue..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end">
                <Button onClick={handleCommentSubmit} disabled={!comment.trim()}>
                  <Send className="mr-2 h-4 w-4" />
                  Add Comment
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between pt-6 border-t">
          <div className="w-full sm:w-auto">
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Update status" />
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
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" onClick={() => navigate(-1)} className="flex-1 sm:flex-none">
              Cancel
            </Button>
            <Button className="flex-1 sm:flex-none">Save Changes</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default IssueDetail;
