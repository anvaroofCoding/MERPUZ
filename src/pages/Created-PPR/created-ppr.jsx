import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/animate-ui/primitives/radix/dialog";
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
  useCreated_PPR_EditMutation,
  useCreated_PPR_PostMutation,
  useCreated_PPRQuery,
  useOptionAplicationQuery,
  useOptionTuzilmaQuery,
} from "@/services/api";
import {
  CloudDownload,
  FilePlusCorner,
  MessageCircleX,
  MoreVertical,
  Pencil,
  Search,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Edit_Useful_Person } from "../Created_Profile/edit_useful_person";
export default function Created_PPR() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 50;
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState("");
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    nomi: "",
    qisqachanomi: "",
    davriyligi: "",
    vaqti: "",
    comment: "",
    kimlar_qiladi: "",
    file: null,
  });
  const [formEdit, setFormEdit] = useState({
    nomi: "",
    qisqachanomi: "",
    davriyligi: "",
    vaqti: "",
    comment: "",
    kimlar_qiladi: "",
    file: null,
  });
  useEffect(() => {
    setFormEdit({
      nomi: editData?.nomi,
      qisqachanomi: editData?.qisqachanomi,
      davriyligi: editData?.davriyligi,
      vaqti: editData?.vaqti,
      comment: editData?.comment,
      kimlar_qiladi: editData?.kimlar_qiladi,
    });
  }, [editData]);
  const clearForm = () => {
    setForm({
      nomi: "",
      qisqachanomi: "",
      davriyligi: "",
      vaqti: "",
      comment: "",
      kimlar_qiladi: "",
      file: null,
    });
  };
  const clearFormEdit = () => {
    setForm({
      nomi: "",
      qisqachanomi: "",
      davriyligi: "",
      vaqti: "",
      comment: "",
      kimlar_qiladi: "",
      file: null,
    });
  };
  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleChanges = (name, value) => {
    setFormEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      file,
    }));
  };
  const { data, isLoading } = useCreated_PPRQuery();
  const { data: OptionAplications, isLoading: OptionAplicationLoading } =
    useOptionAplicationQuery();
  const { data: OptionTuzilma, isLoading: OptionTuzilmaLoader } =
    useOptionTuzilmaQuery();
  const [AddPPRTuri, { isError, error }] = useCreated_PPR_PostMutation();
  const [EditPPRTuri] = useCreated_PPR_EditMutation();
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("nomi", form.nomi);
      formData.append("qisqachanomi", form.qisqachanomi);
      formData.append("davriyligi", Number(form.davriyligi));
      formData.append("vaqti", form.vaqti);
      formData.append("comment", form.comment);
      formData.append("kimlar_qiladi", form.kimlar_qiladi);
      if (form.file) {
        formData.append("file", form.file);
      }
      toast.promise(AddPPRTuri({ body: formData }).unwrap(), {
        loading: "Ma'lumotlar yuborilmoqda...",
        success: "Muvaffaqiyatli yuborildi!",
      });
      clearForm();
      setShow(false);
    } catch (err) {
      console.error(err);
    }
  };
  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("nomi", formEdit.nomi);
      formData.append("qisqachanomi", formEdit.qisqachanomi);
      formData.append("davriyligi", Number(formEdit.davriyligi));
      formData.append("vaqti", formEdit.vaqti);
      formData.append("comment", formEdit.comment);
      formData.append("kimlar_qiladi", formEdit.kimlar_qiladi);
      if (formEdit.file) {
        formData.append("file", formEdit.file);
      }
      toast.promise(EditPPRTuri({ body: formData, id: editData.id }).unwrap(), {
        loading: "Ma'lumotlar tahrirlanmoqda...",
        success: "Muvaffaqiyatli tahrirlandi!",
      });
      clearFormEdit();
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };
  const totalPages = Math.ceil((data?.count || 0) / limit);
  useEffect(() => {
    if (isError) {
      if (error?.data?.file) {
        toast.error("Fayl yuborishingiz shart!");
        clearForm();
      }
    }
  }, [isError, error]);
  return (
    <div className="w-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          {/* Overlay */}
          <DialogOverlay className="fixed inset-0 z-50 bg-black/80" />

          {/* Content */}
          <DialogContent className="sm:max-w-md fixed left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-50 border bg-background p-6 rounded-lg">
            {/* Close Button */}
            <DialogClose className="absolute top-4 right-4">
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </DialogClose>

            {/* Header */}
            <DialogHeader>
              <DialogTitle className="text-lg">
                PPR turini tahrirlash
              </DialogTitle>
              <DialogDescription className="text-sm">
                Agarda bu yerda tahrirlashni amalga oshirsangiz eski ma'lumotlar
                saqlanmaydi!
              </DialogDescription>
            </DialogHeader>

            {/* Form Content */}
            <div className="flex flex-col gap-4 py-6">
              {/* NOMI va QISQACHA NOMI */}
              <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
                <div className="flex flex-col gap-1">
                  <Label>Nomi</Label>
                  <Input
                    placeholder="PPRning asl nomi yoziladi"
                    value={formEdit.nomi}
                    onChange={(e) => handleChanges("nomi", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label>Qisqacha nomi</Label>
                  <Select
                    value={formEdit.qisqachanomi}
                    onValueChange={(val) => handleChanges("qisqachanomi", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PPR-1">PPR-1</SelectItem>
                      <SelectItem value="PPR-2">PPR-2</SelectItem>
                      <SelectItem value="PPR-3">PPR-3</SelectItem>
                      <SelectItem value="PPR-4">PPR-4</SelectItem>
                      <SelectItem value="PPR-5">PPR-5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* DAVRIYLIGI va VAQTI */}
              <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
                <div className="flex flex-col gap-1">
                  <Label>Davriyligi misol uchun (10)</Label>
                  <Input
                    type="number"
                    placeholder="Davriligini kiriting"
                    value={formEdit.davriyligi}
                    onChange={(e) =>
                      handleChanges("davriyligi", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label>Vaqt birligi</Label>
                  <Select
                    value={formEdit.vaqti}
                    onValueChange={(val) => handleChanges("vaqti", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="soat">Soat</SelectItem>
                      <SelectItem value="kun">Kun</SelectItem>
                      <SelectItem value="oy">Oy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* COMMENT */}
              <div className="flex flex-col gap-1">
                <Label>PPR turi haqida batafsil ma'lumot</Label>
                <Textarea
                  placeholder="Ma'lumotni yozing"
                  value={formEdit.comment}
                  onChange={(e) => handleChanges("comment", e.target.value)}
                />
              </div>

              {/* KIMLAR QILADI */}
              <div className="flex flex-col gap-1">
                <Label>PPRda qatnashuvchilar</Label>
                <Input
                  placeholder="Masalan: Texnik bo‘lim"
                  value={formEdit.kimlar_qiladi}
                  onChange={(e) =>
                    handleChanges("kimlar_qiladi", e.target.value)
                  }
                />
              </div>

              {/* FILE */}
              <div className="flex flex-col gap-1">
                <Label>Fayl</Label>
                <label className="border border-dashed border-green-600 flex items-center justify-center gap-2 p-3 rounded-md cursor-pointer hover:bg-muted/40 transition">
                  <Upload size={18} />
                  Fayl yuklash
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    onChange={handleFileUpload}
                  />
                </label>

                {form.file && (
                  <p className="text-sm text-green-600 break-words">
                    Yuklangan fayl: {form.file.name}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleEditSubmit}
                className="bg-green-600 hover:bg-green-700 text-white w-full h-11 font-semibold text-base mt-4"
              >
                Saqlash
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Controls Section */}
      <div className="flex flex-col xl:flex-row w-full gap-4 mb-4">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-4.5 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Izoh bo'yicha qidiring..."
            className="pl-10 bg-card border-border"
            value={searchTerm}
            disabled
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-row gap-3">
          {show ? (
            <Button
              className="bg-red-500 hover:bg-red-600 text-white hover:text-gray-200"
              onClick={() => setShow(false)}
            >
              Yopish <MessageCircleX />
            </Button>
          ) : (
            <Button onClick={() => setShow(true)}>
              Qo'shish <FilePlusCorner size={17} className="ml-1" />
            </Button>
          )}
        </div>
      </div>
      {/* add */}
      {show ? (
        <Card className="w-full my-5">
          <CardHeader>
            <CardTitle className="text-lg">
              PPR turin ro'yxatga olishingiz mumkin
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            {/* NOMI */}
            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-1">
                <Label>Nomi</Label>
                <Input
                  placeholder="PPRning asl nomi yoziladi"
                  value={form.nomi}
                  onChange={(e) => handleChange("nomi", e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Label>Qisqacha nomi</Label>
                <Select
                  value={form.qisqachanomi}
                  onValueChange={(val) => handleChange("qisqachanomi", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PPR-1">PPR-1</SelectItem>
                    <SelectItem value="PPR-2">PPR-2</SelectItem>
                    <SelectItem value="PPR-3">PPR-3</SelectItem>
                    <SelectItem value="PPR-4">PPR-4</SelectItem>
                    <SelectItem value="PPR-5">PPR-5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* DAVRIYLIGI */}
              <div className="flex flex-col gap-1">
                <Label>Davriyligi misol uchun (10)</Label>
                <Input
                  type="number"
                  placeholder="Davriligini kiriting"
                  value={form.davriyligi}
                  onChange={(e) => handleChange("davriyligi", e.target.value)}
                />
              </div>

              {/* VAQTI */}
              <div className="flex flex-col gap-1">
                <Label>Vaqt birligi</Label>
                <Select
                  value={form.vaqti}
                  onValueChange={(val) => handleChange("vaqti", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soat">Soat</SelectItem>
                    <SelectItem value="kun">Kun</SelectItem>
                    <SelectItem value="oy">Oy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* COMMENT */}
            <div className="flex flex-col gap-1">
              <Label>PPR turi haqida batafsil ma'lumot</Label>
              <Textarea
                placeholder="Ma'lumotni yozing"
                value={form.comment}
                onChange={(e) => handleChange("comment", e.target.value)}
              />
            </div>

            {/* KIMLAR QILADI */}
            <div className="flex flex-col gap-1">
              <Label>PPRda qatnashuvchilar</Label>
              <Input
                placeholder="Masalan: Texnik bo‘lim"
                value={form.kimlar_qiladi}
                onChange={(e) => handleChange("kimlar_qiladi", e.target.value)}
              />
            </div>

            {/* FILE */}
            <div className="flex flex-col gap-1">
              <Label>Fayl</Label>

              <label className="border border-dashed border-green-600 flex items-center justify-center gap-2 p-3 rounded-md cursor-pointer hover:bg-muted/40 transition">
                <Upload size={18} />
                Fayl yuklash
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  onChange={handleFileUpload}
                />
              </label>

              {form.file && (
                <p className="text-sm text-green-600 break-words">
                  Yuklangan fayl: {form.file.name}
                </p>
              )}
            </div>

            <div>
              <Button
                onClick={handleSubmit}
                // disabled={AplicationLoader}
                className="bg-green-600 hover:bg-green-700 text-white w-full h-11 font-semibold text-base"
              >
                Saqlash
              </Button>
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
                Qisqa nomi
              </TableHead>
              <TableHead className="w-[15%] font-semibold">Nomi</TableHead>
              <TableHead className="w-[10%] font-semibold">
                Davriyligi
              </TableHead>
              <TableHead className="w-[15%] font-semibold">
                Qatnashuvchilar
              </TableHead>
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
                </TableRow>
              ))
            ) : data?.length > 0 ? (
              data?.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={`border-b border-border hover:bg-muted/50 transition-colors ${
                    index % 2 === 0 ? "bg-background/50" : "bg-background"
                  }`}
                >
                  <TableCell className="font-medium text-foreground truncate ">
                    {item?.qisqachanomi ? item?.qisqachanomi : "Mavjud emas"}
                  </TableCell>
                  <TableCell className="font-medium text-foreground truncate">
                    {item?.nomi ? item?.nomi : "Mavjud emas"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm truncate">
                    <Badge variant="outline">
                      {item?.davriyligi
                        ? item?.davriyligi + " " + item?.vaqti
                        : "Mavjud emas"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm truncate">
                    <Badge>
                      {item?.kimlar_qiladi
                        ? item?.kimlar_qiladi
                        : "Mavjud emas"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground whitespace-normal break-words max-w-[300px]">
                    {item.comment ? item.comment : "Mavjud emas"}
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
                            setOpen(true);
                            setEditData(item);
                          }}
                        >
                          <Pencil /> Tahrirlash
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            return (window.location.href = item.file);
                          }}
                        >
                          <CloudDownload /> Faylni yuklab olish
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
