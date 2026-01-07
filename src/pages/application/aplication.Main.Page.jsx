import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useAplication_detailsQuery } from "@/services/api";
import {
  Calendar,
  Download,
  Edit2,
  Files,
  FileText,
  Layers,
  MessageSquare,
  MoreVertical,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";

const statusVariantMap = {
  "bajarilgan": "success",
  "qaytarildi": "destructive",
  "qabul qilindi": "default",
  "jarayonda": "warning",
};

export default function ApplicationMainPage({ id }) {
  const { data, isLoading } = useAplication_detailsQuery(id);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);

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

  return (
    <ScrollArea className="h-[100vh] no-scrollbar ">
      <div className="space-y-4 ">
        <Card className="w-full">
          <CardContent className=" space-y-6">
            {/* Top: Ariza va Actions Dropdown */}
            <div className="flex items-center justify-between gap-4">
              {/* Ariza info */}
              <div className="flex-1">
                <p className="text-lg font-semibold  mb-2">
                  Ariza raqami: #{data?.id}
                </p>
                <Badge
                  variant={statusVariantMap[data?.status] || "outline"}
                  className="text-xs"
                >
                  {data?.status}
                </Badge>
              </div>
              {/* Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="relative h-8 w-8 p-0 ">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Edit2 className="h-4 w-4" />
                    Tahrirlash
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setShowFileModal(true)}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <Files className="h-4 w-4" />
                      Ish jarayoni
                    </div>

                    <Badge
                      variant="secondary"
                      className="text-[10px] px-2 py-0"
                    >
                      Yangi
                    </Badge>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Bildirgini yuklash
                  </DropdownMenuItem>

                  {/* 🟢 BADGE ITEM ICHIDA */}
                  <DropdownMenuItem
                    onClick={() => setShowFileModal(true)}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <Files className="h-4 w-4" />
                      Bildirgi ko‘rish
                    </div>

                    <Badge
                      variant="secondary"
                      className="text-[10px] px-2 py-0"
                    >
                      Yangi
                    </Badge>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="flex items-center gap-2 text-red-600 ">
                    <Trash2 className="h-4 w-4 text-red-600 " />
                    O‘chirish
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Umumiy ma'lumot */}
            <div className="space-y-4 border-t pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Sana */}
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Sana</p>
                    <p className="text-sm font-medium">
                      {data?.sana || "Mavjud emas"}
                    </p>
                  </div>
                </div>

                {/* Turi */}
                <div className="flex items-start gap-3">
                  <FileText className="h-4 w-4 text-indigo-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Turi</p>
                    <p className="text-sm font-medium">{data?.turi || "—"}</p>
                  </div>
                </div>

                {/* Yaratuvchi */}
                <div className="flex items-start gap-3">
                  <Users className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Yaratuvchi</p>
                    <p className="text-sm font-medium">
                      {data?.created_by || "—"}
                    </p>
                  </div>
                </div>

                {/* Tuzilmalar */}
                <div className="flex items-start gap-3">
                  <Layers className="h-4 w-4 text-purple-600 mt-1 flex-shrink-0" />
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
                    <p className="text-xs text-muted-foreground mb-1">Izoh</p>
                    <p className="text-sm text-gray-300 line-clamp-2">
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
          <CardContent className="space-y-2 pt-6">
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
                    <Download className="h-4 w-4 mr-2" />
                    Tanlanganlarni yuklab olish ({selectedImages.length})
                  </Button>
                )}
              </>
            ) : (
              <p className="text-xs text-muted-foreground">Rasm topilmadi</p>
            )}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardContent className="space-y-2 pt-6">
            <p className="font-medium text-sm mb-2">Steplar</p>
            {data?.steplar?.length ? (
              <Button
                onClick={() => {
                  console.log("[v0] Steplar tugmasi clicked");
                }}
                variant="outline"
                className="w-full"
              >
                {`Ko'rish (${data.steplar.length})`}
              </Button>
            ) : (
              <p className="text-xs text-muted-foreground">
                Steplar mavjud emas
              </p>
            )}
          </CardContent>
        </Card>

        {/* Image Modal */}
        <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
          <DialogContent className="sm:max-w-lg w-full">
            <DialogHeader>
              <DialogTitle>Rasmni ko'rish</DialogTitle>
              <DialogClose />
            </DialogHeader>
            {currentImage && (
              <>
                <img
                  src={currentImage || "/placeholder.svg"}
                  alt="modal rasm"
                  className="w-full h-auto rounded"
                />
                <Button
                  onClick={() => handleDownloadFile(currentImage, "image.jpg")}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Yuklab olish
                </Button>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* File Modal */}
        <Dialog open={showFileModal} onOpenChange={setShowFileModal}>
          <DialogContent className="sm:max-w-md w-full">
            <DialogHeader>
              <DialogTitle>Faylni ko'rish / yuklab olish</DialogTitle>
              <DialogClose />
            </DialogHeader>
            <p className="text-xs text-muted-foreground mb-2">
              {data?.comment}
            </p>
            {data?.bildirgi && (
              <Button
                onClick={() => handleDownloadFile(data.bildirgi, "file")}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Yuklab olish
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
  );
}
