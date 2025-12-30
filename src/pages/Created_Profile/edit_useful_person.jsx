import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEditRegisterMutation } from "@/services/api";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Edit_Useful_Person({ data, open, setOpen }) {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "",
    bekat_nomi: "",
    tuzilma_nomi: "",
    faoliyati: "",
    rahbari: "",
    passport_seriya: "",
    status: true,
  });

  const [editRegister, { isLoading }] = useEditRegisterMutation();

  useEffect(() => {
    if (data) {
      setForm({
        username: data.username || "",
        password: "",
        role: data.role || "",
        bekat_nomi: data.bekat_nomi || "",
        tuzilma_nomi: data.tarkibiy_tuzilma || "",
        faoliyati: data.faoliyati || "",
        rahbari: data.rahbari || "",
        passport_seriya: data.passport_seriya || "",
        status: data.status ?? true,
      });
    }
  }, [data]);

  const stations = [
    "Beruniy",
    "Tinchlik",
    "Chorsu",
    "Gʻafur Gʻulom",
    "Alisher Navoiy",
    "Abdulla Qodiriy",
    "Pushkin",
    "Buyuk Ipak Yoʻli",
    "Novza",
    "Milliy bogʻ",
    "Xalqlar doʻstligi",
    "Chilonzor",
    "Mirzo Ulugʻbek",
    "Olmazor",
    "Doʻstlik",
    "Mashinasozlar",
    "Toshkent",
    "Oybek",
    "Kosmonavtlar",
    "Oʻzbekiston",
    "Hamid Olimjon",
    "Mingoʻrik",
    "Yunus Rajabiy",
    "Shahriston",
    "Bodomzor",
    "Minor",
    "Turkiston",
    "Yunusobod",
    "Tuzel",
    "Yashnobod",
    "Texnopark",
    "Sergeli",
    "Choshtepa",
    "Turon",
    "Chinor",
    "Yangiobod",
    "Rohat",
    "Oʻzgarish",
    "Yangihayot",
    "Qoʻyliq",
    "Matonat",
    "Qiyot",
    "Tolariq",
    "Xonobod",
    "Quruvchilar",
    "Olmos",
    "Paxtakor",
    "Qipchoq",
    "Amir Temur xiyoboni",
    "Mustaqillik maydoni",
  ];

  const submit = async (e) => {
    e.preventDefault();

    const body = new FormData();
    Object.entries(form).forEach(([k, v]) => body.append(k, v ?? ""));

    await toast.promise(editRegister({ id: data?.id, body }).unwrap(), {
      loading: "Saqlanmoqda...",
      success: "Foydalanuvchi muvaffaqiyatli saqlandi",
      error: "Xatolik yuz berdi",
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Foydalanuvchini tahrirlash</DialogTitle>
          <DialogDescription>
            Quyidagi ma’lumotlarni yangilashingiz mumkin
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={submit}
          className="flex-1 overflow-y-auto pr-2 space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* USERNAME */}
            <div className="space-y-1">
              <Label>Foydalanuvchi nomi</Label>
              <Input
                className="h-10"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>

            {/* FIO */}
            <div className="space-y-1">
              <Label>FIO</Label>
              <Input
                className="h-10"
                value={form.rahbari}
                onChange={(e) => setForm({ ...form, rahbari: e.target.value })}
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-1 ">
              <Label>Yangi parol (ixtiyoriy)</Label>
              <div className="relative ">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="h-10 pr-10 border-red-500"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ROLE */}
            <div className="space-y-1">
              <Label>Rol</Label>
              <Select
                value={form.role}
                onValueChange={(v) =>
                  setForm({
                    ...form,
                    role: v,
                    bekat_nomi: "",
                    tuzilma_nomi: "",
                  })
                }
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Rolni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bekat">Bekat rahbari</SelectItem>
                  <SelectItem value="tarkibiy">
                    Tarkibiy tuzilma rahbari
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* CONDITIONAL */}
            {form.role === "bekat" && (
              <div className="space-y-1">
                <Label>Bekat</Label>
                <Select
                  value={form.bekat_nomi || "none"} // default value "none"
                  onValueChange={(v) =>
                    setForm({ ...form, bekat_nomi: v === "none" ? "" : v })
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Bekatni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Bekatni o‘chirish</SelectItem>
                    {stations.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* FAOLIYATI */}
            <div className="space-y-1">
              <Label>Faoliyati</Label>
              <Input
                className="h-10"
                value={form.faoliyati}
                onChange={(e) =>
                  setForm({ ...form, faoliyati: e.target.value })
                }
              />
            </div>
          </div>

          {/* STATUS */}
          <div className="space-y-2">
            <Label>Faollashtirasizmi?</Label>
            <RadioGroup
              value={String(form.status)}
              onValueChange={(v) => setForm({ ...form, status: v === "true" })}
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="true" />
                <Label>Ha</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="false" />
                <Label>Yo‘q</Label>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter className="sticky bottom-0 bg-background pt-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 animate-spin" />}
              Saqlash
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Bekor qilish
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
