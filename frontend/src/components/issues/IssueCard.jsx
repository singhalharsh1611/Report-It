import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { MessageSquare, ArrowBigUp, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import AuthContext from "@/contexts/AuthContext";
// import { Token } from "@mui/icons-material";
// import { useAuth } from "@/contexts/AuthContext";
const backend = import.meta.env.VITE_BACKEND_URL;

export function IssueCard({ issue }) {
  // console.log("iss",issue.upvotes);
  const [comments, setComments] = useState([]);
  const [upvoteCount, setUpvoteCount] = useState(issue.upvotes?.length || 0);
  const { token } = useContext(AuthContext)
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${backend}/api/issue/${issue.id}/comments`);
      if (res.data.success) {
        // console.log(res.data.comments);
        setComments(res.data.comments);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

 const submitUpvote = async () => {
    try {
      const res = await axios.patch(
        `${backend}/api/issue/${issue.id}/upvote`,
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

  useEffect(() => {
    setUpvoteCount(issue.upvotes?.length || 0);
    
    const userId = decodedToken(token)?.id; // helper to decode user id from token
    setHasUpvoted(issue.upvotes?.includes(userId));

    fetchComments();
  }, [issue.id, issue.upvotes])
  ;
    function dateConvertion(event) {
    return new Date(event).toLocaleString('en-US', {
      dateStyle: 'medium', // e.g., "Jun 25, 2025"
      timeStyle: 'short',  // e.g., "5:30 PM"
    })
  }
  return (
    <Card className="overflow-hidden border border-white/10 bg-card hover:border-primary/20 transition-all duration-300">
      {issue.imageUrl && (
        <div className="h-48 w-full overflow-hidden">
          <img
            src={issue.imageUrl}
            alt={issue.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}

      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <div className="text-sm text-muted-foreground mb-1 flex items-center">
            <div className="flex items-center mr-3">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="text-xs">{issue.location}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span className="text-xs">{dateConvertion(issue.createdAt)}</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold">{issue.title}</h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-secondary/50 px-2 py-1 text-xs">
              {issue.category}
            </span>
            <StatusBadge status={issue.status} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {issue.description}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-0">
        <div className="flex items-center gap-3">
        <Button
            onClick={submitUpvote}
            variant="ghost"
            size="sm"
            className={`gap-1 hover:text-primary ${
              hasUpvoted ? "text-primary font-semibold" : "text-muted-foreground"
            }`}
          >
            <ArrowBigUp className="h-4 w-4" />
            <span>{upvoteCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground hover:text-primary"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{comments.length}</span>
          </Button>
        </div>


        <Link to={`/issue/${issue.id}`} className="block hover:underline">
          <Button variant="secondary" size="sm">
            View Details
          </Button>
        </Link>


      </CardFooter>
    </Card>
  );
}
