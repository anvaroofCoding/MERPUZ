import { Button } from "@/components/ui/button";
import {
  useAddAplicationsStepsBajarildiMutation,
  useAddAplicationsStepsMutation,
  useMEQuery,
} from "@/services/api";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, EyeOff, Plus, Send, Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function AplicationWorkChat({ data }) {
  const { data: me } = useMEQuery();
  const [form, setForm] = useState({
    comment: "",
    parol: "",
    photos: [],
    bildirgi: null,
    status: "",
  });

  console.log(form);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [AddAplicationsSteps] = useAddAplicationsStepsMutation();
  const [addAplicationBajarildi] = useAddAplicationsStepsBajarildiMutation();

  const isFormComplete = () =>
    form.comment.trim() !== "" || form.photos.length > 0 || form.bildirgi;

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, photos: [...prev.photos, ...files] }));
  };

  const removeBildirgi = () => {
    setForm((prev) => ({
      ...prev,
      bildirgi: null,
    }));
  };

  const handleBildirgiUpload = (e) => {
    const file = e.target.files[0];
    if (file) setForm((prev) => ({ ...prev, bildirgi: file }));
  };

  const removePhoto = (index) =>
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));

  const submitForm = async () => {
    const fd = new FormData();
    if (data?.status == "tasdiqlanmoqda") {
      fd.append("holat", form.status);
    }
    fd.append("comment", form.comment);
    fd.append("parol", form.parol);
    fd.append("qayta_yuklandi", true);
    data?.tuzilmalar.forEach((id) => fd.append("tuzilmalar", id));
    form.photos.forEach((p) => fd.append("photos", p));
    if (form.bildirgi) fd.append("bildirgi", form.bildirgi);

    await toast.promise(
      AddAplicationsSteps({ body: fd, id: data?.id }).unwrap(),
      { loading: "Yuborilmoqda...", success: "Yuborildi!", error: "Xatolik!" },
    );

    setForm({ comment: "", parol: "", photos: [], bildirgi: null });
    setShowVerificationModal(false);
  };

  const submitForm2 = async () => {
    const fd = new FormData();
    if (data?.status == "tasdiqlanmoqda") {
      fd.append("holat", form.status);
    }
    fd.append("comment", form.comment);
    fd.append("parol", form.parol);
    fd.append("ariza", data?.id);
    form.photos.forEach((p) => fd.append("photos", p));
    if (form.bildirgi) fd.append("akt_file", form.bildirgi);

    await toast.promise(addAplicationBajarildi({ body: fd }).unwrap(), {
      loading: "Yuborilmoqda...",
      success: "Yuborildi!",
      error: "Xatolik!",
    });

    setForm({ comment: "", parol: "", photos: [], bildirgi: null, status: "" });
    setShowVerificationModal(false);
  };
  const handleDownloadFile = (fileUrl, fileName = "file.pdf") => {
    if (!fileUrl) return;

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-3 w-full mx-auto">
      {/* CHAT MESSAGES */}
      {data?.steplar?.map((step) => {
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
            className={`flex w-full mb-2 ${
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
      <div className="border-t border-border/30 pt-3 space-y-3">
        {data?.status == "tasdiqlanmoqda" ? (
          <div className="w-full h-10">
            <RadioGroup
              value={form.status} // form.status bilan bog'laymiz
              onValueChange={(val) => setForm({ ...form, status: val })}
              className="flex items-center h-full gap-5"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="bajarilgan" id="option-one" />
                <Label htmlFor="option-one">Bajarildi</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="rad_etildi" id="option-two" />
                <Label htmlFor="option-two">Rad etildi</Label>
              </div>
            </RadioGroup>
          </div>
        ) : (
          ""
        )}

        {/* Photos preview */}
        {form.photos.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {form.photos.map((p, i) => (
              <div
                key={i}
                className="relative w-16 h-16 rounded-lg overflow-hidden"
              >
                <img
                  src={URL.createObjectURL(p)}
                  alt={`preview-${i}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-0 right-0 bg-black/60 text-white w-5 h-5 flex items-center justify-center rounded-bl-md"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* File preview */}
        {form.bildirgi && (
          <div className="flex items-center justify-between bg-muted/30 px-3 py-2 rounded-xl text-sm">
            <span className="flex items-center gap-2 truncate">
              📎 {form.bildirgi.name}
            </span>
            <button
              type="button"
              onClick={removeBildirgi}
              className="text-red-500 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input area */}
        <div className="flex items-center gap-2 bg-muted/20 p-2 rounded-2xl border border-border/20">
          {/* Photo upload */}
          <label className="cursor-pointer flex items-center justify-center p-2 rounded-xl hover:bg-muted/50 transition bg-muted">
            <Plus className="w-5 h-5 text-muted-foreground" />
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </label>

          {/* File upload */}
          <label className="cursor-pointer flex items-center justify-center p-2 rounded-xl hover:bg-muted/50 bg-muted transition">
            <Upload className="w-5 h-5 text-muted-foreground" />
            <input
              type="file"
              className="hidden"
              onChange={handleBildirgiUpload}
            />
          </label>

          {/* Textarea */}
          <textarea
            placeholder="Xabar yozing..."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            className="flex-1 bg-transparent resize-none outline-none text-sm px-2 py-1 rounded-xl h-10 placeholder:text-muted-foreground"
            rows={1}
          />

          {/* Send button */}
          <Button
            disabled={
              !isFormComplete() ||
              (data?.status !== "jarayonda" &&
                data?.status !== "qaytarildi" &&
                data?.status !== "tasdiqlanmoqda")
            }
            onClick={() => setShowVerificationModal(true)}
            className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
            variant="default"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* PASSWORD MODAL */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 w-full max-w-sm">
            <h2 className="text-base font-semibold mb-3">Parolni kiriting</h2>
            <div className="relative mb-3">
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="Parol"
                value={form.parol}
                onChange={(e) => setForm({ ...form, parol: e.target.value })}
                className="w-full p-2 border border-border rounded-xl text-sm "
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {passwordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowVerificationModal(false)}
              >
                Bekor qilish
              </Button>
              <Button
                className="flex-1"
                onClick={
                  data?.status == "tasdiqlanmoqda" ? submitForm2 : submitForm
                }
              >
                Tasdiqlash
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
