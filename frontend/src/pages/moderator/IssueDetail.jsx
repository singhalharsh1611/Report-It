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
  User,
  Loader2,
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
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import axios from "axios";

const IssueDetail = () => {
  const { issueId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  const [issue, setIssue] = useState();
  const [status, setStatus] = useState("");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const backend = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchIssue = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${backend}/api/issue/${issueId}`);
        const foundIssue = response.data.issue;
        // console.log(foundIssue);

        if (foundIssue) {
          setIssue(foundIssue);
          setStatus(foundIssue.status);
          setComments(foundIssue.comments || []);
          await fetchComments();
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

    if (issueId) {
      fetchIssue();
    }
  }, [issueId, navigate, toast]);

  const handleStatusChange = async(newStatus) => {

    // console.log(newStatus);
    setStatus(newStatus);

    try {
      await axios.patch(`${backend}/api/issue/${issueId}/status`, {status: newStatus}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

      toast.success("Status Updated");
    } catch (error) {
      toast.error(`Error while updating the status: ${error}`);
    }



    // setStatus(newStatus);
    // toast({
    //   title: "Status updated",
    //   // description: `Issue status changed to ${newStatus}.`,
    // });
  };

  //comments
  const fetchComments = async () => {
    try {
      const res = await axios.get(`${backend}/api/issue/${issueId}/comments`);
      if (res.data.success) {
        // console.log(res.data.comments);
        setComments(res.data.comments);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    if (token === null) {
      toast.error("Please login first");
      navigate("/login");
    }
    setSubmitting(true);
    try {
      const res = await axios.post(
        `${backend}/api/issue/${issueId}/comments`,
        { text: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        // Add new comment to top
        setComments((prev) => [res.data.comment, ...prev]);
        setNewComment("");
        fetchComments();
      } else {
        console.error(res.data.message || "Failed to add comment");
      }
    } catch (err) {
      console.error("Error posting comment:", err);
    } finally {
      setSubmitting(false);
    }
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

  const formattedDate = format(new Date(issue.createdAt), "PPP");
  const formattedTime = format(new Date(issue.createdAt), "p");

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
              <span>
                {formattedDate} at {formattedTime}
              </span>
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
            <p className="text-foreground/90 whitespace-pre-line">
              {issue.description}
            </p>

            {issue.imageURL && (
              <div className="mt-4 rounded-md overflow-hidden border border-border">
                <img
                  src={issue.imageURL}
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
                  <p className="font-medium">{issue.createdBy.name}</p>
                  <Badge variant="outline" className="ml-2 text-xs">
                    {issue.createdBy.role}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center">
                  <Mail className="mr-1 h-3 w-3" />
                  {issue.createdBy.email}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Comments & Notes</h3>
              <span className="text-sm text-muted-foreground">
                {comments.length}{" "}
                {comments.length === 1 ? "comment" : "comments"}
              </span>
            </div>

            {comments.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p>No comments yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {comments.map((c) => (
                  <div
                    key={c._id}
                    className="bg-secondary/30 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium capitalize">{c.user.name}</p>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(c.createdAt), "PPp")}
                      </span>
                    </div>
                    <p className="text-foreground/90">{c.content}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <Textarea
                placeholder="Add a comment or note about this issue..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                disabled={submitting}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleCommentSubmit}
                  disabled={!newComment.trim() || submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Add Comment
                    </>
                  )}
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
                  <SelectItem value="under review">Pending</SelectItem>
                  <SelectItem value="in progress">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1 sm:flex-none"
            >
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
