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
import { useEditBolumMutation, useEditRegisterMutation } from "@/services/api";
import { Eye, EyeOff, Loader2, Send } from "lucide-react";
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

  const [editRegister, { isLoading, isError: err1 }] =
    useEditRegisterMutation();
  const [EditBolum, { isLoading: bolumLoading, isError, error }] =
    useEditBolumMutation();

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
  useEffect(() => {
    if (err1) {
      if (err1?.data?.username) {
        toast.warning("Foydalanuvchi nomini yozmadingiz!");
      }
      if (err1?.data?.password) {
        toast.warning("Parol yozmadingiz yozmadingiz!");
      }
      if (err1?.data?.rahbari) {
        toast.warning("FIOni yozmadingiz!");
      }
      if (err1?.data?.faoliyati) {
        toast.warning("Faoliyatini yozmadingiz!");
      }
    }
  }, [err1]);
  useEffect(() => {
    if (isError) {
      if (error?.data?.username) {
        toast.warning("Foydalanuvchi nomini yozmadingiz!");
      }
      if (error?.data?.password) {
        toast.warning("Parol yozmadingiz yozmadingiz!");
      }
      if (error?.data?.rahbari) {
        toast.warning("FIOni yozmadingiz!");
      }
      if (error?.data?.faoliyati) {
        toast.warning("Faoliyatini yozmadingiz!");
      }
    }
  }, [error, isError]);

  const submit = async (e) => {
    e.preventDefault();
    const Allbody = new FormData();
    Object.entries(form).forEach(([k, v]) => Allbody.append(k, v ?? ""));
    if (data?.role == "bolim") {
      const bolimDate = new FormData();
      bolimDate.append("tuzilma", data?.tarkibiy_tuzilma_id);
      bolimDate.append("bolim_nomi", data?.bolim_nomi);
      bolimDate.append("username", form.username);
      bolimDate.append("password", form.password);
      bolimDate.append("faoliyati", form.faoliyati);
      bolimDate.append("rahbari", form.rahbari);
      bolimDate.append("status", form.status);
      await toast.promise(
        EditBolum({ id: data?.bolim_id, body: bolimDate }).unwrap(),
        {
          loading: "Saqlanmoqda...",
          success: "Foydalanuvchi muvaffaqiyatli saqlandi",
          error: "Xatolik yuz berdi",
        },
      );
    } else {
      await toast.promise(
        editRegister({ id: data?.id, body: Allbody }).unwrap(),
        {
          loading: "Saqlanmoqda...",
          success: "Foydalanuvchi muvaffaqiyatli saqlandi",
          error: "Xatolik yuz berdi",
        },
      );
    }
    setOpen(false);
  };
  const renderRole = (role) => {
    switch (role) {
      case "admin":
        return "Adminni";
      case "monitoring":
        return "Monitoringni";
      case "tarkibiy":
        return "Tarkibiy Tuzilma Rahbarini";
      case "bekat":
        return "Bekat Rahbarini";
      case "bolim":
        return "Xodimni";
      default:
        return "Noma'lum";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{renderRole(data?.role)} tahrirlash</DialogTitle>
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
            <Button type="submit" disabled={isLoading || bolumLoading}>
              {isLoading || bolumLoading ? (
                <Loader2 className="mr-1 animate-spin" />
              ) : (
                <Send className="mr-1" />
              )}
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
