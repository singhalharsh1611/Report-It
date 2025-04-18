import React, { useState, useEffect } from 'react';
import { IssueCard } from '@/components/issues/IssueCard';
import { Button } from '@/components/ui/button';
import axios from "axios";
import {
  Filter,
  ArrowUpDown,
  Calendar,
  Map as MapIcon,
  ThumbsUp,
  RefreshCw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';


const backend = import.meta.env.VITE_BACKEND_URL;
const IssueFeedPage = () => {
  // const [issues] = useState(mockIssues);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [statusFilter, setStatusFilter] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [issues, setIssues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const issuesPerPage = 6;
  const indexOfLastIssue = currentPage * issuesPerPage;
  const indexOfFirstIssue = indexOfLastIssue - issuesPerPage;
  const currentIssues = issues.slice(indexOfFirstIssue, indexOfLastIssue);


  const navigate = useNavigate();

  const getIssueFeed = async () => {
    try {
      const queryParams = new URLSearchParams();

      if (statusFilter.length > 0) {
        statusFilter.forEach((status) => queryParams.append("status", status));
      }

      if (categoryFilter && categoryFilter !== "all") {
        queryParams.append("category", categoryFilter);
      }

      if (sortBy) {
        queryParams.append("sort", sortBy);
      }

      const response = await axios.get(
        `${backend}/issue?${queryParams.toString()}`
      );

      if (response.data.success) {
        setIssues(response.data.issues);
      } else {
        console.error(response.data.message || "Failed to load issues");
      }
    } catch (err) {
      console.error("Error fetching issues:", err);
    }
  };

  // Inside your component
  const handleStatusChange = (
    status,
    checked,
    statusFilter,
    setStatusFilter
  ) => {
    const updated = checked
      ? [...statusFilter, status]
      : statusFilter.filter((s) => s !== status);
    setStatusFilter(updated);
  };

  const renderStatusCheckboxes = (statusFilter, setStatusFilter) => {
    const statuses = ["open", "in-progress", "review", "resolved", "rejected"];

    return statuses.map((status) => (
      <label key={status} className="flex items-center space-x-2 text-sm">
        <input
          type="checkbox"
          className="form-checkbox"
          checked={statusFilter.includes(status)}
          onChange={(e) =>
            handleStatusChange(
              status,
              e.target.checked,
              statusFilter,
              setStatusFilter
            )
          }
        />
        <span className="capitalize">{status.replace("-", " ")}</span>
      </label>
    ));
  };
  const totalPages = Math.ceil(issues.length / issuesPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };


  useEffect(() => {
    getIssueFeed();
  }, [statusFilter, categoryFilter, sortBy]);
  // console.log(issues[0]);

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Issue Feed</h1>
          <p className="text-muted-foreground mt-1">
            View and explore reported civic issues in your community
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => navigate("/map")}
          >
            <MapIcon className="h-4 w-4" />
            Map View
          </Button>
          <Button size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Filter Sidebar */}
        <div className="md:col-span-3 lg:col-span-3">
          <div className="hidden md:block sticky top-20 space-y-4">
            <div className="text-lg font-medium mb-4">Filters</div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Search issues..."
                  className="bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {renderStatusCheckboxes(statusFilter, setStatusFilter)}
                </div>

              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select onValueChange={(val) => setCategoryFilter(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="street light">Street Light</SelectItem>
                    <SelectItem value="roads">Roads</SelectItem>
                    <SelectItem value="sewage">Sewage</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="electricity">Electricity</SelectItem>
                    <SelectItem value="garbage">Garbage</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>

              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Most Recent" />
                  </SelectTrigger>
                  <SelectContent>

                    <SelectItem value="latest">Most Recent</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="upvotes">Most Upvotes</SelectItem>
                    <SelectItem value="comments">Most Comments</SelectItem>
                  </SelectContent>
                </Select>

              </div>


            </div>
          </div>

          {/* Accordion it is making filter responsive*/}
          <div className="md:hidden mb-6">
            <Accordion
              type="single"
              collapsible
              className="w-full"
              value={isFilterExpanded ? "filters" : ""}
              onValueChange={(val) => setIsFilterExpanded(val === "filters")}
            >
              <AccordionItem
                value="filters"
                className="border border-white/10 rounded-lg"
              >
                <AccordionTrigger className="px-4">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <span>Filters & Sort</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <Input
                      placeholder="Search issues..."
                      className="bg-secondary/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "open",
                        "in-progress",
                        "review",
                        "resolved",
                        "rejected",
                      ].map((status) => (
                        <label
                          key={status}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-primary rounded border-gray-400"
                          />
                          <span className="capitalize">
                            {status.replace("-", " ")}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        <SelectItem value="street light">Street Light</SelectItem>
                        <SelectItem value="roads">Roads</SelectItem>
                        <SelectItem value="sewage">Sewage</SelectItem>
                        <SelectItem value="water">Water</SelectItem>
                        <SelectItem value="electricity">Electricity</SelectItem>
                        <SelectItem value="garbage">Garbage</SelectItem>
                        <SelectItem value="others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sort By</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Most Recent" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="latest">Most Recent</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="upvotes">Most Upvotes</SelectItem>
                        <SelectItem value="comments">Most Comments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>


                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-9 lg:col-span-9">
          {/* Quick Sort for Mobile */}
          <div className="flex items-center justify-between mb-4 md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  <span>Sort By: Most Recent</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Most Recent</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Oldest First</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    <span>Most Upvotes</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Issue Cards */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[].map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentIssues.length === 0 ? (
              <p>No issues found.</p>
            ) : (
              currentIssues.map((issue) => (
                <IssueCard
                  key={issue._id} // or key={issue.id} if normalized
                  issue={{
                    id: issue._id, // pass it down as `id`
                    title: issue.title,
                    description: issue.description,
                    category: issue.category,
                    status: issue.status,
                    location: issue.location.address,
                    createdAt: issue.createdAt,
                    upvotes: issue.upvotes,
                    comments: issue.commentsCount || 0, // if you populated a count
                    imageUrl: issue.imageURL[0],
                  }}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 mx-2">
            <Button
              variant="outline"
              className="mr-2"
              onClick={handlePrev}
              disabled={currentPage === 1}>
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={i + 1 === currentPage ? 'default' : 'outline'}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueFeedPage;
