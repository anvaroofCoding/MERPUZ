import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddRegisterMutation } from "@/services/api";
import { format, isValid, parseISO } from "date-fns";
import { ChevronDownIcon, Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
export function Post_Useful_Person() {
  const [openDate, setOpenDate] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "",
    bekat_nomi: "",
    birth_date: "",
    tuzilma_nomi: "",
    faoliyati: "",
    rahbari: "",
    passport_seriya: "",
    status: true,
    photo: null,
  });
  const [addRegister, { isLoading, isError, error }] = useAddRegisterMutation();
  const clearForm = () => {
    setForm({
      username: "",
      password: "",
      role: "",
      bekat_nomi: "",
      tuzilma_nomi: "",
      birth_date: "",
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
  const dateObj = form.birth_date ? parseISO(form.birth_date) : null;

  // oldini olamiz
  if (dateObj && !isValid(dateObj)) {
    console.log("INVALID DATE:", form.birth_date);
    toast.error("Sana noto‘g‘ri formatda kiritilgan!");
  }
  if (isError) {
    console.log(error);
  }

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
            <Label htmlFor="birth_date" className="mb-1">
              Tug‘ilgan sana
            </Label>

            <Popover open={openDate} onOpenChange={setOpenDate}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="birth_date"
                  className="w-full justify-between font-normal"
                >
                  {dateObj
                    ? format(dateObj, "dd.MM.yyyy") // UI format
                    : "Sanani tanlang"}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={dateObj}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    if (date) {
                      const isoFormat = format(date, "dd-MM-yyyy");
                      setForm({ ...form, birth_date: isoFormat });
                      console.log(isoFormat);
                    }
                    setOpenDate(false);
                  }}
                />
              </PopoverContent>
            </Popover>

            {/* Test uchun chiqarib ko‘rish */}
            {/* <p>API format: {form.birth_date}</p> */}
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
