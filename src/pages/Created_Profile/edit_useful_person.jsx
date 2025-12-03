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
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export function Edit_Useful_Person({ data, open, setOpen }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "",
    bekat_nomi: "",
    tuzilma_nomi: "",
    faoliyati: "",
    rahbari: "",
    passport_seriya: "",
    status: "",
  });
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
        passport_seriya: data.passport_seriya || true,
        status: data.status ?? true, // agar boolean bo‘lsa
      });
    }
  }, [data]);
  const [editRegister, { isLoading, isError, error }] =
    useEditRegisterMutation();
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
    });
  };
  const addUser = async (e) => {
    e.preventDefault();
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        body.append(key, value);
      }
    });
    try {
      await toast.promise(editRegister({ body, id: data?.id }).unwrap(), {
        loading: "Saqlanmoqda...",
        success: "Foydalanuvchi muvaffaqiyatli saqlandi!",
        error: (err) => {
          // console.error(err);
          return `Xatolik yuz berdi: ${
            err?.data?.detail || err.message
          }. Qaytadan urinib ko'ring!`;
        },
      });

      clearForm();
      setOpen(false);
    } catch (err) {
      console.error(err);
      clearForm();
    }
  };
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
  if (isError) {
    console.log(error);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Foydalanuvchini ma'lumotlarni tahrirlash</DialogTitle>
          <DialogDescription>
            Barcha ma'lumotlarni qayta yangilash imkoniyati bor. Faqat siz
            bergan dostupga ko'ra dasturdan foydalana oladi, unutmang!
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
              Parolni yozishingiz shart! Yoki yangi parolni
            </Label>
            <Input
              id="password"
              placeholder="Parolni yozing"
              required
              type="password"
              className="w-full"
              value={form.password}
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

              <Select
                value={form.bekat_nomi}
                onValueChange={(value) =>
                  setForm({ ...form, bekat_nomi: value })
                }
              >
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Bekatni tanlang" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="yo'q">Bekatni o'chirish</SelectItem>
                  {stations?.map((item) => {
                    return (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
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
              value={form.status ? "true" : "false"}
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
