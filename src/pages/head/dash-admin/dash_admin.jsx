"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, MoreVertical, ChevronDown } from "lucide-react";

const mockData = [
  {
    id: "1",
    name: "v0ChatMode10verride",
    email: "anthropic@example.com",
    status: "active",
    location: "Cross Region Bedrock",
    joinDate: "2024-01-15",
    type: "STRING",
  },
  {
    id: "2",
    name: "v0WebsiteVisionEnabled",
    email: "vision@example.com",
    status: "active",
    location: "US East",
    joinDate: "2024-01-20",
    type: "BOOLEAN",
  },
  {
    id: "3",
    name: "v0AutoFixRewriteModel",
    email: "autofix@example.com",
    status: "inactive",
    location: "Fireworks RL",
    joinDate: "2024-02-01",
    type: "STRING",
  },
  {
    id: "4",
    name: "gitBidirectionalSyncEnabled",
    email: "sync@example.com",
    status: "active",
    location: "GitHub",
    joinDate: "2024-02-10",
    type: "BOOLEAN",
  },
  {
    id: "5",
    name: "blockLoaderEnabled",
    email: "loader@example.com",
    status: "pending",
    location: "Middleware",
    joinDate: "2024-02-15",
    type: "BOOLEAN",
  },
  {
    id: "6",
    name: "hydrateMessageContent",
    email: "hydrate@example.com",
    status: "inactive",
    location: "Cache Layer",
    joinDate: "2024-02-20",
    type: "STRING",
  },
  {
    id: "7",
    name: "vscodeEnabled",
    email: "vscode@example.com",
    status: "active",
    location: "IDE Integration",
    joinDate: "2024-03-01",
    type: "BOOLEAN",
  },
  {
    id: "8",
    name: "v0ChatDiffsEnabled",
    email: "diffs@example.com",
    status: "active",
    location: "UI Layer",
    joinDate: "2024-03-05",
    type: "BOOLEAN",
  },
];

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-green-500/20 text-green-700 dark:text-green-400",
  },
  inactive: {
    label: "Inactive",
    className: "bg-gray-500/20 text-gray-700 dark:text-gray-400",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-500/20 text-amber-700 dark:text-amber-400",
  },
};

export default function Dash_Admin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const filteredAndSortedData = useMemo(() => {
    let filtered = mockData;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Sorting
    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "date") {
      filtered.sort(
        (a, b) =>
          new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
      );
    } else if (sortBy === "status") {
      filtered.sort((a, b) => a.status.localeCompare(b.status));
    }

    return filtered;
  }, [searchTerm, statusFilter, sortBy]);

  const handleAction = (action, item) => {
    console.log(`${action} on ${item.name}`);
  };

  return (
    <div className="w-full">
      {/* Controls Section */}
      <div className="flex flex-col xl:flex-row w-full gap-4 mb-4">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-4.5 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or location..."
            className="pl-10 bg-card border-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-row gap-3">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-border bg-card hover:bg-card/80"
              >
                Status
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-card border-border"
            >
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                Inactive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-border bg-card hover:bg-card/80"
              >
                Sort by
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-card border-border"
            >
              <DropdownMenuItem onClick={() => setSortBy("name")}>
                Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("date")}>
                Join Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("status")}>
                Status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50 border-b border-border">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[25%] font-semibold">Name</TableHead>
              <TableHead className="w-[20%] font-semibold">Email</TableHead>
              <TableHead className="w-[15%] font-semibold">Status</TableHead>
              <TableHead className="w-[20%] font-semibold">Location</TableHead>
              <TableHead className="w-[12%] font-semibold">Type</TableHead>
              <TableHead className="w-[8%] text-right font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.length > 0 ? (
              filteredAndSortedData.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={`border-b border-border hover:bg-muted/50 transition-colors ${
                    index % 2 === 0 ? "bg-background/50" : "bg-background"
                  }`}
                >
                  <TableCell className="font-medium text-foreground truncate">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm truncate">
                    {item.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        statusConfig[item.status].className
                      } border-0 font-medium`}
                    >
                      {statusConfig[item.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.location}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-muted"
                        >
                          <MoreVertical className="w-4 h-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-card border-border w-48"
                      >
                        <DropdownMenuItem
                          onClick={() => handleAction("View", item)}
                        >
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction("Edit", item)}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction("Duplicate", item)}
                        >
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction("Move", item)}
                        >
                          Change Location
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleAction("Delete", item)}
                          className="text-destructive focus:text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-b border-border">
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  No items found matching your search criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
