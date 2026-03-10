import SegmentedButtonGroup from "@/components/ruixen/segmented-button-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useChangeComingAplicationMutation, useMEQuery } from "@/services/api";
import { Check, CloudDownload, Loader, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
export default function Coming_Application_Details_Work_Pogress({ data }) {
  console.log(data);
  const [openShet, setOpenShet] = useState(false);
  const { data: me } = useMEQuery();
  const [form, setForm] = useState({
    comment: "",
    status: "bajarilmoqda",
    ilovalar: null,
    akt_file: null,
  });

  const statusOptions = [
    { label: "Qaytarish", value: "qaytarildi" },
    { label: "Bajarilmoqda", value: "bajarilmoqda" },
    { label: "Tasdiqlanmoqda", value: "tasdiqlanmoqda" },
  ];
  const statusOptions3 = [
    { label: "Bajarilmoqda", value: "bajarilmoqda" },
    { label: "Tasdiqlanmoqda", value: "tasdiqlanmoqda" },
  ];
  const statusOptions1 = [{ label: "Tasdiqlanmoqda", value: "tasdiqlanmoqda" }];
  const [ChangeComingApplication, { isLoading: isLoadingComing }] =
    useChangeComingAplicationMutation();
  const isFormComplete = () => form.comment.trim() !== "";
  const submitForm = async () => {
    const fd = new FormData();
    fd.append("comment", form.comment);
    fd.append("ariza", data?.id);
    data?.status == "tasdiqlanmoqda" || data?.status == "rad_etildi"
      ? fd.append("holat", "tasdiqlanmoqda")
      : fd.append("holat", form.status);
    if (form.akt_file) fd.append("akt_file", form.akt_file);
    if (form.ilovalar) fd.append("ilovalar", form.ilovalar);
    await toast.promise(ChangeComingApplication({ body: fd }).unwrap(), {
      loading: "Yuborilmoqda...",
      success: "Yuborildi!",
      error: "Xatolik!",
    });
    setForm({
      comment: "",
      status: "",
      akt_file: null,
      ilovalar: null,
    });
    setOpenShet(false);
  };

  const handleDownloadFile = async (url, filename = "file") => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteShetInformation = () => {
    setForm({
      comment: "",
      status: "",
      akt_file: null,
      ilovalar: null,
    });
    setOpenShet(false);
  };
  return (
    <div className="flex flex-col gap-3 w-full mx-auto px-2">
      {/* CHAT MESSAGES */}
      {data?.kelganlar?.map((step) => {
        const d = new Date(step.sana);
        const months = [
          "yanvar",
          "fevral",
          "mart",
          "aprel",
          "may",
          "iyun",
          "iyul",
          "avgust",
          "sentabr",
          "oktabr",
          "noyabr",
          "dekabr",
        ];
        const formattedDate = `${d.toLocaleTimeString("uz-UZ", {
          hour: "2-digit",
          minute: "2-digit",
        })} ${d.getDate()}-${months[d.getMonth()]} ${d.getFullYear()}-yil`;
        const isMe = step.created_by === me?.username;

        return (
          <div
            key={step.id}
            className={`flex w-full px-3 mb-2 ${
              isMe ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`
        relative max-w-[78%] px-4 py-2 rounded-2xl text-sm shadow-sm
        ${
          isMe
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 rounded-bl-md border"
        }
      `}
            >
              {/* Sender */}
              {!isMe && (
                <p className="text-[12px] font-semibold text-primary mb-1">
                  {step.created_by}
                </p>
              )}

              {/* TEXT */}
              {step.comment && (
                <p className="whitespace-pre-wrap break-words leading-relaxed">
                  {step.comment}
                </p>
              )}

              {/* IMAGES */}
              {!!step.rasmlar?.length && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {step.rasmlar.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={url}
                        alt=""
                        className="rounded-xl object-cover w-full max-h-52 cursor-pointer transition hover:opacity-90"
                        onClick={() => window.open(url, "_blank")}
                      />
                      <button
                        onClick={() =>
                          handleDownloadFile(url, `image-${idx}.jpg`)
                        }
                        className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        ⬇
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* FILES */}
              {["bildirgi", "ilovalar", "akt_file"]
                .map((key) => step[key])
                .filter(Boolean)
                .map((file, i) => (
                  <div
                    key={i}
                    onClick={() => handleDownloadFile(file, `file-${i}.pdf`)}
                    className={`
              mt-2 flex items-center gap-3 p-3 rounded-xl cursor-pointer transition
              ${
                isMe
                  ? "bg-primary-foreground/20 hover:bg-primary-foreground/30"
                  : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }
            `}
                  >
                    <div className="text-lg">📄</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">PDF File</p>
                      <p className="text-[11px] opacity-60">Tap to download</p>
                    </div>
                  </div>
                ))}

              {/* TIME */}
              <div
                className={`text-[10px] mt-1 text-right opacity-70 ${
                  isMe ? "text-primary-foreground" : "text-zinc-400"
                }`}
              >
                {formattedDate}
              </div>
            </div>
          </div>
        );
      })}

      {/* ADD NEW STEP */}
      <div className="mt-4 border-t border-border/30 pt-4 space-y-3">
        <div className="flex flex-col justify-center items-start gap-4">
          {data?.status == "tasdiqlanmoqda" || data?.status == "rad_etildi" ? (
            <SegmentedButtonGroup
              options={statusOptions1}
              value={form.status}
              onChange={() =>
                setForm((prev) => ({
                  ...prev,
                  status: "tasdiqlanmoqda",
                }))
              }
            />
          ) : (
            <SegmentedButtonGroup
              options={
                data?.status == "bajarilmoqda" ? statusOptions3 : statusOptions
              }
              value={form.status}
              onChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  status: value,
                }))
              }
            />
          )}
        </div>

        <Textarea
          placeholder="Komment yozing..."
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          className="w-full h-28 p-2 border border-border rounded-2xl text-sm "
        />

        {form.status == "tasdiqlanmoqda" ? (
          <Button
            onClick={() => {
              setOpenShet(true);
            }}
            className="flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Yuborish
          </Button>
        ) : (
          <Button
            disabled={
              !isFormComplete() ||
              isLoadingComing ||
              data?.status == "bajarilgan"
            }
            onClick={submitForm}
            className="flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Yuborish
          </Button>
        )}
      </div>

      {/* add file */}
      <div className="relative flex  w-full items-center justify-center">
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none -z-10 absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full",
            "bg-[radial-gradient(ellipse_at_center,--theme(--color-foreground/.1),transparent_50%)]",
            "blur-[30px]",
          )}
        />

        <Sheet open={openShet}>
          <SheetContent showClose={true}>
            <SheetHeader>
              <SheetTitle>Hujjatlarni yuklash</SheetTitle>
              <SheetDescription>
                Barcha hujjatlarni yuklashga majbursiz
              </SheetDescription>
            </SheetHeader>
            <div className="grid flex-1 auto-rows-min gap-6 px-4">
              <div className="grid gap-3">
                <Label htmlFor="ilovalar">Ilovalar</Label>
                <Input
                  id="ilovalar"
                  type="file"
                  multiple
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      ilovalar: e.target.files[0] || null,
                    }))
                  }
                />
                {form.ilovalar && (
                  <span className="text-xs text-green-600">
                    {form.ilovalar.name}
                  </span>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="akt_file">Akt fayl</Label>
                <Input
                  id="akt_file"
                  type="file"
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      akt_file: e.target.files[0] || null,
                    }))
                  }
                />
                {form.akt_file && (
                  <span className="text-xs text-green-600">
                    {form.akt_file.name}
                  </span>
                )}
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline" onClick={deleteShetInformation}>
                  Bekor qilish
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button
                  disabled={
                    form.ilovalar == null ||
                    form.akt_file == null ||
                    data?.status == "bajarilgan"
                  }
                  onClick={submitForm}
                >
                  {data?.status == "bajarilgan" ? "Bajarilgan" : "Yuborish"}
                  {isLoadingComing ? (
                    <Loader className="ml-2 animate-spin" size={16} />
                  ) : data?.status == "bajarilgan" ? (
                    <Check className="ml-2" size={16} />
                  ) : (
                    <Send className="ml-2" size={16} />
                  )}
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* <NavigationMenuDemo /> */}
      </div>
    </div>
  );
}
