import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAddBolumMutation } from "@/services/api";
import { IconUserPlus } from "@tabler/icons-react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Post_Bolum_Useful_Person({ id }) {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    tuzilma: id,
    bolim_nomi: "",
    username: "",
    password: "",
    faoliyati: "",
    rahbari: "",
    email: "",
    birth_date: "",
    passport_seriya: "",
    status: true,
  });
  const [addBolum, { isLoading, isError, error }] = useAddBolumMutation();
  const clearForm = () =>
    setForm({
      tuzilma: id,
      bolim_nomi: "",
      username: "",
      password: "",
      faoliyati: "",
      rahbari: "",
      email: "",
      birth_date: "",
      passport_seriya: "",
      status: true,
    });
  const addUser = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));

    await toast.promise(addBolum({ body: fd }).unwrap(), {
      loading: "Saqlanmoqda...",
      success: "Foydalanuvchi muvaffaqiyatli qo‘shildi",
      error: "Xatolik yuz berdi",
    });

    clearForm();
    setOpen(false);
  };
  if (isError) console.log(error);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Xodim
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Xodim yaratish</DialogTitle>
          <DialogDescription>
            Foydalanuvchi ma’lumotlarini to‘liq kiriting
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={addUser}
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

            {/* PASSWORD WITH EYE */}
            <div className="space-y-1">
              <Label>Parol</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  className="h-10 pr-10"
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

            <div className="space-y-1">
              <Label>Bo'lim nomi</Label>
              <Input
                className="h-10"
                value={form.bolim_nomi}
                onChange={(e) =>
                  setForm({ ...form, bolim_nomi: e.target.value })
                }
              />
            </div>

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
