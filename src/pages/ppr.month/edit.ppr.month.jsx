import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/animate-ui/primitives/radix/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreated_PPRQuery,
  useEditPPRMOnthMutation,
  useObyektQuery,
} from "@/services/api";
import { IconBrandTelegram } from "@tabler/icons-react";
import { Loader, Pencil, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditPPRMonth({ startData }) {
  const [open, setOpen] = useState(false);

  const { data: obyektlar } = useObyektQuery({ search: "" });
  const { data: pprs } = useCreated_PPRQuery();

  const [editPPr, { isLoading }] = useEditPPRMOnthMutation();

  const [edit, setEdit] = useState({
    boshlash_sanasi: "",
    yakunlash_sanasi: "",
    obyekt: "",
    ppr_turi: "",
    comment: "",
  });

  useEffect(() => {
    if (startData) {
      setEdit({
        boshlash_sanasi: startData?.boshlash_sanasi || "",
        yakunlash_sanasi: startData?.yakunlash_sanasi || "",
        obyekt: String(startData?.obyekt || ""),
        ppr_turi: String(startData?.ppr_turi || ""),
        comment: startData?.comment || "",
      });
    }
  }, [startData]);

  /* 🔧 universal change handler */
  const handleChange = (key, value) => {
    setEdit((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /* ✅ submit */
  const handleSubmit = async () => {
    try {
      await editPPr({
        id: startData?.id,
        body: edit,
      }).unwrap();
      toast.success("Muvaffaqiyatli saqlandi");
      setOpen(false);
    } catch (error) {
      if (error?.data?.obyekt) toast.warning("Obyektni tanlashingiz kerak!");
      if (error?.data?.ppr_turi)
        toast.warning("PPR turini tanlashingiz kerak!");
      if (error?.data?.yakunlash_sanasi)
        toast.warning("Yakuniy sanani tanlashingiz kerak!");
      if (error?.data?.non_field_errors)
        toast.error(error.data.non_field_errors[0]);

      console.error(error);
    }
  };

  return (
    <div>
      {/* ✏️ Edit button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm hover:bg-muted transition"
      >
        <Pencil className="h-4 w-4" />
        Tahrirlash
      </button>

      {/* 🪟 Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-50 bg-black/80" />

          <DialogContent className="sm:max-w-md fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 border bg-background p-6 rounded-lg">
            <DialogClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </DialogClose>

            <DialogHeader>
              <DialogTitle>PPR maʼlumotlarini tahrirlash</DialogTitle>
            </DialogHeader>

            {/* 📄 FORM */}
            <div className="flex flex-col gap-4 py-6">
              {/* Sanalar */}
              <div className="flex gap-4">
                <div className="flex flex-col gap-1 w-full">
                  <Label>Boshlash sanasi</Label>
                  <Input type="date" value={edit.boshlash_sanasi} disabled />
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <Label>Yakunlash sanasi</Label>
                  <Input
                    type="date"
                    value={edit.yakunlash_sanasi}
                    onChange={(e) =>
                      handleChange("yakunlash_sanasi", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Selectlar */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <Label>Obyekt</Label>
                  <Select
                    value={edit.obyekt}
                    onValueChange={(val) => handleChange("obyekt", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {obyektlar?.results?.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.obyekt_nomi}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1">
                  <Label>PPR turi</Label>
                  <Select
                    value={edit.ppr_turi}
                    onValueChange={(val) => handleChange("ppr_turi", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      {pprs?.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.qisqachanomi}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Comment */}
              <div className="flex flex-col gap-1">
                <Label>Izoh</Label>
                <Textarea
                  placeholder="Izoh yozing"
                  value={edit.comment}
                  onChange={(e) => handleChange("comment", e.target.value)}
                />
              </div>

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white h-11 font-semibold"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    Saqlanmoqda <Loader className="animate-spin" />
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Saqlash <IconBrandTelegram />
                  </span>
                )}
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
