import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, MapPin, ArrowUpDown, Calendar, ThumbsUp } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

const MapPage = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  useEffect(() => {
    //  map implement leaflet
    setTimeout(() => setMapLoaded(true), 1000);
  }, []);

  return (
    <div className="pb-12">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Issue Map</h1>
          <p className="text-muted-foreground mt-1">
            Explore reported issues on an interactive map
          </p>
        </div>
        <div className="flex gap-2 md:hidden">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6"></div>
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
                {["open", "in-progress", "review", "resolved", "rejected"].map(
                  (status) => (
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
                  )
                )}
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
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="upvotes">Most Upvotes</SelectItem>
                  <SelectItem value="comments">Most Comments</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full mt-2">Apply Filters</Button>
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
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="upvotes">Most Upvotes</SelectItem>
                      <SelectItem value="comments">Most Comments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full mt-2">Apply Filters</Button>
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

        {/* Map Area */}
        <div className="md:col-span-9 lg:col-span-9">
          <Card className="w-full h-[70vh] relative overflow-hidden border border-white/10">
            {!mapLoaded ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4 mx-auto"></div>
                  <p className="text-muted-foreground">Loading map...</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-[#242e3e]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-primary mb-4 mx-auto" />
                    <p className="text-lg font-medium">Map View</p>
                    <p className="text-muted-foreground">
                      Interactive map would be here using Leaflet
                    </p>
                  </div>
                </div>
                {/* Example Pins */}
                <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 bg-status-open rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-xs font-bold text-white">3</span>
                  </div>
                </div>
                <div className="absolute top-1/3 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 bg-status-inProgress rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-xs font-bold text-white">2</span>
                  </div>
                </div>
                <div className="absolute bottom-1/4 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 bg-status-resolved rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-xs font-bold text-white">5</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Status Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-6">
            {[
              { status: "open", label: "Open", count: 12 },
              { status: "in-progress", label: "In Progress", count: 8 },
              { status: "review", label: "Under Review", count: 3 },
              { status: "resolved", label: "Resolved", count: 24 },
              { status: "rejected", label: "Rejected", count: 5 },
            ].map((item) => (
              <div
                key={item.status}
                className={`p-3 rounded-lg border text-center
                     ${
                       item.status === "open"
                         ? "border-status-open/30 bg-status-open/10"
                         : ""
                     }
                     ${
                       item.status === "in-progress"
                         ? "border-status-inProgress/30 bg-status-inProgress/10"
                         : ""
                     }
                     ${
                       item.status === "review"
                         ? "border-status-review/30 bg-status-review/10"
                         : ""
                     }
                     ${
                       item.status === "resolved"
                         ? "border-status-resolved/30 bg-status-resolved/10"
                         : ""
                     }
                     ${
                       item.status === "rejected"
                         ? "border-status-rejected/30 bg-status-rejected/10"
                         : ""
                     }
                   `}
              >
                <div className="text-2xl font-bold mb-1">{item.count}</div>
                <div className="text-xs">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
