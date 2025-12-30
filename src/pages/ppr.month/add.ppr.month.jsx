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
  useAddPPRJadvalMutation,
  useCreated_PPRQuery,
  useObyektQuery,
} from "@/services/api";
import { IconBrandTelegram } from "@tabler/icons-react";
import { Loader, PlusCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AddPPRMonth({ startDate }) {
  const [open, setOpen] = useState(false);
  const { data } = useObyektQuery({ search: "" });
  const { data: pprs } = useCreated_PPRQuery();
  const [addPprJadval, { isLoading }] = useAddPPRJadvalMutation();
  const [edit, setEdit] = useState({
    boshlash_sanasi: startDate,
    yakunlash_sanasi: "",
    obyekt: "",
    ppr_turi: "",
    comment: "",
  });

  /* 🔄 agar boshqa kun bosilsa, startDate yangilansin */
  useEffect(() => {
    setEdit((prev) => ({
      ...prev,
      boshlash_sanasi: startDate,
    }));
  }, [startDate]);

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
      await addPprJadval({ body: edit }).unwrap();
      toast.success("Muvaffaqiyatli yuklandi");
    } catch (error) {
      if (error?.data?.obyekt) toast.warning("Obyektni tanlashingiz kerak!");
      if (error?.data?.ppr_turi)
        toast.warning("PPR turini tanlashingiz kerak!");
      if (error?.data?.yakunlash_sanasi)
        toast.warning("Yakuniy sanani tanlashingiz kerak!");
      if (error?.data?.non_field_errors)
        toast.error(error?.data?.non_field_errors[0]);
      console.log(error);
    }
    setOpen(false);
  };

  return (
    <div>
      {/* ➕ Button */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className="absolute bottom-1 right-1 dark:bg-transparent hover:text-gray-400 bg-blue-500/40"
      >
        <PlusCircle />
      </Button>

      {/* 🪟 Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-50 bg-black/80" />

          <DialogContent className="sm:max-w-md fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 border bg-background p-6 rounded-lg">
            <DialogClose className="absolute top-4 right-4">
              <X className="size-4" />
            </DialogClose>

            <DialogHeader>
              <DialogTitle>PPR qo‘shish</DialogTitle>
              <DialogDescription>
                Tanlangan sana: <b>{edit.boshlash_sanasi}</b>
              </DialogDescription>
            </DialogHeader>

            {/* 📄 FORM */}
            <div className="flex flex-col gap-4 py-6">
              {/* Boshlash sanasi */}
              <div className="flex items-center justify-center gap-5">
                {/* Boshlash sanasi */}
                <div className="flex flex-col gap-1">
                  <Label>Boshlash sanasi</Label>
                  <Input
                    type="date"
                    value={edit.boshlash_sanasi}
                    disabled
                    onChange={(e) =>
                      handleChange("boshlash_sanasi", e.target.value)
                    }
                  />
                </div>

                {/* Yakunlash sanasi */}
                <div className="flex flex-col gap-1">
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

              <div className="grid grid-cols-2 items-center justify-center gap-5">
                {/* Obyekt */}
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
                      {data?.results?.map((items) => {
                        return (
                          <SelectItem key={items?.id} value={items?.id}>
                            {items?.obyekt_nomi}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* PPR turi */}
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
                      {pprs?.map((items) => {
                        return (
                          <SelectItem key={items?.id} value={items?.id}>
                            {items?.qisqachanomi}
                          </SelectItem>
                        );
                      })}
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
                className="bg-green-600 hover:bg-green-700 text-white w-full h-11 font-semibold mt-4"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-1">
                    Saqlanmoqda... <Loader className="animate-spin" />{" "}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1">
                    Saqlash <IconBrandTelegram stroke={2} />
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
