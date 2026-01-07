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
import { useAddRegister2Mutation } from "@/services/api";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function Post_Monitoring_Useful_Person() {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    role: "monitoring",
    username: "",
    password: "",
    faoliyati: "",
    rahbari: "",
    status: true,
  });
  const [addMonitoring, { isLoading, isError, error }] =
    useAddRegister2Mutation();
  useEffect(() => {
    if (isError) console.log(error);

    if (error?.data?.username)
      toast.warning("Foydalanuvchi nomini yozmadingiz!");

    if (error?.data?.password) toast.warning("Parolni yozmadingiz!");

    if (error?.data?.faoliyati) toast.warning("Faoliyatni yozmadingiz!");

    if (error?.data?.rahbari) toast.warning("FIOni yozmadingiz!");
  }, [isError, error]);
  const clearForm = () =>
    setForm({
      role: "monitoring",
      username: "",
      password: "",
      faoliyati: "",
      rahbari: "",
      status: true,
    });
  const addUser = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));

    await toast.promise(addMonitoring({ body: fd }).unwrap(), {
      loading: "Saqlanmoqda...",
      success: "Foydalanuvchi muvaffaqiyatli qo‘shildi",
      error: "Xatolik yuz berdi",
    });

    clearForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Monitoring <UserPlus />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Monitoring yaratish</DialogTitle>
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
