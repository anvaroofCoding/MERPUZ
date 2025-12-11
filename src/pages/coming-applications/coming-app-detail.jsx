import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useComing_App_qabul_qilindiMutation,
  useComing_Application_DetailQuery,
} from "@/services/api";
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLoader,
} from "@tabler/icons-react";
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Download,
  Eye,
  FileText,
  HelpCircle,
  ImageIcon,
  Loader2,
  MoreVertical,
  Share2,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function ComingAppDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [expandedComment, setExpandedComment] = useState(false);
  const { data, isLoading } = useComing_Application_DetailQuery(id);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    comment: "Arizangiz qabul qilindi!",
    ariza: id,
    holat: "qabul qilindi",
  });
  const [form2, setForm2] = useState({
    comment: "",
    ariza: id,
    holat: "qaytarildi",
  });

  const clearInput = () => {
    setForm({
      comment: "",
      ariza: null,
      holat: "",
    });
  };

  const [ArizaQabulQilindi, { isLoading: ArizaQabuliLoading }] =
    useComing_App_qabul_qilindiMutation();
  const [ArizaniQaytarish, { isLoading: ArizaniqaytarishLoading }] =
    useComing_App_qabul_qilindiMutation();

  const [fileSize, setFileSize] = useState(null);

  useEffect(() => {
    if (!data?.bildirgi) return;

    fetch(data.bildirgi, { method: "HEAD" })
      .then((res) => res.headers.get("content-length"))
      .then((bytes) => {
        if (bytes) {
          setFileSize((bytes / (1024 * 1024)).toFixed(2));
        }
      });
  }, [data?.bildirgi]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleOpenModal = () => {
    setOpen(true);
  };
  async function addQabulQilishArizani() {
    try {
      await ArizaQabulQilindi({ body: form }).unwrap();
      toast.success("Ariza qabul qilindi!");
    } catch (error) {
      console.log(error);
    }
  }
  async function qaytarishArizani() {
    try {
      await ArizaniQaytarish({ body: form2 }).unwrap();
      toast.success("Ariza muvaffaqiyatli qaytarildi");
      setOpen(false);
      clearInput();
      console.log(form2);
    } catch (error) {
      console.log(error);
    }
  }
  function LoadingAriza() {
    toast.info("Ariza yuborilmoqda kuting!");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div>
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted/60"
              onClick={() => {
                navigate(-1);
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              {isLoading ? (
                <Skeleton className={"h-10 w-60 lg:w-100"} />
              ) : (
                <h1 className="text-3xl font-bold text-foreground">
                  {data.kim_tomonidan} tomonidan kelgan ariza
                </h1>
              )}

              <p className="text-muted-foreground mt-1">
                {isLoading ? (
                  <Skeleton className={"h-5 w-60 lg:w-60"} />
                ) : (
                  <>Yaratuvchi {data?.created_by}</>
                )}
              </p>
            </div>
          </div>
          {isLoading ? (
            <Skeleton className={"h-10 w-20 lg:w-20"} />
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-muted bg-transparent"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-muted bg-transparent"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            {isLoading ? (
              <Skeleton className={"w-full h-70"} />
            ) : (
              <Card className="border-0 shadow-md-light bg-white dark:bg-slate-950/60 backdrop-blur-sm overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-accent/5 p-6 border-b border-border/40">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {(() => {
                        switch (data?.status) {
                          case "jarayonda":
                            return (
                              <div className="relative">
                                <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-30 animate-pulse"></div>
                                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400 relative z-10" />
                              </div>
                            );

                          case "bajarilgan":
                            return (
                              <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            );

                          case "qabul qilindi":
                            return (
                              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                            );

                          case "qaytarildi":
                            return (
                              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                            );

                          default:
                            return (
                              <HelpCircle className="h-6 w-6 text-gray-400" />
                            );
                        }
                      })()}

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Joriy holat
                        </p>
                        <p className="text-lg font-semibold text-foreground capitalize">
                          {(() => {
                            switch (data?.status) {
                              case "bajarilgan":
                                return "Bajarilgan";
                              case "qaytarildi":
                                return "Qaytarildi";
                              case "qabul qilindi":
                                return "Qabul qilindi";
                              case "jarayonda":
                                return "Jarayonda";
                              default:
                                return "Noma'lum";
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Qayerdan
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <p className="font-medium text-foreground">
                          {data?.kim_tomonidan}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Qayerga
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <User className="h-4 w-4 text-foreground" />
                        </div>
                        <p className="font-medium text-foreground">
                          {data?.tuzilma}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Yaratilgan sana
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-foreground" />
                      </div>
                      <p className="font-medium text-foreground">
                        {formatDate(data?.sana)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Comment Section */}
            {isLoading ? (
              <Skeleton className={"w-full h-70"} />
            ) : (
              <Card className="border-0 shadow-md-light bg-white dark:bg-slate-950/60 backdrop-blur-sm overflow-hidden">
                <div className="bg-gradient-to-r from-secondary/10 to-primary/5 p-6 border-b border-border/40">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <div className="w-1 h-6 bg-secondary rounded-full"></div>
                    Izoh
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <p
                      className={`text-sm leading-relaxed text-foreground/90 ${
                        !expandedComment ? "line-clamp-4" : ""
                      }`}
                    >
                      {data?.comment}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {isLoading ? (
              <Skeleton className={"w-full h-70"} />
            ) : (
              <Card className="border-0 shadow-md-light bg-white dark:bg-slate-950/60 backdrop-blur-sm overflow-hidden">
                <div className="bg-gradient-to-r from-accent/10 to-secondary/5 p-6 border-b border-border/40">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-foreground" />
                    Muammoning rasmlari ({data?.rasmlar?.length})
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {data?.rasmlar.map((image, idx) => (
                      <div
                        key={image.id}
                        onClick={() => setSelectedImage(image.rasm)}
                        className="group relative cursor-pointer overflow-hidden rounded-lg shadow-sm-light hover:shadow-lg-light transition-all duration-300"
                      >
                        <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                          <img
                            src={image.rasm || "/placeholder.svg"}
                            alt={`Attachment ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <Eye className="h-5 w-5 text-white" />
                        </div>
                        <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                          {idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
            {/* Images Section */}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Document Section */}

            {isLoading ? (
              <Skeleton className={"w-full h-70"} />
            ) : (
              <Card className="border-0 shadow-md-light bg-white dark:bg-slate-950/60 backdrop-blur-sm overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/5 p-6 border-b border-border/40">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Hujjatlar
                  </h2>
                </div>
                <div className="p-6 space-y-3">
                  <div className="group p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent hover:from-primary/10 border border-primary/20 transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            Hujjat
                          </p>
                          <p className="text-xs text-muted-foreground">
                            bildirgi.pdf
                          </p>
                        </div>
                      </div>
                      <a
                        href={data?.bildirgi}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {fileSize ? `${fileSize} MB` : "File yuklanmagan"}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {isLoading ? (
              <Skeleton className={"w-full h-70"} />
            ) : (
              <Card className="border-0 shadow-md-light bg-white dark:bg-slate-950/60 backdrop-blur-sm overflow-hidden">
                <div className="bg-gradient-to-r from-accent/10 to-primary/5 p-6 border-b border-border/40">
                  <h2 className="text-lg font-bold text-foreground">Amallar</h2>
                </div>
                <div className="p-6 space-y-3">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white w-full h-10 font-semibold text-base flex items-center gap-2 justify-center"
                    onClick={addQabulQilishArizani}
                    disabled={ArizaQabuliLoading}
                  >
                    {ArizaQabuliLoading ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <Loader2 className="h-5 w-5 animate-spin" /> Ariza qabul
                        qilinmoqda
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="h-5 w-5" /> Arizani qabul
                        qilish
                      </span>
                    )}
                  </Button>

                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white w-full h-10 font-semibold text-base flex items-center gap-2 justify-center"
                    onClick={handleOpenModal}
                  >
                    <XCircle className="h-5 w-5" /> Qaytarish
                  </Button>
                </div>
              </Card>
            )}

            {isLoading ? (
              <Skeleton className={"w-full h-70"} />
            ) : (
              <Card className="border-0 shadow-md-light bg-white dark:bg-slate-950/60 backdrop-blur-sm overflow-hidden">
                <div className="bg-gradient-to-r from-secondary/10 to-accent/5 p-6 border-b border-border/40">
                  <h2 className="text-lg font-bold text-foreground">
                    Ish jarayoni
                  </h2>
                </div>
                <div className=" space-y-4">
                  <CardContent>
                    <div>
                      {data?.kelganlar?.map((item, index) => {
                        const date = new Date(item?.sana);
                        const options = {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        };

                        const displayStatus =
                          index === 0 ? "jarayonda" : item?.status;

                        return (
                          <Accordion
                            type="single"
                            collapsible
                            className="w-full"
                            defaultValue="item-1"
                            key={index}
                          >
                            <AccordionItem value="item-1">
                              <AccordionTrigger className="flex flex-row">
                                {index + 1}. {item?.created_by}{" "}
                                {date.toLocaleString("uz-UZ", options)}
                              </AccordionTrigger>

                              <AccordionContent className="flex flex-col gap-4 text-balance">
                                <Badge
                                  variant="outline"
                                  className="text-muted-foreground px-1.5 capitalize flex items-center gap-1"
                                >
                                  {displayStatus === "bajarilgan" && (
                                    <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
                                  )}

                                  {displayStatus === "qaytarildi" && (
                                    <IconCircleXFilled className="fill-red-500 dark:fill-red-400" />
                                  )}

                                  {displayStatus === "qabul qilindi" && (
                                    <IconCircleCheckFilled className="fill-blue-500 dark:fill-blue-400" />
                                  )}

                                  {displayStatus === "jarayonda" && (
                                    <IconLoader className="animate-spin text-amber-500" />
                                  )}

                                  {displayStatus}
                                </Badge>

                                <p>{item?.comment}</p>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        );
                      })}
                    </div>
                  </CardContent>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="max-w-2xl w-full animate-in fade-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
              >
                ✕
              </button>
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Full view"
                className="w-full h-auto rounded-lg shadow-lg-light"
              />
            </div>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Muammo haqida habar berish</DialogTitle>
            <DialogDescription>
              Iltimos muammoni aniqroq yozishingizni so'rab qolamiz. Bu ikkinchi
              tomon kamchilikni topishi uchun muhim!
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1">
            <Label htmlFor="comment" className="mb-1">
              Ariza muammosi haqida batafsil yozing
            </Label>
            <Textarea
              id="comment"
              placeholder="yozing..."
              type="text"
              className="w-full"
              value={form2.comment}
              onChange={(e) => setForm2({ ...form2, comment: e.target.value })}
            />
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button
              disabled={ArizaniqaytarishLoading}
              onClick={qaytarishArizani}
            >
              {ArizaniqaytarishLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saqlanmoqda...
                </span>
              ) : (
                "Saqlash"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={ArizaQabuliLoading}
            >
              Bekor qilish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
