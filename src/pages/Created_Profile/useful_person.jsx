import { useState } from "react";
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
import { useRegisterQuery } from "@/services/api";
import { IconCircleCheckFilled, IconLoader } from "@tabler/icons-react";
import { Post_Useful_Person } from "./post_useful_person";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Useful_Person() {
  const { data, isLoading } = useRegisterQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const filtered = data?.filter((item) => {
    // search uchun username va rahbar
    const matchesSearch =
      item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.rahbari &&
        item.rahbari.toLowerCase().includes(searchTerm.toLowerCase()));

    // status filter: select qiymati string bo‘ladi, lekin item.status boolean
    const matchesStatus =
      statusFilter === "all" || item.status === (statusFilter === "true");

    return matchesSearch && matchesStatus;
  });

  const handleAction = (action, item) => {
    console.log(`${action} on ${item?.name}`);
  };
  return (
    <div className="w-full">
      {/* Controls Section */}
      <div className="flex flex-col xl:flex-row w-full gap-4 mb-4">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-4.5 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Foydalanuvchi nomi va FIO bo'yicha qidiring..."
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
                Barchasi
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("true")}>
                Faol
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("false")}>
                Faol emas
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

          <Post_Useful_Person />
        </div>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50 border-none">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-[12.5%] font-semibold">FIO</TableHead>
              <TableHead className="w-[12.5%] font-semibold">
                Foydalanuvchi nomi
              </TableHead>
              <TableHead className="w-[12.5%] font-semibold">Rol</TableHead>
              <TableHead className="w-[12.5%] font-semibold">Status</TableHead>
              <TableHead className="w-[12.5%] font-semibold">
                Tarkibiy tuzilma
              </TableHead>
              <TableHead className="w-[12.5%] font-semibold">
                Bekatlar
              </TableHead>
              <TableHead className="w-[12.5%] font-semibold">
                Faoliyati
              </TableHead>
              <TableHead className="w-[3%] text-right font-semibold">
                Amallar
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(8)].map((_, index) => (
                <TableRow key={index} className="border-none">
                  <TableCell>
                    <Skeleton className="w-full h-6 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-full h-6 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-full h-6 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-full h-6 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-full h-6 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-full h-6 rounded" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="w-full h-6 rounded" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="w-8 h-8 rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : filtered?.length > 0 ? (
              filtered.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={`border-b border-border hover:bg-muted/50 transition-colors ${
                    index % 2 === 0 ? "bg-background/50" : "bg-background"
                  }`}
                >
                  <TableCell className="font-medium text-foreground truncate flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={item?.photo} alt="@shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {item?.rahbari}
                  </TableCell>

                  <TableCell className="font-medium text-foreground truncate">
                    {item?.username}
                  </TableCell>

                  <TableCell className="text-muted-foreground text-sm truncate">
                    {item?.role}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-muted-foreground px-1.5"
                    >
                      {item.status === true ? (
                        <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
                      ) : (
                        <IconLoader />
                      )}
                      {item.status ? "Faol" : "Faol emas"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {item?.tarkibiy_tuzilma || "-"}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {item?.bekat_nomi || "-"}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {item.faoliyati?.length > 40
                      ? item.faoliyati.slice(0, 40) + "..."
                      : item.faoliyati}
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
              <TableRow>
                <TableCell
                  colSpan={8}
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
