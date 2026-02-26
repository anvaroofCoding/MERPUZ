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
  useMEQuery,
  useObyektOptionQuery,
  useObyektQuery,
  usePprTuriOptionQuery,
} from "@/services/api";
import { IconBrandTelegram } from "@tabler/icons-react";
import { Check, ChevronsUpDown, Loader, PlusCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";

export default function AddPPRMonth({ startDate }) {
  const [openPpr, setOpenPpr] = useState(false);
  const [openObyekt, setOpenObyekt] = useState(false);
  const [open, setOpen] = useState(false);
  const { data } = useObyektQuery({ search: "" });
  const { data: pprs } = useCreated_PPRQuery();
  const [addPprJadval, { isLoading }] = useAddPPRJadvalMutation();
  const [edit, setEdit] = useState({
    status: "jarayonda",
    obyektlar_ids: [],
    ppr_turi: "",
    comment: "",
    sana: startDate,
  });

  useEffect(() => {
    if (startDate) {
      setEdit((prev) => ({
        ...prev,
        sana: startDate,
      }));
    }
  }, [startDate]);
  const { data: obyektOption } = useObyektOptionQuery();
  const { data: pprTuriOption } = usePprTuriOptionQuery();
  const { data: me, isLoading: meLoading } = useMEQuery();

  /* ✅ submit */
  const handleSubmit = async () => {
    console.log(edit);
    try {
      await addPprJadval({ body: edit }).unwrap();
      toast.success("Muvaffaqiyatli yuklandi");
      setEdit({
        obyektlar_ids: [],
        ppr_turi: "",
        comment: "",
        sana: startDate,
        status: "jarayonda",
      });
    } catch (error) {
      console.log(error);
      toast.error("Nimadir xato ketdi");
    }
    setOpen(false);
  };

  const toggleObyekt = (id) => {
    setEdit((prev) => ({
      ...prev,
      obyektlar_ids: prev.obyektlar_ids.includes(id)
        ? prev.obyektlar_ids.filter((o) => o !== id)
        : [...prev.obyektlar_ids, id],
    }));
  };
  const selectedLabels =
    edit.obyektlar_ids.length > 0
      ? obyektOption?.results
          ?.filter((o) => edit.obyektlar_ids.includes(o.id))
          .map((o) => o.obyekt_nomi)
          .join(", ")
      : "";

  return (
    <div>
      {/* ➕ Button */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className={`absolute -bottom-1 -right-2 ${me?.role == "bolim" ? "block" : "hidden"}`}
        variant="link"
        disabled={isLoading || meLoading}
      >
        <PlusCircle size={15} className="dark:text-white text-gray-800" />
      </Button>

      {/* 🪟 Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/70" />

          <DialogContent className="bg-white/10 border-white/20 min-w-3xl">
            <DialogClose className="absolute right-4 top-4 text-white hover:text-red-400">
              <X className="h-4 w-4" />
            </DialogClose>
            <DialogHeader>
              <DialogTitle className={"text-white"}>{startDate}</DialogTitle>
              <DialogDescription className={"text-white"}>
                Ushbu sana bo'yicha PPR ni rejalashtirish
              </DialogDescription>
            </DialogHeader>

            {/* Obyekt (Searchable) */}
            <div className="space-y- mt-5">
              <Label className="text-white mb-2">Obyekt</Label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between border-white/30 bg-white/20 text-white"
                  >
                    {selectedLabels || "Obyektni tanlang"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full p-0 bg-white/10 border-white/30">
                  <Command className="bg-transparent">
                    <CommandInput placeholder="Qidirish..." />

                    <CommandEmpty>Hech narsa topilmadi</CommandEmpty>

                    <CommandGroup>
                      {obyektOption?.results?.map((option) => {
                        const checked = edit.obyektlar_ids.includes(option.id);

                        return (
                          <CommandItem
                            key={option.id}
                            onSelect={() => toggleObyekt(option.id)}
                            className="flex items-center gap-2 text-white data-[selected=true]:bg-white/20"
                          >
                            <Checkbox checked={checked} />
                            <span>{option.obyekt_nomi}</span>

                            {checked && (
                              <Check className="ml-auto h-4 w-4 opacity-80" />
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {/* PPR turi (Searchable) */}
            <div className="space-y-2 ">
              <Label className={"text-white"}>PPR turi</Label>
              <Popover open={openPpr} onOpenChange={setOpenPpr}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openPpr}
                    className="w-full justify-between border-white/30 bg-white/20 text-white"
                  >
                    {edit.ppr_turi
                      ? pprTuriOption.find((p) => p.id === edit.ppr_turi)
                          ?.qisqachanomi
                      : "PPR turini tanlang"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-white/10 border-white/30">
                  <Command className={"bg-white/10 border-white/30"}>
                    <CommandInput
                      className="text-white placeholder:text-white/60"
                      placeholder="Qidirish..."
                    />
                    <CommandEmpty>Topilmadi</CommandEmpty>
                    <CommandGroup>
                      {pprTuriOption?.map((p) => (
                        <CommandItem
                          className="data-[selected=true]:bg-white/20 text-white"
                          key={p.id}
                          value={p.qisqachanomi} // Qidiruv nom bo'yicha ishlaydi
                          onSelect={() => {
                            setEdit((prev) => ({
                              ...prev,
                              ppr_turi: p.id, // editaga ID saqlanadi
                            }));
                            setOpenPpr(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              edit.ppr_turi === p.id
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

            {/* Comment */}
            <div className="space-y-2">
              <Label className={"text-white"}>Izoh </Label>
              <Textarea
                className="bg-white/10 dark:bg-white/10 border-white/30 text-white"
                placeholder="Izoh yozing..."
                value={edit.comment}
                onChange={(e) =>
                  setEdit((prev) => ({ ...prev, comment: e.target.value }))
                }
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="destructive"
                  className={"bg-white/30"}
                >
                  Bekor qilish
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleSubmit}>
                Saqlash
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
