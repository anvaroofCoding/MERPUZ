import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CalendarIcon,
  CalendarSearch,
  MoreHorizontal,
  Send,
} from "lucide-react"; // 3 nuqtali icon
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAplication_detailsQuery,
  useDeletePhotoMutation,
  useIjroTimeMutation,
  useMEQuery,
} from "@/services/api";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Download,
  DownloadCloud,
  FileText,
  Layers,
  Loader,
  MessageSquare,
  Trash2,
  Users,
} from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";
import Aplication_Work_Progress from "./aplication.work.progress";
import { IconClockHour6 } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const statusVariantMap = {
  bajarilgan: "success",
  qaytarildi: "destructive",
  "qabul qilindi": "default",
  jarayonda: "warning",
};

export default function ApplicationMainPage({ id }) {
  const { data, isLoading } = useAplication_detailsQuery(id);
  const [DeletePhotos, { isLoading: DeleteLoadingPhoto }] =
    useDeletePhotoMutation();
  const { data: me } = useMEQuery();
  const [selectedImages, setSelectedImages] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageId, setCurrentImageId] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [postIjroTime, { isLoading: ijroL }] = useIjroTimeMutation();
  const parol = localStorage.getItem("life");

  const [executionData, setExecutionData] = useState({
    remark: "",
    dueDate: undefined, // "" o'rniga undefined ishlating
  });

  const saveExecutionData = async () => {
    // 1. Ma'lumotni API formatiga tayyorlaymiz
    const payload = {
      comment: executionData.remark, // remark -> comment
      // Date obyektini "YYYY-MM-DD" formatiga o'tkazamiz
      ijro_muddati: executionData.dueDate
        ? format(executionData.dueDate, "yyyy-MM-dd")
        : null,
      parol: parol,
    };

    try {
      // 2. API ga yuborish (postIjroTime - sizning api funksiyangiz)
      // payloadni argument sifatida uzatamiz
      const response = await postIjroTime({ body: payload, id }).unwrap();

      if (response) {
        console.log("Muvaffaqiyatli saqlandi:", payload);

        // 3. Dialog oynasini yopish
        setIsDialogVisible(false);

        // 4. State-ni tozalash (ixtiyoriy)
        setExecutionData({ remark: "", dueDate: undefined });
      }
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      // Bu yerda foydalanuvchiga xatolik haqida xabar ko'rsatish mumkin (Toast)
    }
  };

  // Sanani tanlash funksiyasi
  const handleDateSelect = (selectedDate) => {
    setExecutionData((prev) => ({
      ...prev,
      dueDate: selectedDate, // Bu yerda to'g'ridan-to'g'ri Date obyekti keladi
    }));
  };

  if (isLoading || !data) {
    return (
      <ScrollArea className="h-[calc(100vh-110px)] no-scrollbar pr-4">
        <div className="space-y-3 p-3">
          <Skeleton className="h-6 w-[150px] rounded mb-3" />
          <Skeleton className="h-40 w-full rounded-md" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-[80%] rounded" />
          <Skeleton className="h-4 w-[60%] rounded" />
        </div>
      </ScrollArea>
    );
  }

  const toggleSelectImage = (img) => {
    setSelectedImages((prev) =>
      prev.includes(img) ? prev.filter((i) => i !== img) : [...prev, img],
    );
  };

  const downloadImage = async (url, filename) => {
    const response = await fetch(url);
    const blob = await response.blob();

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  };

  const downloadImages = async () => {
    try {
      for (let i = 0; i < selectedImages.length; i++) {
        await downloadImage(selectedImages[i], `rasm-${i + 1}.jpg`);
      }
    } catch (error) {
      console.error("Images download error:", error);
    }
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
    } catch (error) {
      console.error("File download error:", error);
    }
  };
  const deletePhoto = () => {
    toast.promise(DeletePhotos({ ids: [currentImageId] }).unwrap(), {
      loading: "O'chirilmoqda...",
      success: "Rasm muvaffaqiyatli o'chirildi!",
      error: "Rasmni o'chirishda xatolik yuz berdi!",
    });
    setShowImageModal(false);
    setCurrentImageId(null);
  };

  return (
    <ScrollArea className="no-scrollbar h-screen pb-35">
      <div className="space-y-4 ">
        <Card className="w-full">
          <CardContent className=" space-y-6">
            {/* Top: Ariza va Actions Dropdown */}
            <div className="flex items-center justify-between gap-4">
              {/* Ariza info */}
              <div className="flex-1">
                <p className="text-lg font-semibold  mb-2">
                  Ariza raqami: {data?.id}
                </p>
                <Badge
                  variant={statusVariantMap[data?.status] || "outline"}
                  className="text-xs"
                >
                  {data?.status}
                </Badge>
              </div>
              {/* Actions Dropdown */}
              <Button size="sm" onClick={() => setShowFileModal(true)}>
                Bildirgi fayli <DownloadCloud className="ml-1" size={17} />
              </Button>
              {data?.ijro_muddati ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => setIsDialogVisible(true)}>
                      <IconClockHour6 stroke={2} />
                      Ijro vaqti
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                ""
              )}
            </div>

            {/* Umumiy ma'lumot */}
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sana */}
                <div className="flex items-start gap-3">
                  <CalendarSearch className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Sana</p>
                    <p className="text-sm font-medium">
                      {data?.sana || "Mavjud emas"}
                    </p>
                  </div>
                </div>

                {/* Turi */}
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Turi</p>
                    <p className="text-sm font-medium">
                      {data?.turi || "—"}{" "}
                      {data?.ijro_muddati ? `(${data?.ijro_muddati})` : ""}
                    </p>
                  </div>
                </div>

                {/* Yaratuvchi */}
                <div className="flex items-start gap-3">
                  {data?.kim_tomonidan?.photo ? (
                    <Dialog>
                      {/* ✅ TRIGGER — faqat bitta element */}
                      <DialogTrigger asChild>
                        <img
                          src={data.kim_tomonidan.photo}
                          alt="Yaratuvchi rasmi"
                          className="w-6 h-6 rounded-full cursor-pointer hover:opacity-80 transition"
                        />
                      </DialogTrigger>

                      <DialogContent className="max-w-md p-2">
                        {/* ✅ ACCESSIBILITY UCHUN */}
                        <VisuallyHidden>
                          <DialogTitle>Yaratuvchi rasmi</DialogTitle>
                        </VisuallyHidden>

                        <img
                          src={data.kim_tomonidan.photo}
                          alt="Yaratuvchi rasmi"
                          className="w-full h-auto rounded-lg"
                        />
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <Users className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                  )}

                  <div>
                    <p className="text-xs text-muted-foreground">Yaratuvchi</p>
                    <p className="text-sm font-medium">
                      {data?.created_by || "—"}
                    </p>
                  </div>
                </div>

                {/* Tuzilmalar */}
                <div className="flex items-start gap-3">
                  <Layers className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Tuzilmalar</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {data?.tuzilma_nomlari?.map((name, idx) => (
                        <Badge key={idx}>{name}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Comment section */}
              {data?.comment && (
                <div className="flex gap-3 pt-3 border-t">
                  <MessageSquare className="h-4 w-4 text-orange-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">
                      Muhokama
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 ">
                      {data.comment}
                    </p>
                  </div>
                </div>
              )}

              {data?.comment && (
                <div className="flex gap-3 pt-3 border-t">
                  <MessageSquare className="h-4 w-4 text-orange-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">
                      Tezkor xabar
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 ">
                      {data.comment}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Rasmlar */}
        <Card className="w-full">
          <CardContent className="space-y-2">
            <p className="font-medium text-sm mb-2">Rasmlar</p>
            {data?.rasmlar?.length ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {data.rasmlar.map((r) => (
                    <div key={r.id} className="relative group">
                      <img
                        src={r.rasm || "/placeholder.svg"}
                        alt="ariza rasm"
                        className="w-full h-24 object-cover rounded cursor-pointer border hover:opacity-80 transition-opacity"
                        onClick={() => {
                          setCurrentImage(r.rasm);
                          setCurrentImageId(r.id);
                          setShowImageModal(true);
                        }}
                      />
                      <input
                        type="checkbox"
                        className="absolute top-1 right-1 cursor-pointer"
                        checked={selectedImages.includes(r.rasm)}
                        onChange={() => toggleSelectImage(r.rasm)}
                        aria-label="Select image"
                      />
                    </div>
                  ))}
                </div>
                {selectedImages.length > 0 && (
                  <Button onClick={downloadImages} className="w-full">
                    Tanlanganlarni yuklab olish ({selectedImages.length})
                    <Download size={17} className="h-4 w-4" />
                  </Button>
                )}
              </>
            ) : (
              <p className="text-xs text-muted-foreground">Rasm topilmadi</p>
            )}
          </CardContent>
        </Card>
        <Aplication_Work_Progress data={data} />
        {/* Image Modal */}
        <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
          <DialogContent className="sm:max-w-lg w-full">
            <DialogHeader>
              <DialogTitle>Jo'natilgan rasm ko'rinishi</DialogTitle>
              <DialogClose />
            </DialogHeader>
            {currentImage && (
              <>
                <img
                  src={currentImage || "/placeholder.svg"}
                  alt="modal rasm"
                  className="w-full h-auto rounded"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() =>
                      handleDownloadFile(currentImage, "image.jpg")
                    }
                    className="w-full"
                  >
                    <Download className="h-4 w-4" />
                    Yuklab olish
                  </Button>
                  {DeleteLoadingPhoto ? (
                    <Button
                      className="w-full bg-red-600 hover:bg-red-500"
                      disabled={DeleteLoadingPhoto}
                    >
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      O'chirish
                    </Button>
                  ) : (
                    <Button
                      onClick={deletePhoto}
                      className="w-full bg-red-600 hover:bg-red-500"
                      disabled={data?.status !== "jarayonda"}
                    >
                      <Trash2 className="h-4 w-4" />
                      O'chirish
                    </Button>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
        {/* File Modal */}
        <Dialog open={showFileModal} onOpenChange={setShowFileModal}>
          <DialogContent className="sm:max-w-md w-full">
            <DialogHeader>
              <DialogTitle>Bildirgi faylini haqida</DialogTitle>
              <DialogClose />
            </DialogHeader>
            <p className="text-xs text-muted-foreground mb-2">
              {data?.extra_comment}
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              {data?.comment}
            </p>
            {data?.bildirgi && (
              <Button
                onClick={() => handleDownloadFile(data.bildirgi, "file")}
                className="w-full"
              >
                <Download className="h-4 w-4 " />
                Yuklash
              </Button>
            )}
          </DialogContent>
        </Dialog>
        {/* for ijro date */}
        <Dialog open={isDialogVisible} onOpenChange={setIsDialogVisible}>
          <DialogContent className="sm:max-w-[450px] p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center">
                Ijro sanasini o'zgartirish
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Kalendar qismi */}
              <div className="flex flex-col items-center gap-2">
                <Label className="w-full font-semibold text-sm text-muted-foreground">
                  Yangi muddatni tanlang
                </Label>
                <div className="rounded-md border shadow-sm bg-white dark:bg-zinc-950">
                  <Calendar
                    mode="single"
                    selected={executionData.dueDate}
                    onSelect={handleDateSelect}
                    className="rounded-md"
                    // Agar yillar ro'yxati kerak bo'lsa:
                    captionLayout="dropdown"
                    fromYear={2024}
                    toYear={2030}
                  />
                </div>
              </div>

              {/* Izoh qismi */}
              <div className="grid gap-2">
                <Label
                  htmlFor="remark"
                  className="font-semibold text-sm text-muted-foreground"
                >
                  O'zgartirish sabablari
                </Label>
                <Textarea
                  id="remark"
                  placeholder="Izoh qoldiring..."
                  value={executionData.remark}
                  onChange={(e) =>
                    setExecutionData((prev) => ({
                      ...prev,
                      remark: e.target.value,
                    }))
                  }
                  className="min-h-[80px] focus-visible:ring-primary"
                />
              </div>
            </div>

            <DialogFooter className="flex sm:justify-center">
              <Button
                className="w-full sm:w-[200px] flex gap-2"
                onClick={saveExecutionData || ijroL}
                disabled={!executionData.dueDate} // Sana tanlanmasa tugma ishlamaydi
              >
                Saqlash{" "}
                {ijroL ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
  );
}
