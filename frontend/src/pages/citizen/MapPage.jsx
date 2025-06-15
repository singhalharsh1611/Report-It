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

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

const MapPage = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [issues, setIssues] = useState([]);
  const [mapCenter, setMapCenter] = useState([25.4303, 81.7714]);
  const [statusFilters, setStatusFilters] = useState({
    open: false,
    "in-progress": false,
    review: false,
    resolved: false,
    rejected: false,
  });
  const [categoryFilter, setCategoryFilter] = useState("all");

  const handleStatusChange = (status) => {
    setStatusFilters((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
  };

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/issue`);
        // console.log(response.data.issues);
        const selectedLocations = [];
        for (let i = 0; i < response.data.issues.length; i++) {
          const issue = response.data.issues[i];

          if (
            statusFilters[issue.status] ||
            Object.values(statusFilters).every((value) => value === false)
          ) {
            if (categoryFilter === "all" || issue.category === categoryFilter) {
              if (
                issue.location &&
                issue.location.latitude &&
                issue.location.longitude
              ) {
                selectedLocations.push([
                  issue.location.latitude,
                  issue.location.longitude,
                ]);
              }
            }
          }
        }
        setIssues(selectedLocations);
      } catch (error) {
        console.error("Failed to fetch issues", error);
      }
    };

    fetchIssues();
  }, [statusFilters, categoryFilter]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setMapLoaded(true);
        },
        (error) => {
          console.error("Failed to fetch location:", error);
          // still show map with default center
          setMapLoaded(true);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setMapLoaded(true);
    }
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

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Filter Sidebar */}
        <div className="md:col-span-3 lg:col-span-3">
          <div className="hidden md:block sticky top-20 space-y-4">
            <div className="text-3xl font-medium mb-4 pb-5">Filters</div>

            <div className="space-y-4">
              

              {/* status filters */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "open",
                    "in progress",
                    "under review",
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
                        checked={statusFilters[status]}
                        onChange={()=>handleStatusChange(status)}
                      />
                      <span className="capitalize">
                        {status.replace("-", " ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* category filters */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "all",
                      "street light",
                      "roads",
                      "sewage",
                      "water",
                      "electricity",
                      "garbage",
                      "others",
                    ].map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

             </div>
          </div>

          {/* Mobile Accordion */}
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
                  {/* Same content as desktop */}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-9 lg:col-span-9">
          {/* Quick Sort Dropdown (Mobile) */}
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

          {/* Map */}
          <Card className="w-full h-[70vh] relative overflow-hidden border border-white/10">
            {!mapLoaded ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
                  <p className="mt-2 text-muted-foreground">Loading map...</p>
                </div>
              </div>
            ) : (
              <MapContainer
                center={mapCenter}
                zoom={15}
                scrollWheelZoom={true}
                className="h-full w-full z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright"></a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <HeatmapLayer points={issues} />
              </MapContainer>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
