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
    <Card className="relative w-[350px] overflow-hidden">
      <CardHeader>
        <CardTitle>Kirish</CardTitle>
        <CardDescription>
          Shaxsiy hisobingizga kirish uchun foydalanuvchilar nomi va
          parolingizni kiriting.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Foydalanuvchi nomi</Label>
              <Input
                id="text"
                type="text"
                placeholder="Foydalanuvchi nomi"
                required
                onChange={(e) => {
                  setForm({ ...form, username: e.target.value });
                }}
                value={form.username}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Parol</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  required
                  className="pr-10"
                  value={form.password}
                  placeholder="Parol"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
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
        <Button onClick={LoginHandle} disabled={isLoading}>
          Kirish
          {isLoading ? (
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
          ) : (
            <IconBrandTelegram stroke={2} />
          )}
        </Button>
      </CardFooter>
      <BorderBeam duration={8} size={100} />
    </Card>
  );
}
