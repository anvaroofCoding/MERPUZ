import { EmptyOutline } from "@/components/Empty/not_found";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddAplicationMutation,
  useComing_AplicationQuery,
  useOptionAplicationQuery,
  useOptionTuzilmaQuery,
} from "@/services/api";
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLoader,
} from "@tabler/icons-react";
import {
  Eye,
  EyeOff,
  Loader,
  MessageCircleX,
  MoreVertical,
  Search,
  Send,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Edit_Useful_Person } from "../Created_Profile/edit_useful_person";

export default function Coming_Applications() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 50;
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    comment: "",
    parol: "",
    tuzilma: 0,
    photos: [],
    bildirgi: "",
  });
  const aplication_clear = () => {
    setForm({ comment: "", parol: "", tuzilma: 0, photos: [], bildirgi: "" });
  };
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }));
  };
  const removePhoto = (index) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };
  const handleBildirgiUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        bildirgi: file, // <-- shu
      });
    }
  };
  const { data, isLoading } = useComing_AplicationQuery({
    page,
    limit,
    search: searchTerm,
  });
  console.log(data);
  const { data: OptionAplications, isLoading: OptionAplicationLoading } =
    useOptionAplicationQuery();
  const { data: OptionTuzilma, isLoading: OptionTuzilmaLoader } =
    useOptionTuzilmaQuery();
  const [AddAplications, { isLoading: AplicationLoader, isError, error }] =
    useAddAplicationMutation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("comment", form.comment);
    fd.append("parol", form.parol);
    fd.append("tuzilma", form.tuzilma);
    form.photos.forEach((p) => fd.append("photos", p));
    fd.append("bildirgi", form.bildirgi);
    toast.promise(AddAplications(fd).unwrap(), {
      loading: "Yuborilmoqda...",
      success: "Yuborildi!",
      error: "Xatolik!",
    });
    setShow(false);
    aplication_clear();
  };

  const totalPages = Math.ceil((data?.count || 0) / limit);
  useEffect(() => {
    if (isError) {
      console.log(error);
      if (error?.data?.comment) {
        toast.error("Izoh yozishingiz shart!");
        aplication_clear();
      }
      if (error?.data?.parol) {
        toast.error("Parolingizni xato kiritdingiz");
      }
    }
  }, [isError, error]);
  return (
    <div className="w-full">
      {/* Controls Section */}
      <div className="flex flex-col xl:flex-row w-full gap-4 mb-4">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-4.5 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Izoh bo'yicha qidiring..."
            className="pl-10 bg-card border-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {/* add */}
      {show ? (
        <Card className="w-full my-5">
          <CardHeader>
            <CardTitle className="text-lg">
              Ariza jo'natish uchun ma'lumotlarni to'ldiring
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            {/* COMMENT */}
            <div className="flex flex-col gap-1">
              <Label>Komment</Label>
              <Textarea
                placeholder="Komment yozing"
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
              />
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col gap-1 relative">
              <Label>Parol</Label>
              <Input
                type={passwordVisible ? "text" : "password"}
                placeholder="Parol"
                value={form.parol}
                onChange={(e) => setForm({ ...form, parol: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-7 text-muted-foreground"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* TUZILMA SELECT */}
            <div className="flex flex-col gap-1">
              <Label>Tuzilma</Label>
              <Select
                onValueChange={(val) =>
                  setForm({ ...form, tuzilma: Number(val) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tuzilma tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {OptionTuzilma?.map((item) => {
                    return (
                      <SelectItem key={item?.id} value={item?.id}>
                        {item?.tuzilma_nomi}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* PHOTOS */}
            <div className="flex flex-col gap-1">
              <Label>Rasmlar</Label>

              <label className="border flex items-center justify-center gap-2 p-3 rounded cursor-pointer hover:bg-muted/40">
                <Upload size={18} /> Rasmlar yuklash
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                />
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                {form.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="preview"
                      className="w-full h-20 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -right-2 -top-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow group-hover:scale-110 transition"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Label>Fayl</Label>

              <label className="border flex items-center justify-center gap-2 p-3 rounded cursor-pointer hover:bg-muted/40">
                <Upload size={18} /> Faylni yuklash
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                  onChange={handleBildirgiUpload}
                />
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                {form.bildirgi && (
                  <p className="text-sm mt-1 text-green-600">
                    Yuklangan fayl: {form.bildirgi.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex grid grid-cols-2 gap-5 ">
              <Button
                className="bg-red-600 hover:bg-red-500 text-white mt-2"
                onClick={() => {
                  setShow(false);
                  aplication_clear();
                }}
              >
                Bekor qilish <MessageCircleX />
              </Button>
              {AplicationLoader ? (
                <Button className=" mt-2" disabled>
                  Yuborilmoqda... <Loader />
                </Button>
              ) : (
                <Button
                  className=" mt-2"
                  disabled={form?.comment ? false : true}
                  onClick={handleSubmit}
                >
                  Yuborish <Send />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        ""
      )}

      {/* Table */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50 border-none">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="w-[15%] font-semibold">
                Kim tamonidan
              </TableHead>
              <TableHead className="w-[15%] font-semibold">Kimga</TableHead>
              <TableHead className="w-[15%] font-semibold">
                Ariza yaratuvchi
              </TableHead>
              <TableHead className="w-[15%] font-semibold">
                Yaratilgan sana
              </TableHead>
              <TableHead className="w-[15%] font-semibold">Status</TableHead>
              <TableHead className="w-[37%] font-semibold">Izoh</TableHead>
              <TableHead className="w-[3%] text-right font-semibold">
                Amallar
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading || OptionTuzilmaLoader || OptionAplicationLoading ? (
              [...Array(10)].map((_, index) => (
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
                    {item?.kim_tomonidan ? item?.kim_tomonidan : "Mavjud emas"}
                  </TableCell>
                  <TableCell className="font-medium text-foreground truncate">
                    {item?.tuzilma ? item?.tuzilma : "Mavjud emas"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm truncate">
                    {item?.created_by ? item?.created_by : "Mavjud emas"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm truncate">
                    {item?.sana
                      ? (() => {
                          const d = new Date(item.sana);
                          const dd = String(d.getDate()).padStart(2, "0");
                          const mm = String(d.getMonth() + 1).padStart(2, "0");
                          const yyyy = d.getFullYear();
                          const hh = String(d.getHours()).padStart(2, "0");
                          const mins = String(d.getMinutes()).padStart(2, "0");
                          return `${dd}-${mm}-${yyyy} ${hh}:${mins}`;
                        })()
                      : "Mavjud emas"}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-muted-foreground px-1.5 capitalize flex items-center gap-1"
                    >
                      {item.status === "bajarilgan" && (
                        <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
                      )}

                      {item.status === "qaytarildi" && (
                        <IconCircleXFilled className="fill-red-500 dark:fill-red-400" />
                      )}

                      {item.status === "qabul qilindi" && (
                        <IconCircleCheckFilled className="fill-blue-500 dark:fill-blue-400" />
                      )}

                      {item.status === "jarayonda" && (
                        <IconLoader className="animate-spin text-amber-500" />
                      )}

                      {item.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground">
                    {item.comment
                      ? item?.comment?.length > 60
                        ? item.comment.slice(0, 60) + "..."
                        : item.comment
                      : "Mavjud emas"}
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
                          onClick={() => {
                            const than_title = item?.kim_tomonidan;
                            navigate(`${than_title}/${item?.id}`);
                          }}
                        >
                          <Eye /> Ko'rish
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
      {data?.results?.length > 0 ? (
        <div className="py-5">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => page > 1 && setPage(page - 1)}
                />
              </PaginationItem>

              {/* Dynamik page numbers */}
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      isActive={page === pageNum}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() => page < totalPages && setPage(page + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
