import IssueCard from "./IssueCard";

const IssuesFeed = ({ issues, onStatusChange, isCompact = false }) => {
  if (issues.length === 0) {
    return (
      <div className="text-center p-6 border rounded-lg border-dashed">
        <p className="text-muted-foreground">No issues found</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {issues.map((issue) => (
        <IssueCard
          key={issue._id}
          issue={issue}
          onStatusChange={onStatusChange}
          isCompact={isCompact}
        />
      ))}
    </div>
  );
};

export default IssuesFeed;
