import { EmptyOutline } from "@/components/Empty/not_found";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAplicationQuery } from "@/services/api";
import { IconCircleCheckFilled, IconLoader } from "@tabler/icons-react";
import {
  ChevronDown,
  Eye,
  MoreVertical,
  Search,
  UserRoundPen,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit_Useful_Person } from "../Created_Profile/edit_useful_person";
import { Post_Useful_Person } from "../Created_Profile/post_useful_person";

export default function Applications() {
  const navigate = useNavigate();
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState("");
  const { data, isLoading } = useAplicationQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("all");

  const handleOpenEdit = (row) => {
    setEditData(row); // shu user ma'lumotlarini yuboramiz
    setEditModal(true); // modalni ochamiz
  };
  console.log(data);
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
                Rol
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-card border-border"
            >
              <DropdownMenuItem onClick={() => setSortBy("all")}>
                Barchasi
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("tarkibiy")}>
                Tarkibiy tuzilmalar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("bekat")}>
                Bekatlar
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
            {isLoading || !data ? (
              [...Array(data?.length || 10)].map((_, index) => (
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
            ) : data?.results?.length > 0 ? (
              data?.results?.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={`border-b border-border hover:bg-muted/50 transition-colors ${
                    index % 2 === 0 ? "bg-background/50" : "bg-background"
                  }`}
                >
                  <TableCell className="font-medium text-foreground truncate flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={item?.photo} alt={item?.rahbari} />
                      <AvatarFallback>{`${item?.username?.charAt(
                        0,
                      )}${item?.username?.charAt(
                        item.username.length - 1,
                      )}`}</AvatarFallback>
                    </Avatar>
                    {item?.rahbari}
                  </TableCell>
                  <TableCell className="font-medium text-foreground truncate">
                    {item?.username}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm truncate">
                    {item?.role == "tarkibiy" ? "Tarkibiy tuzilma" : "Bekat"}
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
                  {item.tarkibiy_tuzilma || item.bekat_nomi ? (
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
                            onClick={() => {
                              const than_title = item?.username;
                              navigate(`${than_title}/${item?.id}`);
                            }}
                          >
                            <Eye /> Ko'rish
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleOpenEdit(item)}
                          >
                            <UserRoundPen /> Tahrirlash
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  ) : (
                    <TableCell className="text-right">
                      <span>Admin</span>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-muted-foreground"
                >
                  <EmptyOutline />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* edit amali */}
      <Edit_Useful_Person
        data={editData}
        open={editModal}
        setOpen={setEditModal}
      />
    </div>
  );
}
