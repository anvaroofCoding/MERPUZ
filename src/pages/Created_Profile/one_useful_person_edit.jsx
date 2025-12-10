import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEditRegisterMutation } from "@/services/api";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function EditUserForm({ data, open, setOpen }) {
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
    birth_date: "",
    email: "",
  });

  function convertToISO(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return "";
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }
  useEffect(() => {
    if (data) {
      setForm({
        username: data.username || "",
        password: "",
        role: data.role || "",
        bekat_nomi: data.bekat_nomi || "",
        tuzilma_nomi: data.tuzilma_nomi || "",
        faoliyati: data.faoliyati || "",
        rahbari: data.rahbari || "",
        passport_seriya: data.passport_seriya || "",
        status: data.status ?? true,
        email: data.email || "",
        birth_date: convertToISO(data.birth_date), // FIXED
      });
    }
  }, [data]);

  const [editRegister, { isLoading, isError, error }] =
    useEditRegisterMutation();
  if (isError) console.log(error);

  const clearForm = () =>
    setForm({
      username: "",
      password: "",
      role: "",
      bekat_nomi: "",
      tuzilma_nomi: "",
      faoliyati: "",
      rahbari: "",
      passport_seriya: "",
      status: true,
      email: "",
      birth_date: "",
    });

  const addUser = async (e) => {
    e.preventDefault();

    // Required fields
    if (!form.username || !form.rahbari || !form.role) {
      toast.error("Barcha majburiy maydonlarni to'ldiring!");
      return;
    }

    // Email validation
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Email manzil noto'g'ri!");
      return;
    }

    // Username validation
    if (!/^[\w.@+-]+$/.test(form.username)) {
      toast.error("Foydalanuvchi nomida ruxsat berilmagan belgi bor!");
      return;
    }

    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "password" && !value) return;
      if (value !== null && value !== "" && value !== undefined) {
        body.append(key, value);
      }
    });

    try {
      await toast.promise(editRegister({ body, id: data?.id }).unwrap(), {
        loading: "Saqlanmoqda...",
        success: "Foydalanuvchi muvaffaqiyatli saqlandi!",
        error: (err) => {
          console.log(err);
          return "Xatolik yuz berdi!";
        },
      });

      clearForm();
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* <DialogHeader>
          <DialogTitle>Foydalanuvchi ma'lumotlarini tahrirlash</DialogTitle>
          <DialogDescription>
            Barcha ma’lumotlarni qayta yangilashingiz mumkin.
          </DialogDescription>
        </DialogHeader> */}

        <form onSubmit={addUser} className="flex flex-col gap-4 mt-4">
          {/* username */}
          <div className="flex flex-col gap-1">
            <Label>Foydalanuvchi nomi *</Label>
            <Input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              maxLength={150}
              placeholder="Foydalanuvchi nomi"
            />
          </div>

          {/* FIO */}
          <div className="flex flex-col gap-1">
            <Label>FIO *</Label>
            <Input
              value={form.rahbari}
              onChange={(e) => setForm({ ...form, rahbari: e.target.value })}
              required
              placeholder="To'liq ismi"
            />
          </div>

          {/* Pasport */}
          <div className="flex flex-col gap-1">
            <Label>Pasport seriya</Label>
            <Input
              value={form.passport_seriya}
              onChange={(e) =>
                setForm({ ...form, passport_seriya: e.target.value })
              }
              placeholder="AB1234567"
            />
          </div>

          {/* Birth date (fixed) */}
          <div className="flex flex-col gap-1">
            <Label>Tug‘ilgan sana</Label>
            <Input
              type="date"
              value={form.birth_date || ""}
              onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@example.com"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <Label>Parolni o'zgartirish</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Yangi parol"
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Saqlanmoqda...
                </span>
              ) : (
                "Saqlash"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Bekor qilish
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
