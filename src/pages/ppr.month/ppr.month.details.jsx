import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeletePPRMonthMutation,
  usePPRbajarildiPOSTMutation,
  usePprMonthDetailsQuery,
} from "@/services/api";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  List,
  Loader,
  Loader2,
  LockKeyhole,
  Plus,
  Send,
  Trash2,
  Upload,
  Wrench,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import EditPPRMonth from "./edit.ppr.month";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { IconDownload, IconX } from "@tabler/icons-react";
import { UniqueAccordion } from "@/components/interactive-accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function PprMonthDetails() {
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const { data, isLoading } = usePprMonthDetailsQuery(id);
  const [deletePPR, { isLoading: loads }] = useDeletePPRMonthMutation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    jadval: null,
    bajarilgan_obyektlar: [],
    comment: "",
    file: "",
    images: [],
  });

  const isToday = (dateString) => {
    const today = new Date();
    const inputDate = new Date(dateString);

    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    return inputDate <= today;
  };

  const getRemainingDays = (dateString) => {
    const today = new Date();
    const target = new Date(dateString);

    // vaqtni 00:00:00 qilish (soat ta’sir qilmasligi uchun)
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffTime = target - today; // millisekund
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays;
  };

  const [postPpr, { isLoading: postPprLoadin }] = usePPRbajarildiPOSTMutation();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="rounded-2xl">
            <CardHeader>
              <Skeleton className="h-5 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const submit = async () => {
    try {
      const formData = new FormData();

      formData.append("jadval", id);
      formData.append("comment", form.comment);

      // array yuborish
      form.bajarilgan_obyektlar.forEach((ids) => {
        formData.append("bajarilgan_obyektlar", ids);
      });

      // file
      if (form.file) {
        formData.append("file", form.file);
      }

      // images (agar multiple bo‘lsa)
      form.images.forEach((img) => {
        formData.append("images", img);
      });

      await postPpr(formData).unwrap();

      setForm({
        jadval: null,
        bajarilgan_obyektlar: [],
        comment: "",
        file: "",
        images: [],
      });

      toast.success("Ma'lumot muvaffaqiyatli yuborildi");
    } catch (error) {
      console.log(error);
      toast.error("Xatolik yuz berdi");
    } finally {
      setOpen(false);
    }
  };

  if (!data) return null;

  const status = [
    { name: "Hammasi", value: "all", icon: List },
    { name: "Tasdiqlandi", value: "tasdiqlandi", icon: CheckCircle2 },
    { name: "Rad etildi", value: "rad_etildi", icon: XCircle },
    { name: "Yuborildi", value: "yuborildi", icon: Send },
    { name: "Bajarildi", value: "bajarildi", icon: CheckCircle2 },
    { name: "Jarayonda", value: "jarayonda", icon: Loader },
  ];

  const getVariant = (status) => {
    switch (status) {
      case "tasdiqlandi":
        return "success";
      case "rad_etildi":
        return "destructive";
      case "yuborildi":
        return "secondary";
      case "jarayonda":
        return "warning";
      case "bajarildi":
        return "success";

      default:
        return "default";
    }
  };

  const currentStatus = status.find((s) => s.value === data?.status);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removePhoto = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleBildirgiUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        file: file,
      });
    }
  };

  const todayStatus = isToday(data?.sana);
  const daysLeft = getRemainingDays(data?.sana);

  return (
    <div>
      <Field className="w-full mb-5">
        <FieldLabel htmlFor="progress-upload">
          <span>Ish jarayoni ko'rsatgichi</span>
          <span className="ml-auto">{data?.umumiy_foiz}%</span>
        </FieldLabel>
        <Progress value={data?.umumiy_foiz} id="progress-upload" />
      </Field>
      <Card className="border shadow-sm hover:shadow-md transition-all duration-300">
        {/* ================= HEADER ================= */}
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            {/* LEFT INFO */}
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold tracking-tight">
                {data?.bolim_nomi}
              </CardTitle>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{data?.sana}</span>
                <span>•</span>
                <Badge variant="secondary" className="text-xs">
                  {data?.ppr_turi_name}
                </Badge>
              </div>
            </div>

            {/* STATUS BADGE */}
            <Badge
              variant={getVariant(data?.status)}
              className="flex items-center gap-1 px-3 py-1 text-xs"
            >
              {currentStatus?.icon && (
                <currentStatus.icon className="w-3 h-3" />
              )}
              {currentStatus?.name}
            </Badge>
          </div>

          {data?.comment && (
            <CardDescription className="text-sm leading-relaxed">
              {data?.comment}
            </CardDescription>
          )}
        </CardHeader>

        {/* ================= CONTENT ================= */}
        <CardContent className="space-y-4">
          <div className="text-sm font-medium">
            PPR o'tkaziladigan obyektlar
          </div>

          <div className="grid sm:grid-cols-2 gap-2">
            {data?.obyektlar?.map((sts) => (
              <div
                key={sts.id}
                className="flex items-center gap-2 rounded-md border px-3 py-2 bg-muted/30 hover:bg-muted/50 transition"
              >
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm">{sts.obyekt_nomi}</span>
              </div>
            ))}
          </div>
        </CardContent>

        {/* ================= FOOTER ================= */}
        <CardFooter className={"flex justify-end "}>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              {todayStatus ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-block w-fit">
                      <Button
                        size="sm"
                        className="flex gap-2"
                        disabled={data?.umumiy_foiz == 100}
                        onClick={() => setOpen(true)}
                      >
                        Ro'yxatga olish <PlusCircledIcon size={18} />
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    PPRni 100% bajarsangiz qayta ro'yxatga olmaysiz
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-block w-fit">
                      <Button size="sm" className="flex gap-2" disabled>
                        {daysLeft > 0 && `${daysLeft} kun qoldi`}
                        {daysLeft === 0 && "Bugun"}
                        {daysLeft < 0 && `${Math.abs(daysLeft)} kun o'tgan`}
                        <LockKeyhole size={18} />
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    PPR vaqti kelgandan keyin ro'yxatga olish mumkin
                  </TooltipContent>
                </Tooltip>
              )}
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
              {/* HEADER */}
              <DialogHeader className="px-6 pt-6 pb-4 border-b bg-muted/40">
                <DialogTitle className="text-lg font-semibold">
                  Ro'yxatga olish
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Bugungi bajarilgan ishlar bo‘yicha hisobotni to‘ldiring.
                </DialogDescription>
              </DialogHeader>

              {/* BODY */}
              <div className="px-6 py-6 space-y-6 max-h-[65vh] overflow-y-auto">
                {/* OBYEKT SECTION */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    Bajarilgan obyektlar
                  </Label>

                  <div className="grid grid-cols-2 gap-3">
                    {data?.obyektlar?.map((ins) => {
                      const stepObjectIds =
                        data?.steps?.flatMap(
                          (step) => step.bajarilgan_obyektlar,
                        ) || [];

                      const isChecked = form.bajarilgan_obyektlar.includes(
                        ins.id,
                      );
                      const isDisabled = stepObjectIds.includes(ins.id);

                      return (
                        <label
                          key={ins.id}
                          className={`
                  flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all
                  ${isChecked ? "border-primary bg-primary/5" : "hover:bg-muted/50"}
                  ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
                        >
                          <Checkbox
                            checked={isChecked}
                            disabled={isDisabled}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setForm((prev) => ({
                                  ...prev,
                                  bajarilgan_obyektlar: [
                                    ...prev.bajarilgan_obyektlar,
                                    ins.id,
                                  ],
                                }));
                              } else {
                                setForm((prev) => ({
                                  ...prev,
                                  bajarilgan_obyektlar:
                                    prev.bajarilgan_obyektlar.filter(
                                      (id) => id !== ins.id,
                                    ),
                                }));
                              }
                            }}
                          />
                          <span className="text-sm font-medium">
                            {ins.obyekt_nomi}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* IMAGES */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Rasmlar</Label>

                  <div className="flex flex-wrap gap-4">
                    <label className="flex flex-col items-center justify-center w-24 h-24 rounded-xl border-2 border-dashed border-primary/40 cursor-pointer hover:bg-primary/5 hover:border-primary transition-all">
                      <Plus className="w-6 h-6 text-primary" />
                      <span className="text-xs font-medium text-primary">
                        Qo'shish
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                      />
                    </label>

                    {form.images.map((photo, index) => (
                      <div
                        key={index}
                        className="relative group w-24 h-24 rounded-xl overflow-hidden border shadow-sm"
                      >
                        <img
                          src={URL.createObjectURL(photo)}
                          className="w-full h-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        >
                          <IconX size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {form.images.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      Rasmlar yuklanmagan
                    </p>
                  )}
                </div>

                {/* FILE */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    Fayl biriktirish
                  </Label>

                  <label className="flex items-center gap-3 px-4 py-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition">
                    <Upload size={18} className="text-muted-foreground" />
                    <span className="text-sm">
                      {form.file ? form.file.name : "Fayl tanlash"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                      onChange={handleBildirgiUpload}
                    />
                  </label>
                </div>

                {/* COMMENT */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Izoh</Label>
                  <Textarea
                    value={form.comment}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    placeholder="Bajarilgan ish haqida batafsil yozing..."
                    className="min-h-[110px] resize-none"
                  />
                </div>
              </div>

              {/* FOOTER */}
              <DialogFooter className="px-6 py-4 border-t bg-background sticky bottom-0">
                <Button
                  disabled={postPprLoadin}
                  onClick={submit}
                  className="w-full sm:w-auto"
                >
                  {postPprLoadin ? "Saqlanmoqda..." : "Saqlash"}
                  <IconDownload size={14} className="ml-2" />
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      <div className="w-full mt-10 rounded-xl">
        <UniqueAccordion items={data?.steps} />
      </div>
    </div>
  );
}
