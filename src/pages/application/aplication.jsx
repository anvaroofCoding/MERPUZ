import { EmptyOutline } from "@/components/Empty/not_found";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { cn } from "@/lib/utils";
import {
  useAddAplicationMutation,
  useAplicationQuery,
  useOptionAplicationQuery,
  useOptionTuzilmaQuery,
} from "@/services/api";
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLoader,
} from "@tabler/icons-react";
import { format } from "date-fns";
import {
  AlertCircle,
  CalendarIcon,
  ChevronDown,
  Eye,
  EyeOff,
  FilePlusIcon as FilePlusCorner,
  Loader,
  MessageCircleX,
  Plus,
  Search,
  Send,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Applications() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 50;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [structureSearch, setStructureSearch] = useState("");
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [totalPages, setTotalPages] = useState(1); // Declare totalPages variable
  const [form, setForm] = useState({
    comment: "",
    parol: "",
    tuzilmalar: [],
    photos: [],
    bildirgi: "",
    turi: "",
    ijro_muddati: null,
  });
  const aplication_clear = () => {
    setForm({
      comment: "",
      parol: "",
      tuzilmalar: [],
      photos: [],
      bildirgi: "",
      turi: "",
      ijro_muddati: null,
      qayta_yuklandi: true,
    });
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
        bildirgi: file,
      });
    }
  };
  const handleStructureToggle = (structureId) => {
    setForm((prev) => ({
      ...prev,
      tuzilmalar: prev.tuzilmalar.includes(structureId)
        ? prev.tuzilmalar.filter((id) => id !== structureId)
        : [...prev.tuzilmalar, structureId],
    }));
  };
  const { data, isLoading, total_pages } = useAplicationQuery({
    page,
    limit,
    search: searchTerm,
    status: statusFilter,
    tuzilma_nomi: sortBy,
  });
  console.log(data);
  const { data: OptionAplications, isLoading: OptionAplicationLoading } =
    useOptionAplicationQuery();
  const { data: OptionTuzilma, isLoading: OptionTuzilmaLoader } =
    useOptionTuzilmaQuery();
  const [AddAplications, { isLoading: AplicationLoader, isError, error }] =
    useAddAplicationMutation();
  useEffect(() => {
    if (total_pages) {
      setTotalPages(total_pages);
    }
  }, [total_pages]);
  const filteredStructures =
    OptionTuzilma?.filter((item) =>
      item?.tuzilma_nomi.toLowerCase().includes(structureSearch.toLowerCase()),
    ) || [];
  const isFormComplete = () => {
    const hasRequiredFields =
      form.comment.trim() !== "" && form.tuzilmalar.length > 0;

    return hasRequiredFields;
  };
  const submitForm = async () => {
    const fd = new FormData();
    fd.append("comment", form.comment);
    fd.append("parol", form.parol);
    fd.append("turi", form.turi);
    fd.append("qayta_yuklandi", true);

    if (form.ijro_muddati) {
      fd.append("ijro_muddati", format(form.ijro_muddati, "yyyy-MM-dd"));
    }

    form.tuzilmalar.forEach((id) => fd.append("tuzilmalar", id));

    form.photos.forEach((p) => fd.append("photos", p));

    if (form.bildirgi) {
      fd.append("bildirgi", form.bildirgi);
    }

    await toast.promise(AddAplications({ body: fd }).unwrap(), {
      loading: "Yuborilmoqda...",
      success: "Yuborildi!",
      error: "Xatolik!",
    });

    setShow(false);
    setShowVerificationModal(false);
    aplication_clear();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowVerificationModal(true);
  };
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
      iconClass: "text-red-500",
    },
    "jarayonda": {
      variant: "warning",
      icon: IconLoader,
      iconClass: "text-white animate-spin",
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

          {show ? (
            <Button
              variant="outline"
              className="bg-red-500 hover:bg-red-600 text-white hover:text-gray-200"
              onClick={() => {
                setShow(false);
                aplication_clear();
              }}
            >
              Yopish <MessageCircleX className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setShow(true)}>
              Qo'shish <FilePlusCorner className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* add */}
      {show && (
        <Card className="w-full my-5 border-border/50 shadow-sm">
          <CardHeader className="border-b border-border/30 pb-4">
            <CardTitle className="text-lg font-semibold">
              Ariza jo'natish
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Barcha bo'sh joylarni to'ldiring
            </p>
          </CardHeader>

          <CardContent>
            <form className="space-y-6">
              {/* STRUCTURES - AT TOP WITH SEARCH */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tuzilmalar</Label>
                <p className="text-xs text-muted-foreground">
                  Bir nechta tuzilmalarni tanlashingiz mumkin
                </p>
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Tuzilma qidiring..."
                    className="pl-10 h-9 text-sm bg-card border-border"
                    value={structureSearch}
                    onChange={(e) => setStructureSearch(e.target.value)}
                  />
                </div>
                {/* Horizontal scrollable structures */}
                <div className="flex gap-2 overflow-x-auto pb-2 pt-2 -mx-0.5 px-0.5">
                  {filteredStructures && filteredStructures.length > 0 ? (
                    filteredStructures.map((item) => (
                      <button
                        key={item?.id}
                        type="button"
                        onClick={() => handleStructureToggle(item?.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                          form.tuzilmalar.includes(item?.id)
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-muted text-muted-foreground border border-border/50 hover:bg-muted/70"
                        }`}
                      >
                        {item?.tuzilma_nomi}
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground py-2">
                      Tuzilmalar topilmadi
                    </p>
                  )}
                </div>
                {form.tuzilmalar.length > 0 && (
                  <p className="text-xs text-blue-600 font-medium">
                    ✓ {form.tuzilmalar.length} ta tanlangan
                  </p>
                )}
              </div>

              {/* TYPE & CALENDAR - INLINE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Turi</Label>
                  <Select
                    value={form.turi}
                    onValueChange={(val) => setForm({ ...form, turi: val })}
                  >
                    <SelectTrigger className="h-9 text-sm bg-card border-border">
                      <SelectValue placeholder="Turni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ijro">Ijro uchun</SelectItem>
                      <SelectItem value="malumot">Ma'lumot uchun</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.turi === "ijro" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Ijro muddati</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal gap-2 bg-card border-border h-9 text-sm"
                        >
                          <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                          {form.ijro_muddati
                            ? format(form.ijro_muddati, "MMM dd, yyyy")
                            : "Sanani tanlang"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={form.ijro_muddati}
                          onSelect={(date) =>
                            setForm({ ...form, ijro_muddati: date })
                          }
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>

              {/* IMAGES SECTION */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Rasmlar</Label>

                <div className="flex flex-wrap gap-3 items-start">
                  {/* ADD IMAGE */}
                  <label className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-blue-500/50 rounded-lg cursor-pointer hover:bg-blue-50/30 hover:border-blue-500 transition-all flex-shrink-0">
                    <div className="flex flex-col items-center gap-1">
                      <Plus className="w-5 h-5 text-blue-600" />
                      <span className="text-xs text-blue-600 font-medium">
                        Qo'sh
                      </span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                    />
                  </label>

                  {/* PHOTOS */}
                  {form.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative w-20 h-20 rounded-lg bg-muted border border-border/50 shadow-sm flex-shrink-0"
                    >
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover rounded-lg"
                        crossOrigin="anonymous"
                      />

                      {/* DELETE — ALWAYS VISIBLE */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePhoto(index);
                        }}
                        className="absolute z-10 -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md hover:bg-red-600 font-bold text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {form.photos.length === 0 && (
                  <p className="text-xs text-muted-foreground/70 pt-1">
                    Rasmlar yuklangan emas
                  </p>
                )}
              </div>

              {/* FILE UPLOAD - COMPACT */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Fayl</Label>
                <label className="flex items-center gap-2 px-3 py-2.5 border-2 border-dashed  border-blue-500/50 rounded-lg cursor-pointer hover:bg-muted/50 transition-all duration-200 w-fit">
                  <Upload
                    size={16}
                    className="text-muted-foreground flex-shrink-0"
                  />
                  <span className="text-sm text-muted-foreground">
                    Fayl yuklash
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                    onChange={handleBildirgiUpload}
                  />
                </label>
                {form.bildirgi && (
                  <p className="text-xs text-green-600 flex items-center gap-2 mt-2">
                    <span className="inline-flex w-2 h-2 rounded-full bg-green-500" />
                    {form.bildirgi.name}
                  </p>
                )}
              </div>

              {/* COMMENT - AT BOTTOM */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Komment</Label>
                <Textarea
                  placeholder="O'z fikringizni yozing..."
                  className="resize-none h-20 text-sm bg-card border-border"
                  value={form.comment}
                  onChange={(e) =>
                    setForm({ ...form, comment: e.target.value })
                  }
                />
              </div>

              {!isFormComplete() && (
                <div className="flex items-start  gap-2 p-3 bg-amber-50 border border-amber-200/50 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-600  flex-shrink-0" />
                  <p className="text-xs text-amber-700">
                    Barcha bo'sh joylarni to'ldirish kerak
                  </p>
                </div>
              )}

              {/* SUBMIT & CANCEL - COMPACT */}
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="text-sm h-9 border-border bg-transparent px-4"
                  onClick={() => {
                    setShow(false);
                    aplication_clear();
                  }}
                >
                  Bekor qilish
                </Button>
                {AplicationLoader ? (
                  <Button className="flex-1 text-sm h-9" disabled>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Yuborilmoqda...
                  </Button>
                ) : (
                  <Button
                    className="flex-1 text-sm h-9"
                    disabled={!isFormComplete()}
                    onClick={handleSubmit}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Yuborish
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={showVerificationModal}
        onOpenChange={setShowVerificationModal}
      >
        <DialogContent className="sm:max-w-md border-border">
          <DialogHeader>
            <DialogTitle className="text-base">Kodni kiriting</DialogTitle>
            <p className="text-xs text-muted-foreground mt-2">
              Parolingizni tasdiqlovchi kodni kiriting
            </p>
          </DialogHeader>
          <form className="space-y-4">
            <div className="relative">
              <Input
                type={passwordVisible ? "text" : "password"}
                placeholder="Parolni kiriting"
                className="pr-10 text-sm bg-card border-border h-9"
                value={form.parol}
                onChange={(e) => setForm({ ...form, parol: e.target.value })}
                autoFocus
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 text-sm h-9 border-border bg-transparent"
                onClick={() => {
                  setShowVerificationModal(false);
                }}
              >
                Bekor qilish
              </Button>
              <Button
                type="button"
                onClick={submitForm}
                className="flex-1 text-sm h-9"
              >
                Tasdiqlash
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* table */}
      <div className="border border-border rounded-lg bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[18%]">Kim tomonidan</TableHead>
              <TableHead className="w-[22%]">Tuzilmalar</TableHead>
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

                  {/* Tuzilmalar */}
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item?.tuzilma_nomlari?.length ? (
                        item.tuzilma_nomlari.map((name, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs"
                          >
                            {name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Mavjud emas
                        </span>
                      )}
                    </div>
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
