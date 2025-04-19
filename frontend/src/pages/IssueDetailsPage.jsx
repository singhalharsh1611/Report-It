import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import AuthContext from "@/contexts/AuthContext";
import { toast } from "sonner";

// import { AuthContext } from "@/contexts/AuthContext"; // adjust path based on your app

const backend = import.meta.env.VITE_BACKEND_URL;

const IssueDetailsPage = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchIssueDetails = async () => {
    try {
      const res = await axios.get(`${backend}/issue/${id}`);
      if (res.data.success) {
        setIssue(res.data.issue);
      } else {
        console.error(res.data.message || "Failed to fetch issue");
      }
    } catch (err) {
      console.error("Error fetching issue details:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${backend}/issue/${id}/comments`);
      if (res.data.success) {
        console.log(res.data.comments);
        setComments(res.data.comments);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if(token===null){
        toast.error("plz login first");
        navigate("/login");
    }
    setSubmitting(true);
    try {
      const res = await axios.post(
        `${backend}/issue/${id}/comments`,
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

  useEffect(() => {
    fetchIssueDetails();
    fetchComments();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-96 w-full mb-4" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!issue) return <p className="text-center text-red-500">Issue not found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{issue.title}</h1>
      <p className="text-muted-foreground">{issue.location?.address}</p>

      <img
        src={issue.imageURL?.[0]}
        alt={issue.title}
        className="w-full max-h-96 object-cover rounded-xl"
      />

      <p className="text-lg">{issue.description}</p>

      <div className="flex flex-wrap gap-4 mt-4">
        <StatusBadge status={issue.status} />
        <Badge className="text-base px-4 py-2">{issue.category}</Badge>
        <Badge variant="outline" className="text-base px-4 py-2">
          Reported: {new Date(issue.createdAt).toLocaleString()}
        </Badge>
        <Badge variant="secondary" className="text-base px-4 py-2">
          Upvotes: {issue.upvotes}
        </Badge>
        <Badge variant="secondary" className="text-base px-4 py-2">
          Comments: {comments.length}
        </Badge>
      </div>

      {/* Comments Section */}
      <Card>
        <CardContent className="p-4 space-y-6">
          <h2 className="text-xl font-semibold">Comments</h2>

          {/* Add Comment Form */}
          <div className="space-y-2">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleAddComment} disabled={submitting}>
              {submitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>

          {/* Comment List */}
          {commentsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-muted-foreground">No comments yet.</p>
          ) : (
            <div className="space-y-3">
  {comments.map((comment) => (
    <div
      key={comment._id}
      className="p-4 border rounded-md bg-muted"
    >
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium">{comment.user.name}</p>
        <p className="text-sm text-muted-foreground">
          {new Date(comment.createdAt).toLocaleString()}{" "}
          <span className="ml-2 text-xs text-muted-foreground">
            ({comment.user.role})
          </span>
        </p>
      </div>
      <p className="text-base">{comment.content}</p>
    </div>
  ))}
</div>

          )}
          {/* Add Comment Box */}


        </CardContent>
        
      </Card>
    </div>
  );
};

export default IssueDetailsPage;
