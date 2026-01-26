import { EmptyOutline } from "@/components/Empty/not_found";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  useComing_AplicationQuery,
  useOptionAplicationQuery,
  useOptionTuzilmaQuery,
} from "@/services/api";
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLoader,
} from "@tabler/icons-react";
import { ChevronDown, Eye, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Coming_Applications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  console.log(statusFilter);
  const [sortBy, setSortBy] = useState("");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 50;
  const [totalPages, setTotalPages] = useState(1); // Declare totalPages variable
  const { data, isLoading, total_pages } = useComing_AplicationQuery({
    page,
    limit,
    search: searchTerm,
    status: statusFilter,
    tuzilma_nomi: sortBy,
  });
  const { data: OptionAplications, isLoading: OptionAplicationLoading } =
    useOptionAplicationQuery();
  const { data: OptionTuzilma, isLoading: OptionTuzilmaLoader } =
    useOptionTuzilmaQuery();

  useEffect(() => {
    if (total_pages) {
      setTotalPages(total_pages);
    }
  }, [total_pages]);

  const statusConfig = {
    "bajarilgan": {
      variant: "success",
      icon: IconCircleCheckFilled,
      iconClass: "text-white",
    },
    "qabul qilindi": {
      variant: "default",
      icon: IconCircleCheckFilled,
      iconClass: "text-blue-500",
    },
    "qaytarildi": {
      variant: "destructive",
      icon: IconCircleXFilled,
      iconClass: "text-red-100",
    },
    "jarayonda": {
      variant: "warning",
      icon: IconLoader,
      iconClass: "text-white ",
    },
  };

  return (
    <div className="w-full">
      {/* Controls Section */}
      <div className="flex flex-col xl:flex-row w-full gap-4 mb-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Izoh bo'yicha qidiring..."
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
              <DropdownMenuItem onClick={() => setStatusFilter("")}>
                Barchasi
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("jarayonda")}>
                Jarayonda
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("bajarilgan")}>
                Bajarilgan
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("qaytarildi")}>
                Qaytarilgan
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setStatusFilter("qabul qilindi")}
              >
                Qabul qilindi
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
                Kimga
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-card border-border"
            >
              <DropdownMenuItem onClick={() => setSortBy("")}>
                Barchasi
              </DropdownMenuItem>
              {OptionTuzilma?.map((item) => {
                return (
                  <DropdownMenuItem
                    key={item?.id}
                    onClick={() => setSortBy(item?.tuzilma_nomi)}
                  >
                    {item?.tuzilma_nomi}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* table */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[18%]">Ariza beruvchi</TableHead>
              <TableHead className="w-[15%]">Ariza yaratuvchi</TableHead>
              <TableHead className="w-[15%]">Turi</TableHead>
              <TableHead className="w-[15%]">Status</TableHead>
              <TableHead className="w-[25%]">Izoh</TableHead>
              <TableHead className="w-[5%] text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading || OptionTuzilmaLoader || OptionAplicationLoading ? (
              [...Array(30)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(7)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.results?.length > 0 ? (
              data.results.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={
                    index % 2 === 0 ? "bg-background/50" : "bg-background"
                  }
                >
                  {/* Kim tomonidan */}
                  <TableCell className="flex items-center gap-2">
                    {item?.kim_tomonidan?.photo ? (
                      <img
                        src={item.kim_tomonidan.photo}
                        alt={item.kim_tomonidan.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold uppercase">
                        {item?.kim_tomonidan?.name?.charAt(0) || "?"}
                      </div>
                    )}

                    <span className="font-medium truncate">
                      {item?.kim_tomonidan?.name || "Mavjud emas"}
                    </span>
                  </TableCell>

                  {/* Ariza yaratuvchi */}
                  <TableCell className="text-sm text-muted-foreground">
                    {item?.created_by || "Mavjud emas"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item?.turi == "ijro" ? "Ijro uchun" : "Ma'lumot uchun"}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {(() => {
                      const status = statusConfig[item.status];

                      return (
                        <Badge
                          variant={status?.variant || "outline"}
                          className="flex items-center gap-1 capitalize w-fit"
                        >
                          {status?.icon && (
                            <status.icon
                              className={cn("h-4 w-4", status.iconClass)}
                            />
                          )}
                          {item.status}
                        </Badge>
                      );
                    })()}
                  </TableCell>

                  {/* Izoh */}
                  <TableCell className="text-sm text-muted-foreground">
                    {item?.comment
                      ? item.comment.length > 60
                        ? item.comment.slice(0, 60) + "..."
                        : item.comment
                      : "Mavjud emas"}
                  </TableCell>

                  {/* Amallar */}
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const than_title = item?.created_by;
                        navigate(`${than_title}/${item?.id}`);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center">
                  <EmptyOutline />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationPrevious
                onClick={() => setPage(Math.max(1, page - 1))}
                isActive={page === 1}
              />
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => setPage(index + 1)}
                    isActive={page === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                isActive={page === totalPages}
              />
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
