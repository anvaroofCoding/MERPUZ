import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEditRegisterMutation } from "@/services/api";
import { format } from "date-fns";
import { ChevronDown, Loader2 } from "lucide-react";
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
  const [openDate, setOpenDate] = useState(false);
  const dateObj = form.birth_date ? new Date(form.birth_date) : null;
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
        birth_date: data.birth_date || "",
      });
    }
  }, [data]);
  const [editRegister, { isLoading, isError, error }] =
    useEditRegisterMutation();
  if (isError) console.log(error);
  const clearForm = () => {
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
  };
  const addUser = async (e) => {
    e.preventDefault();
    if (!form.username || !form.rahbari || !form.role) {
      toast.error("Barcha majburiy maydonlarni to'ldiring!");
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Email manzil noto'g'ri!");
      return;
    }
    if (!/^[\w.@+-]+$/.test(form.username)) {
      toast.error(
        "Foydalanuvchi nomi faqat harflar, raqamlar va @/./+/-/_ belgilari o'z ichiga olishi mumkin!",
      );
      return;
    }
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      // Don't send empty password or nullable empty fields
      if (key === "password" && !value) return;
      if (value !== undefined && value !== null && value !== "") {
        body.append(key, value);
      }
    });
    try {
      await toast.promise(editRegister({ body, id: data?.id }).unwrap(), {
        loading: "Saqlanmoqda...",
        success: "Foydalanuvchi muvaffaqiyatli saqlandi!",
        error: (err) => {
          console.log(err);
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
        <DialogHeader>
          <DialogTitle>Foydalanuvchini ma'lumotlarni tahrirlash</DialogTitle>
          <DialogDescription>
            Barcha ma'lumotlarni qayta yangilash imkoniyati bor. Faqat siz
            bergan dostupga ko'ra dasturdan foydalana oladi, unutmang!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={addUser} className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="username" className="mb-1">
              Foydalanuvchi nomi *
            </Label>
            <Input
              id="username"
              placeholder="Foydalanuvchi nomini yozing"
              required
              className="w-full"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              maxLength={150}
            />
            <p className="text-xs text-muted-foreground">
              150 belgigacha. Harflar, raqamlar va @/./+/-/_ belgilari.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="rahbari" className="mb-1">
              FIO (To'liq ismi) *
            </Label>
            <Input
              id="rahbari"
              placeholder="FIOni yozing"
              required
              className="w-full"
              value={form.rahbari}
              onChange={(e) => setForm({ ...form, rahbari: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="passport_seriya" className="mb-1">
              Pasport seriya (AB1234567)
            </Label>
            <Input
              id="passport_seriya"
              placeholder="Pasport seriyani yozing"
              className="w-full"
              value={form.passport_seriya}
              onChange={(e) =>
                setForm({ ...form, passport_seriya: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="birth_date" className="mb-1">
              Tug'ilgan sana
            </Label>

            <Popover open={openDate} onOpenChange={setOpenDate}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  id="birth_date"
                  className="w-full justify-between font-normal bg-transparent"
                >
                  {dateObj ? format(dateObj, "dd.MM.yyyy") : "Sanani tanlang"}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={dateObj}
                  onSelect={(date) => {
                    if (date) {
                      const isoFormat = format(date, "yyyy-MM-dd");
                      setForm({ ...form, birth_date: isoFormat });
                    }
                    setOpenDate(false);
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="email" className="mb-1">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              className="w-full"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="password" className="mb-1">
              Parolni o'zgartiring
            </Label>
            <Input
              id="password"
              placeholder="Yangi parolni yozing"
              type="password"
              className="w-full"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Bo'sh qoldirish mumkin emas!
            </p>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saqlanmoqda...
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
