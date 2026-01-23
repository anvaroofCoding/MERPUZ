import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginMutation } from "@/services/api";
import { IconBrandTelegram } from "@tabler/icons-react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function LoginsNewForm() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [show, setShow] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  async function LoginHandle() {
    try {
      const res = await login(form).unwrap();
      if (res.access) {
        localStorage.setItem("access", res.access);
        localStorage.setItem("refresh", res.refresh);
        localStorage.setItem("life", form.password);
        navigate("/Kompleks/Bosh sahifa/Kompleks Dashboard");
      } else {
        toast.error("login yoki parol xato yozilgan!");
      }
    } catch (error) {
      console.log(error);
      if (error.data.password) {
        toast.error("Parolingizni yozing");
      }
      if (error.data.username) {
        toast.error("Foydalanuvchi nomini yozing");
      }
      if (error.status == "401") {
        toast.error("Foydalanuvchi nomi yoki Paroli xato yozilgan!");
      }
    }
  }
  return (
    <Card
      className="
        relative w-[350px] overflow-hidden
        bg-white/20 backdrop-blur-xl border border-white/30
        shadow-lg rounded-2xl
        dark:bg-gray-900/30 dark:border-gray-700/40
        transition-all duration-300
      "
    >
      <CardHeader>
        <CardTitle className="text-white">Kirish</CardTitle>
        <CardDescription className="text-white/70">
          Shaxsiy hisobingizga kirish uchun foydalanuvchi nomi va parolingizni
          kiriting.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email" className="text-white/80">
                Foydalanuvchi nomi
              </Label>
              <Input
                id="text"
                type="text"
                placeholder="Foydalanuvchi nomi"
                required
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                value={form.username}
                className="bg-white/10 text-white placeholder-white/50 border-white/30 focus:border-white/50 focus:ring-white/20"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password" className="text-white/80">
                Parol
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  required
                  className="pr-10 bg-white/10 text-white placeholder-white/50 border-white/30 focus:border-white/50 focus:ring-white/20"
                  value={form.password}
                  placeholder="Parol"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <Button
                  type="button"
                  variant="link"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-white/80"
                  onClick={() => setShow((prev) => !prev)}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button
          onClick={() => LoginHandle(form)}
          disabled={isLoading}
          className="bg-white/20 text-white hover:bg-white/30 border border-white/30"
        >
          Kirish
          {isLoading ? (
            <Loader2 className="animate-spin ml-2 h-4 w-4" />
          ) : (
            <IconBrandTelegram stroke={2} className="ml-2" />
          )}
        </Button>
      </CardFooter>

      {/* Glass beam effect */}
      <BorderBeam
        duration={8}
        size={100}
        className="absolute -top-20 -left-20 opacity-50"
      />
    </Card>
  );
}
