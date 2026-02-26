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
import { useMEQuery, useRegisterQuery } from "@/services/api";
import { IconCircleCheckFilled, IconLoader } from "@tabler/icons-react";
import { Eye, MoreVertical, Search, UserRoundPen } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit_Useful_Person } from "./edit_useful_person";
import { ForAdmin_Post_Bolum_Useful_Person } from "./For.admin_Post_Bolum_useful_person";
import { Post_Bolum_Useful_Person } from "./post_bolum_useful_person";
import { Post_Monitoring_Useful_Person } from "./post_monitoring_useful_person";
import { Post_Useful_Person } from "./post_useful_person";
import { CreatedBolumNAme } from "./created.Bolum.Name";

export default function Useful_Person() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 30;
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const { data, isLoading } = useRegisterQuery({
    page,
    limit: pageSize,
    search: searchTerm,
  });
  const { data: me, isLoading: MeLoading } = useMEQuery();
  const totalPages = Math.ceil((data?.count || 0) / pageSize);
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);
  const renderRole = (role) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "monitoring":
        return "Monitoring";
      case "tarkibiy":
        return "Tarkibiy Tuzilma Rahbari";
      case "bekat":
        return "Bekat Rahbari";
      case "bolim":
        return "Xodim";
      default:
        return "Noma'lum";
    }
  };
  return (
    <div className="w-full space-y-4">
      {/* TOP */}
      <div className="flex gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Foydalanuvchi qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
        </div>
        {me?.role == "admin" ? <Post_Useful_Person /> : ""}
        {me?.role == "tarkibiy" ? (
          <Post_Bolum_Useful_Person id={me?.tarkibiy_tuzilma_id} />
        ) : (
          ""
        )}
        {me?.role == "admin" ? (
          <ForAdmin_Post_Bolum_Useful_Person id={me?.tarkibiy_tuzilma_id} />
        ) : (
          ""
        )}
        {me?.role == "admin" ? (
          <Post_Monitoring_Useful_Person id={me?.tarkibiy_tuzilma_id} />
        ) : (
          ""
        )}
        <CreatedBolumNAme />
      </div>

      {/* TABLE */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Foydalanuvchi nomi</TableHead>
              <TableHead>FIO</TableHead>
              <TableHead>Roli</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Faoliyati</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading || MeLoading ? (
              [...Array(30)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(8)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.results?.length ? (
              data?.results.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={item.photo} />
                      <AvatarFallback>{item.username?.[0]}</AvatarFallback>
                    </Avatar>
                    {item?.username}
                  </TableCell>

                  <TableCell>{item?.rahbari}</TableCell>
                  <TableCell>{renderRole(item.role)}</TableCell>

                  <TableCell>
                    <Badge variant="outline">
                      {item.status ? (
                        <IconCircleCheckFilled
                          size={17}
                          className="text-green-500"
                        />
                      ) : (
                        <IconLoader size={17} />
                      )}
                      {item.status ? "Faol" : "Faol emas"}
                    </Badge>
                  </TableCell>

                  <TableCell>{item.faoliyati || "-"}</TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(`${item.username}/${item.id}`)
                          }
                        >
                          <Eye /> Ko‘rish
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setEditData(item);
                            setEditModal(true);
                          }}
                        >
                          <UserRoundPen /> Tahrirlash
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <EmptyOutline />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <Edit_Useful_Person
        open={editModal}
        setOpen={setEditModal}
        data={editData}
      />
    </div>
  );
}
