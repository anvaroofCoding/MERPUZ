import { Loader2, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAddRegisterMutation } from "@/services/api";
import { toast } from "sonner";
export function Post_Useful_Person() {
  const [open, setOpen] = useState(false);
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
    photo: null,
  });
  const [addRegister, { isLoading }] = useAddRegisterMutation();

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
      photo: null,
    });
  };
  const addUser = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) fd.append(key, value);
    });
    try {
      await toast.promise(addRegister(fd).unwrap(), {
        loading: "Saqlanmoqda...",
        success: "Foydalanuvchi muvaffaqiyatli qo'shildi!",
        error: (err) =>
          `Xatolik yuz berdi: ${
            err?.data?.detail || err.message
          }. Qaytadan urinib ko'ring ma'lumotlarni to'g'ri kiritishingizni so'raymiz!`,
      });
      clearForm();
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Qo'shish <UserPlus />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Foydalanuvchini qo'shish</DialogTitle>
          <DialogDescription>
            Barcha ma'lumotlarni to'ldiring va yangi foydalanuvchini ro'yxatga
            olib dasturdan foydalanish imkoniyatini berasiz. Faqat siz bergan
            dostupga ko'ra dasturdan foydalana oladi, unutmang!
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="username" className="mb-1">
              Foydalanuvchi nomi
            </Label>
            <Input
              id="username"
              placeholder="Foydalanuvchi nomini yozing"
              required
              className="w-full"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="rahbari" className="mb-1">
              FIO
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
              required
              className="w-full"
              value={form.passport_seriya}
              onChange={(e) =>
                setForm({ ...form, passport_seriya: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="password" className="mb-1">
              Parol
            </Label>
            <Input
              id="password"
              placeholder="Parolni yozing"
              required
              type="password"
              className="w-full"
              value={form.passport_sepasswordriya}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="role" className="mb-1">
              Rol
            </Label>

            <Select
              value={form.role}
              onValueChange={(value) => setForm({ ...form, role: value })}
            >
              <SelectTrigger id="role" className="w-full">
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

          {form.role == "bekat" ? (
            <div className="flex flex-col gap-1">
              <Label htmlFor="bekat_nomi" className="mb-1">
                Bekat nomi
              </Label>
              <Input
                id="bekat_nomi"
                placeholder="Bekat nomini yozing"
                required
                className="w-full"
                disabled={!form.role}
                value={form.bekat_nomi}
                onChange={(e) =>
                  setForm({ ...form, bekat_nomi: e.target.value })
                }
              />
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <Label htmlFor="tuzilma_nomi" className="mb-1">
                Tarkibiy tuzilma nomi
              </Label>
              <Input
                id="tuzilma_nomi"
                placeholder="Tarkibiy tuzilma nomini yozing"
                required
                className="w-full"
                disabled={!form.role}
                value={form.tuzilma_nomi}
                onChange={(e) =>
                  setForm({ ...form, tuzilma_nomi: e.target.value })
                }
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <Label htmlFor="faoliyati" className="mb-1">
              Faolyati
            </Label>
            <Input
              id="faoliyati"
              placeholder="Faoliyatini yozing"
              required
              className="w-full"
              value={form.faoliyati}
              onChange={(e) => setForm({ ...form, faoliyati: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="status">
              Bu foydalanuvchini faollashtirasizmi?
            </Label>

            <RadioGroup
              id="status"
              defaultValue="true"
              onValueChange={(value) =>
                setForm({ ...form, status: value === "true" })
              }
              className="flex items-center gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="r1" />
                <Label htmlFor="r1">Ha</Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="r2" />
                <Label htmlFor="r2">Yo'q</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="photo">Fayl yuklang</Label>

            <Input
              id="photo"
              type="file"
              accept="image/*,application/pdf"
              className="cursor-pointer"
              onChange={(e) => setForm({ ...form, photo: e.target.files[0] })}
            />
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button type="submit" onClick={addUser}>
            {isLoading ? (
              <span className="flex items-center justify-center gap-3">
                <span>Saqlanmoqda...</span>
                <Loader2 className="animate-spin" />
              </span>
            ) : (
              "Saqlash"
            )}
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Bekor qilish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
