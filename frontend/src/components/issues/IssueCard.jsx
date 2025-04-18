import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { MessageSquare, ArrowBigUp, Calendar, MapPin } from "lucide-react";

export function IssueCard({ issue }) {
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
              <span className="text-xs">{issue.createdAt}</span>
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
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground hover:text-primary"
          >
            <ArrowBigUp className="h-4 w-4" />
            <span>{issue.upvotes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground hover:text-primary"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{issue.comments}</span>
          </Button>
        </div>
        <Button variant="secondary" size="sm">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
