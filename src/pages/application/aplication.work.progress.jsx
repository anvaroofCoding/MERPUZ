import { Button } from "@/components/ui/button";
import { useAddAplicationsStepsMutation, useMEQuery } from "@/services/api";
import {
  CloudDownload,
  Eye,
  EyeOff,
  Plus,
  Send,
  Upload,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AplicationWorkChat({ data }) {
  const { data: me } = useMEQuery();
  const [form, setForm] = useState({
    comment: "",
    parol: "",
    photos: [],
    bildirgi: null,
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [AddAplicationsSteps] = useAddAplicationsStepsMutation();

  const isFormComplete = () =>
    form.comment.trim() !== "" || form.photos.length > 0 || form.bildirgi;

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({ ...prev, photos: [...prev.photos, ...files] }));
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

  return (
    <div className="flex flex-col gap-3 w-full mx-auto px-2">
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
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`relative max-w-[75%]  p-3 rounded-2xl shadow-md
              ${
                isMe
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
              }`}
            >
              <div className="flex justify-between gap-5 mb-5 items-center mb-1 text-[10px]">
                {!isMe && (
                  <span className="font-semibold">{step.created_by}</span>
                )}
                <span className={isMe ? "text-white " : "dark:text-gray-300"}>
                  {formattedDate}
                </span>
                {isMe && <span className="font-semibold ">Men</span>}
              </div>

              {/* COMMENT */}
              <p className="text-sm mb-2 break-words">{step.comment}</p>

              {/* PHOTOS */}
              {step.rasmlar?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {step.rasmlar.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={url}
                        alt={`img-${idx}`}
                        className="w-24 h-24 object-cover rounded-lg cursor-pointer transition transform hover:scale-105"
                        onClick={() => window.open(url, "_blank")}
                      />
                      <Button
                        variant="ghost"
                        onClick={() =>
                          handleDownloadFile(url, `image-${idx}.jpg`)
                        }
                        className="absolute bottom-1 right-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition px-1 py-0"
                      >
                        <CloudDownload
                          className="w-4 h-4 text-black"
                          size={11}
                        />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* FILES */}
              {step.bildirgi && (
                <div className="mt-1">
                  <Button
                    size="sm"
                    variant="solid"
                    className="rounded-full flex items-center gap-1 px-3 py-1"
                    onClick={() =>
                      handleDownloadFile(step.bildirgi, "bildirgi.pdf")
                    }
                  >
                    <CloudDownload className="w-4 h-4" /> Bildirgi
                  </Button>
                </div>
              )}

              {step.ilovalar && (
                <div className="mt-1">
                  <Button
                    size="sm"
                    variant="solid"
                    className="rounded-full flex items-center gap-1 px-3 py-1"
                    onClick={() =>
                      handleDownloadFile(step.ilovalar, "ilova.pdf")
                    }
                  >
                    <CloudDownload className="w-4 h-4" /> Ilova
                  </Button>
                </div>
              )}

              {step.akt_file && (
                <div className="mt-1">
                  <Button
                    size="sm"
                    variant="solid"
                    className="rounded-full flex items-center gap-1 px-3 py-1"
                    onClick={() =>
                      handleDownloadFile(step.akt_file, "ilova.pdf")
                    }
                  >
                    <CloudDownload className="w-4 h-4" /> Akt
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* ADD NEW STEP */}
      <div className="mt-4 border-t border-border/30 pt-4 space-y-3">
        <div className="flex flex-wrap gap-2">
          <label className="flex items-center justify-center w-20 h-20 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer hover:bg-blue-100">
            <div className="flex flex-col items-center gap-1">
              <Plus className="w-5 h-5 text-blue-600" />
              <span className="text-xs text-blue-600">Qo'sh</span>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </label>
          {form.photos.map((p, i) => (
            <div
              key={i}
              className="relative w-20 h-20 rounded-lg overflow- shadow-sm"
            >
              <img
                src={URL.createObjectURL(p)}
                alt={`preview-${i}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <label className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer hover:bg-blue-100">
          <Upload size={16} className="text-blue-600" />{" "}
          <span className="text-sm text-blue-600">Fayl yuklash</span>
          <input
            type="file"
            className="hidden"
            onChange={handleBildirgiUpload}
          />
        </label>
        {form.bildirgi && (
          <span className="text-xs text-green-600">{form.bildirgi.name}</span>
        )}

        <textarea
          placeholder="Komment yozing..."
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          className="w-full h-28 p-2 border border-border rounded-2xl text-sm resize-none"
        />

        <Button
          disabled={
            !isFormComplete() ||
            (data?.status !== "jarayonda" && data?.status !== "qaytarildi")
          }
          onClick={() => setShowVerificationModal(true)}
          className="flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" /> Yuborish
        </Button>
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
              <Button className="flex-1" onClick={submitForm}>
                Tasdiqlash
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
