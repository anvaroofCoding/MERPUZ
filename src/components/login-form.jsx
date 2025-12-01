import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLoginMutation } from "@/services/api";
import { toast } from "sonner";

export function LoginForm({ className, ...props }) {
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
        navigate("/");
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
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Xush kelibsiz!</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Foydalanuvchi nomi va parolingizni yozib kiring
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="text">Foydalanuvchi nomi</FieldLabel>
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
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Parol</FieldLabel>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              required
              className="pr-10"
              value={form.password}
              placeholder="Parol"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
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
        </Field>
        <Field>
          <Button type="submit" onClick={LoginHandle} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
            ) : null}
            Kirish
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <FieldDescription className="text-center">
            Login yoki parolingizni unutsingizmi?{" "}
            <Link to="/forgot-login" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
