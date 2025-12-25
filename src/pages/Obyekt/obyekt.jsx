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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useObyekt_postMutation, useObyektQuery } from "@/services/api";
import {
  Edit,
  FilePlusCorner,
  MapPin,
  MoreVertical,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
function ObyektSkeleton() {
  return (
    <Card className="border-muted">
      <CardContent className="p-4 flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-40" />
        </div>
        <Skeleton className="h-8 w-8 rounded-md" />
      </CardContent>
    </Card>
  );
}
export default function Obyekt() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    obyekt_nomi: "",
    toliq_nomi: "",
  });
  console.log(form);
  const [searchTerm, setSearchTerm] = useState("");
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const { data: response, isLoading } = useObyektQuery({
    search: searchTerm,
  });
  const [Obyekt_post] = useObyekt_postMutation();
  if (isLoading) {
    return (
      <div>
        <div className="flex flex-col xl:flex-row w-full gap-4 mb-4">
          {/* Search Bar */}
          <div className="relative w-full">
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-row gap-3">
            <Skeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ObyektSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }
  const handleChanges = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleEditSubmit = async () => {
    try {
      await Obyekt_post({
        body: {
          obyekt_nomi: form.obyekt_nomi,
          toliq_nomi: form.toliq_nomi,
        },
      }).unwrap();
      toast.success("Obyekt muvaffaqiyatli qo'shildi");
      setOpen(false);
      setForm({
        obyekt_nomi: "",
        toliq_nomi: "",
      });
    } catch (error) {
      if (error?.data?.obyekt_nomi) {
        toast.error(`❗ Obyektning nomini yozishingiz kerak`);
      }
      if (error?.data?.toliq_nomi) {
        toast.error(`❗ ${error?.data?.toliq_nomi[0]}`);
      }
    }
  };
  console.log("🚀 Obyektlar:", response);
  return (
    <div>
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

        {/* Filters and Sort */}
        <div className="flex flex-row gap-3">
          <Button onClick={() => setOpen(true)}>
            Qo'shish <FilePlusCorner />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {response?.results?.map((item) => (
          <Card
            key={item.id}
            className="hover:shadow-md transition border-muted"
          >
            <CardContent className="p-4 flex items-start justify-between">
              {/* LEFT */}
              <div className="space-y-1">
                <p className="font-semibold leading-none">{item.obyekt_nomi}</p>
                <p className="text-sm text-muted-foreground">
                  {item.toliq_nomi}
                </p>
              </div>

              {/* RIGHT - 3 DOT MENU */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={() =>
                      navigate(
                        `${encodeURIComponent(item.toliq_nomi)}/${
                          item?.location?.lat
                        }/${item?.location?.lng}`,
                      )
                    }
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Lokatsiyani ko‘rish
                  </DropdownMenuItem>

                  {item?.location ? (
                    <DropdownMenuItem
                      onClick={() =>
                        navigate(
                          `${encodeURIComponent(item.toliq_nomi)}/${
                            item?.location?.id
                          }/tahrirlash/${item.id}`,
                        )
                      }
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Tahrirlash
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() =>
                        navigate(
                          `${encodeURIComponent(item.toliq_nomi)}/${item.id}`,
                        )
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Lokatsiya qo'shish
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Add */}
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
              <DialogTitle className="text-lg">Obyekt qo'shish</DialogTitle>
              <DialogDescription className="text-sm">
                Iltimos, obyekt ma'lumotlarini kiriting
              </DialogDescription>
            </DialogHeader>

            {/* Form Content */}
            <div className="flex flex-col gap-4 py-6">
              {/* NOMI va QISQACHA NOMI */}
              <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
                <div className="flex flex-col gap-1">
                  <Label>Qisqa nomi</Label>
                  <Input
                    placeholder="Qisqa nomini yoziladi"
                    value={form?.obyekt_nomi}
                    onChange={(e) =>
                      handleChanges("obyekt_nomi", e.target.value)
                    }
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label>To'liq nomi</Label>
                  <Input
                    placeholder="To'liq nomini yoziladi"
                    value={form?.toliq_nomi}
                    onChange={(e) =>
                      handleChanges("toliq_nomi", e.target.value)
                    }
                  />
                </div>
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

      {/* add */}
    </div>
  );
}
