import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddPPRYearsMutation,
  useObyektOptionQuery,
  useOptionTuzilmaQuery,
  usePprTuriOptionQuery,
  usePprYearsQuery,
} from "@/services/api";
import { Check, ChevronsUpDown, Eye, FilePlusIcon, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function PprYears() {
  const months = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];
  const [open, setOpen] = useState(false);
  const [openObyekt, setOpenObyekt] = useState(false);
  const [openPpr, setOpenPpr] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const [show, setShow] = useState(false);
  const limit = 50;
  const navigate = useNavigate();
  const years = Array.from({ length: 10 }, (_, i) => {
    const currentYear = new Date().getFullYear();
    return (currentYear - 5 + i).toString();
  });
  const currentYear = new Date().getFullYear().toString();
  const [yil, setYil] = useState(String(currentYear));
  const currentMonthIndex = new Date().getMonth(); // 0-11
  const [oy, setOy] = useState(months[currentMonthIndex]);
  console.log(yil, oy);
  const [filters, setFilters] = useState({
    status: "all",
  });
  const [form, setForm] = useState({
    yil: currentYear,
    oylar: [],
    tarkibiy_tuzilma: [],
    obyekt: "",
    ppr_turi: "",
    comment: "",
    status: "jarayonda",
  });
  const clearInput = () => {
    setForm({
      yil: currentYear,
      oylar: [],
      tarkibiy_tuzilma: [],
      obyekt: "",
      ppr_turi: "",
      comment: "",
      status: "jarayonda",
    });
  };
  const { data, isLoading } = usePprYearsQuery({
    yil,
    oy,
    page,
    limit,
    search: searchTerm,
    status: statusFilter,
  });
  const { data: OptionTuzilma, isLoading: OptionTuzilmaLoader } =
    useOptionTuzilmaQuery();
  const { data: pprTuriOption, isLoading: obyektLoad } =
    usePprTuriOptionQuery();
  const { data: obyektOption, isLoading: ppturiLoad } = useObyektOptionQuery();
  const [addPPR, { isLoading: addLoads }] = useAddPPRYearsMutation();

  const toggleValue = (id) => {
    setForm((prev) => {
      const exists = prev.tarkibiy_tuzilma.includes(id);

      return {
        ...prev,
        tarkibiy_tuzilma: exists
          ? prev.tarkibiy_tuzilma.filter((v) => v !== id)
          : [...prev.tarkibiy_tuzilma, id],
      };
    });
  };

  const selectedLabels = OptionTuzilma?.filter((opt) =>
    form.tarkibiy_tuzilma.includes(opt.id),
  )
    .map((opt) => opt.tuzilma_nomi)
    .join(", ");

  const toggleMonth = (month) => {
    setForm((prev) => {
      const exists = prev.oylar.includes(month);
      return {
        ...prev,
        oylar: exists
          ? prev.oylar.filter((m) => m !== month)
          : [...prev.oylar, month],
      };
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        yil: Number(form.yil),
        oylar: form.oylar,
        tarkibiy_tuzilma: form.tarkibiy_tuzilma,
        obyekt: Number(form.obyekt),
        ppr_turi: Number(form.ppr_turi),
        comment: form.comment,
        status: form.status,
      };
      await addPPR({ body: payload }).unwrap();
      toast.success("Muvaffaqiyatli saqlandi");
      clearInput();
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Xato yuz berdi");
    }
  };

  const totalPages = data?.count ? Math.ceil(data.count / limit) : 0;

  return (
    <div className="w-full space-y-4">
      {/* 🛠 Controls Section */}
      <div className="flex flex-col xl:flex-row w-full gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Izoh bo'yicha qidiring..."
            className="pl-10 bg-card border-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {/* add data */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                onClick={() => {
                  setOpen(true);
                }}
              >
                <>
                  <FilePlusIcon className="w-4 h-4 mr-2" /> PPR qo'shish
                </>
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>PPR ma'lumotlarini kiriting</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Yil */}
                <div className="space-y-2">
                  <Label>Yil</Label>
                  <Select
                    value={form.yil}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, yil: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Yilni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {years?.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Oylar (Multi select) */}
                <div className="space-y-2">
                  <Label>Oylar</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {months?.map((month) => (
                      <div key={month} className="flex items-center gap-2">
                        <Checkbox
                          id={month}
                          checked={form.oylar.includes(month)}
                          onCheckedChange={() => toggleMonth(month)}
                        />
                        <Label htmlFor={month} className="text-sm">
                          {month}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  {/* Obyekt (Searchable) */}
                  <div className="space-y-2">
                    <Label>Obyekt</Label>

                    <Popover open={openObyekt} onOpenChange={setOpenObyekt}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openObyekt}
                          className="w-full justify-between"
                        >
                          {form.obyekt
                            ? obyektOption?.results?.find(
                                (o) => String(o.id) === String(form.obyekt),
                              )?.obyekt_nomi
                            : "Obyektni tanlang"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Qidirish..." />
                          <CommandEmpty>Topilmadi</CommandEmpty>

                          <CommandGroup>
                            {obyektOption?.results?.map((o) => (
                              <CommandItem
                                key={o.id}
                                value={String(o.obyekt_nomi)}
                                onSelect={() => {
                                  setForm((prev) => ({
                                    ...prev,
                                    obyekt: o.id,
                                  }));
                                  setOpenObyekt(false);
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    form.obyekt === o.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                />
                                {o.obyekt_nomi}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* PPR turi (Searchable) */}
                  <div className="space-y-2">
                    <Label>PPR turi</Label>
                    <Popover open={openPpr} onOpenChange={setOpenPpr}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openPpr}
                          className="w-full justify-between"
                        >
                          {form.ppr_turi
                            ? pprTuriOption.find((p) => p.id === form.ppr_turi)
                                ?.qisqachanomi
                            : "PPR turini tanlang"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Qidirish..." />
                          <CommandEmpty>Topilmadi</CommandEmpty>
                          <CommandGroup>
                            {pprTuriOption?.map((p) => (
                              <CommandItem
                                key={p.id}
                                value={p.qisqachanomi} // Qidiruv nom bo'yicha ishlaydi
                                onSelect={() => {
                                  setForm((prev) => ({
                                    ...prev,
                                    ppr_turi: p.id, // Formaga ID saqlanadi
                                  }));
                                  setOpenPpr(false);
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    form.ppr_turi === p.id
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                />
                                {p.qisqachanomi}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {selectedLabels || "Tarkibiy tuzilmani tanlang"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Qidirish..." />
                      <CommandEmpty>Hech narsa topilmadi</CommandEmpty>

                      <CommandGroup>
                        {OptionTuzilma?.map((option) => (
                          <CommandItem
                            key={option.id}
                            onSelect={() => toggleValue(option.id)}
                            className="flex items-center gap-2"
                          >
                            <Checkbox
                              checked={form.tarkibiy_tuzilma.includes(
                                option.id,
                              )}
                            />
                            <span>{option.tuzilma_nomi}</span>
                            {form.tarkibiy_tuzilma.includes(option.id) && (
                              <Check className="ml-auto h-4 w-4" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Comment */}
                <div className="space-y-2">
                  <Label>Izoh (Comment)</Label>
                  <Textarea
                    placeholder="Izoh yozing..."
                    value={form.comment}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, comment: e.target.value }))
                    }
                  />
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button onClick={handleSubmit}>Saqlash</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4 items-center">
        {/* Yil filter */}
        <Select
          value={yil}
          onValueChange={(v) => {
            setYil(v);
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Yil" />
          </SelectTrigger>
          <SelectContent>
            {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Oy filter */}
        <Select
          value={oy}
          onValueChange={(v) => {
            setOy(v);
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Oy" />
          </SelectTrigger>
          <SelectContent>
            {[
              "Yanvar",
              "Fevral",
              "Mart",
              "Aprel",
              "May",
              "Iyun",
              "Iyul",
              "Avgust",
              "Sentabr",
              "Oktabr",
              "Noyabr",
              "Dekabr",
            ].map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v);
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Barchasi</SelectItem>
            <SelectItem value="bajarildi">Bajarilgan</SelectItem>
            <SelectItem value="jarayonda">Bajarilmagan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 📋 Table Section */}
      <div className="rounded-md border border-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="w-12 text-center">№</TableHead>
              <TableHead>Obyekt nomi</TableHead>
              <TableHead>PPR nomi</TableHead>
              <TableHead>Yil</TableHead>
              <TableHead>Oy</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="min-w-[200px]">Izoh</TableHead>
              <TableHead className="text-right">Amallar</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading || ppturiLoad || obyektLoad || OptionTuzilmaLoader ? (
              [...Array(limit)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(7)].map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.results?.length > 0 ? (
              data.results.map((item, index) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="text-center font-medium text-muted-foreground">
                    {(page - 1) * limit + index + 1}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs border border-primary/20">
                        {item?.obyekt_name?.charAt(0) || "?"}
                      </div>
                      <span className="font-medium text-sm">
                        {item?.obyekt_name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Badge
                        variant="outline"
                        className="text-[11px] font-normal bg-background"
                      >
                        {item?.ppr_turi_name}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm">
                    <span className="text-blue-600 font-medium">
                      {item?.yil}
                    </span>
                  </TableCell>

                  <TableCell>
                    {item?.oylar.length > 1
                      ? item?.oylar.map((items, i) => {
                          return (
                            <span key={i} className="mr-1">
                              {items + ","}
                            </span>
                          );
                        })
                      : item?.oylar.map((items, i) => {
                          return (
                            <span key={i} className="mr-1">
                              {items}
                            </span>
                          );
                        })}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground leading-relaxed">
                    {item?.status == "bajarildi" ? (
                      <Badge>Bajarilgan</Badge>
                    ) : (
                      <Badge variant={"destructive"}>Bajarilmagan</Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-sm text-muted-foreground leading-relaxed">
                    {item?.comment
                      ? item.comment.length > 50
                        ? item.comment.slice(0, 50) + "..."
                        : item.comment
                      : ""}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() =>
                        navigate(`${item?.created_by}/${item?.id}`)
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-muted-foreground"
                >
                  Ma'lumot topilmadi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 📑 Pagination */}
      {totalPages > 1 && (
        <div className="pt-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={
                    page === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    onClick={() => setPage(i + 1)}
                    isActive={page === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={
                    page === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
