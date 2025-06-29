import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { IssueCard } from '@/components/issues/IssueCard';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import AuthContext from "@/contexts/AuthContext";
import { toast } from "sonner";


const backend = import.meta.env.VITE_BACKEND_URL;

const IssueDetailsPage = () => {
  const { id } = useParams();
  const [upvoteCount, setUpvoteCount] = useState(0);
  const { token } = useContext(AuthContext)
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [recentIssues, setRecentIssues] = useState([]);

  const fetchRecentIssues = async () => {
    try {
      const res = await axios.get(`${backend}/api/issue`);
      if (res.data.success) {
        setRecentIssues(res.data.issues);
      }
    } catch (err) {
      console.error("Error fetching recent issues:", err);
    }
  };


  const fetchIssueDetails = async () => {
    try {
      const res = await axios.get(`${backend}/api/issue/${id}`);
      if (res.data.success) {
        setIssue(res.data.issue);
        setUpvoteCount(issue?.upvotes?.length || 0);

        const userId = decodedToken(token)?.id; // helper to decode user id from token
        setHasUpvoted(issue?.upvotes?.includes(userId));
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
      const res = await axios.get(`${backend}/api/issue/${id}/comments`);
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
    if (token === null) {
      toast.error("Please login first");
      navigate("/login");
    }
    setSubmitting(true);
    try {
      const res = await axios.post(
        `${backend}/api/issue/${id}/comments`,
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
    fetchRecentIssues();

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
  const submitUpvote = async () => {
    try {
      const res = await axios.patch(
        `${backend}/api/issue/${id}/upvote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        toast.success(res.data.message);
        setUpvoteCount(res.data.upvotesCount); // 👈 update count in state
        setHasUpvoted((prev) => !prev);
      }

    } catch (error) {
      toast.error("Upvote failed");
      console.error(error);
    }
  };
  function decodedToken(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (err) {
      return null;
    }
  }

  // useEffect(() => {
  //  

  //   fetchComments();
  // }, [issue.id, issue.upvotes])

  function dateConvertion(event) {
    return new Date(event).toLocaleString('en-US', {
      dateStyle: 'medium', // e.g., "Jun 25, 2025"
      timeStyle: 'short',  // e.g., "5:30 PM"
    })
  }

  if (!issue) return <p className="text-center text-red-500">Issue not found</p>;

  return (
    <div className="max-w-7xl mx-auto p-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-5">
        <div className="max-w-4xl mx-auto p-2 space-y-6">
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
              Reported: {dateConvertion(issue.createdAt)}
            </Badge>
            <Badge
              onClick={submitUpvote}
              variant="ghost"
              size="sm"
              className={`gap-1 hover:text-primary ${!hasUpvoted ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
            >
              Upvotes: {upvoteCount}
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
                          {dateConvertion(comment.createdAt)}{" "}
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
      </div>
      <div>
  <h2 className="text-2xl font-bold text-white mb-4">Recent Issues</h2>
  
  <div className="space-y-4 border-2 border-double border-primary rounded-xl p-6 bg-muted/40 h-screen overflow-y-auto">
    {recentIssues.map((item) => (
      <div key={item._id} className="transition hover:scale-[1.02] duration-200">
        <IssueCard
          issue={{
            id: item._id,
            title: item.title,
            description: item.description,
            category: item.category,
            status: item.status,
            location: item.location?.address,
            createdAt: item.createdAt,
            upvotes: item.upvotes,
            comments: item.commentsCount || 0,
            imageUrl: item.imageURL?.[0],
          }}
        />
      </div>
    ))}
  </div>
</div>

    </div>
  );
};

export default IssueDetailsPage;
