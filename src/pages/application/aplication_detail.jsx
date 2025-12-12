import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useAplication_detailsQuery,
  useDeleteAplicationMutation,
  useDeletePhotoMutation,
  useEditAplicationMutation,
  useOptionTuzilmaQuery,
} from "@/services/api";
import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconLoader,
} from "@tabler/icons-react";
import {
  CheckCircle,
  CircleCheckBig,
  Download,
  Eye,
  EyeOff,
  FilePenLine,
  Loader,
  Loader2,
  MessageCircleX,
  ReplaceAll,
  Send,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function ApplicationDetailPage() {
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  const pass = localStorage.getItem("life");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    comment: "",
    parol: "",
    tuzilma: 0,
    photos: [],
    bildirgi: "",
    qayta_yuklandi: false,
  });
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  const aplication_clear = () => {
    setForm({
      comment: "",
      parol: "",
      tuzilma: 0,
      photos: [],
      bildirgi: "",
      qayta_yuklandi: false,
    });
  };
  const { data, isLoading } = useAplication_detailsQuery(id);
  const { data: OptionTuzilma, isLoading: OptionTuzilmaLoader } =
    useOptionTuzilmaQuery();
  const [DeleteAplication, { isLoading: DeleteLoading }] =
    useDeleteAplicationMutation();
  const [DeletePhotos, { isLoading: DeleteLoadingPhoto }] =
    useDeletePhotoMutation();
  const [EditAplications, { isLoading: AplicationLoader, isError, error }] =
    useEditAplicationMutation();

  useEffect(() => {
    setForm({
      comment: data?.comment,
      parol: pass,
      tuzilma: data?.tuzilma,
      photos: [],
      bildirgi: "",
    });
  }, [data, pass]);
  console.log(data);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }));
  };

  const handleBildirgiUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        bildirgi: file,
      });
    }
  };

  const handleDeleteAplication = async () => {
    try {
      await DeleteAplication({ id }).unwrap();
      navigate(-1);
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };

  const deletePhoto = (id) => {
    setDeletingId(id);

    toast
      .promise(DeletePhotos({ ids: [id] }).unwrap(), {
        loading: "O'chirilmoqda...",
        success: "Rasm muvaffaqiyatli o'chirildi!",
        error: "Rasmni o'chirishda xatolik yuz berdi!",
      })
      .finally(() => {
        setDeletingId(null);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData();
    body.append("comment", form.comment);
    body.append("parol", form.parol);
    body.append("tuzilma", form.tuzilma);
    form.photos.forEach((p) => body.append("photos", p));
    body.append("bildirgi", form.bildirgi);
    if (form?.qayta_yuklandi) {
      body.append("qayta_yuklandi", form.qayta_yuklandi);
    }
    toast.promise(EditAplications({ body, id }).unwrap(), {
      loading: "Yuborilmoqda...",
      success: "Yuborildi!",
      error: "Xatolik!",
    });
    setShow(false);
    aplication_clear();
  };

  const removePhoto = (index) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case "bajarilgan":
        return {
          label: "Bajarilgan",
          icon: <CheckCircle size={16} />,
          className: "bg-green-600 text-white hover:bg-green-700",
        };

      case "qaytarildi":
        return {
          label: "Qaytarildi",
          icon: <XCircle size={16} />,
          className: "bg-red-600 text-white hover:bg-red-700",
        };

      case "qabul qilindi":
        return {
          label: "Qabul qilindi",
          icon: <CircleCheckBig size={16} />,
          className: "bg-blue-600 text-white hover:bg-blue-700",
        };

      case "jarayonda":
        return {
          label: "Jarayonda",
          icon: <Loader2 size={16} className="animate-spin" />,
          className: "bg-amber-500 text-white hover:bg-amber-600",
        };

      default:
        return {
          label: "Noma'lum",
          icon: <Loader2 size={16} />,
          className: "bg-gray-500 text-white",
        };
    }
  };
  const statusInfo = getStatusInfo(data?.status);

  if (isError) {
    console.log(error);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto ">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            {isLoading ? (
              <Skeleton className="h-8 w-64" />
            ) : (
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                {data?.tuzilma_nomi} tuzilmasiga berilgan ariza
              </h1>
            )}
          </div>
          {isLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">
                Holati:
              </span>

              <Badge
                className={`flex items-center gap-1 ${statusInfo.className}`}
              >
                {statusInfo.icon}
                {statusInfo.label}
              </Badge>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Media & Key Info (1 col on desktop) */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Image Carousel Card */}
            <Card className="flex flex-col h-fit">
              <CardHeader className="pb-3">
                {isLoading ? (
                  <Skeleton className="w-full h-6" />
                ) : (
                  <CardTitle className="text-base md:text-lg">
                    Rasmlar
                  </CardTitle>
                )}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  {isLoading ? (
                    <Skeleton className="w-full h-full" />
                  ) : (
                    <Carousel
                      setApi={setApi}
                      opts={{
                        loop: true,
                        align: "center",
                      }}
                      className="w-full h-full"
                    >
                      <CarouselContent>
                        {data?.rasmlar?.map((item, index) => (
                          <CarouselItem key={index} className="p-0">
                            <img
                              src={item?.rasm || "/placeholder.svg"}
                              alt={`Application image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-1 md:left-2" />
                      <CarouselNext className="right-1 md:right-2" />
                    </Carousel>
                  )}
                </div>

                {/* Image Counter */}
                {isLoading ? (
                  <Skeleton className="h-4 w-12 mx-auto" />
                ) : (
                  <div className="text-center text-xs md:text-sm text-muted-foreground font-medium">
                    {current} / {count}
                  </div>
                )}

                {/* Replace Images Button */}
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  data?.status == "jarayonda" && (
                    <Drawer>
                      <DrawerTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs md:text-sm bg-transparent"
                        >
                          <ReplaceAll size={16} />
                          <span className="hidden sm:inline">
                            Rasmlarni o'zgartirish
                          </span>
                          <span className="sm:hidden">O'zgartirish</span>
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <div className="mx-auto w-full max-w-sm">
                          <DrawerHeader>
                            <DrawerTitle>Rasmlarni o'zgartirish</DrawerTitle>
                            <DrawerDescription>
                              Rasmlarni o'chirish va yangilarini yuklash
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="p-4 pb-0">
                            {data?.rasmlar?.length > 0 && (
                              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 mt-2">
                                {data?.rasmlar?.map((photo) => (
                                  <div
                                    key={photo?.id}
                                    className="relative group"
                                  >
                                    <img
                                      src={photo?.rasm}
                                      alt="preview"
                                      className="w-full aspect-square object-cover rounded-lg border border-border"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => deletePhoto(photo?.id)}
                                      className="absolute -right-2 -top-2 bg-red-500 hover:bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition z-10"
                                    >
                                      {deletingId === photo?.id ? (
                                        <Loader size={16} />
                                      ) : (
                                        "×"
                                      )}
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <DrawerFooter>
                            <DrawerClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  )
                )}
              </CardContent>
            </Card>

            {/* Quick Info Card */}
            <Card>
              <CardHeader className="pb-3">
                {isLoading ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  <CardTitle className="text-base md:text-lg">
                    Tez ma'lumot
                  </CardTitle>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {/* From */}
                <div>
                  {isLoading ? (
                    <Skeleton className="h-4 w-16 mb-1" />
                  ) : (
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Kimdan
                    </p>
                  )}
                  {isLoading ? (
                    <Skeleton className="h-5 w-24" />
                  ) : (
                    <p className="text-sm font-medium text-foreground">
                      {data?.kim_tomonidan}
                    </p>
                  )}
                </div>

                {/* Created By */}
                <div className="border-t pt-4">
                  {isLoading ? (
                    <Skeleton className="h-4 w-24 mb-1" />
                  ) : (
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Ariza yaratuvchi
                    </p>
                  )}
                  {isLoading ? (
                    <Skeleton className="h-5 w-32" />
                  ) : (
                    <p className="text-sm font-medium text-foreground">
                      {data?.created_by}
                    </p>
                  )}
                </div>

                {/* Report File */}
                <div className="border-t pt-4">
                  {isLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <div>
                      {data?.bildirgi ? (
                        <a
                          href={data.bildirgi}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs bg-transparent"
                          >
                            <Download size={14} />
                            Bildirgi faylini yuklab olish
                          </Button>
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Mavjud emas
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details & Actions (2 cols on desktop) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Application Information Grid */}
            <Card>
              <CardHeader className="pb-3">
                {isLoading ? (
                  <Skeleton className="h-7 w-32" />
                ) : (
                  <CardTitle className="text-lg md:text-xl">
                    Arizadagi ma'lumotlar
                  </CardTitle>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Structure */}
                  <div className="md:col-span-2">
                    {isLoading ? (
                      <Skeleton className="h-4 w-16 mb-2" />
                    ) : (
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Kimdan
                      </p>
                    )}
                    {isLoading ? (
                      <Skeleton className="h-6 w-40" />
                    ) : (
                      <p className="text-sm font-medium text-foreground line-clamp-2">
                        {data?.kim_tomonidan}
                      </p>
                    )}
                  </div>

                  {/* From - To Split */}
                  <div>
                    {isLoading ? (
                      <Skeleton className="h-4 w-12 mb-2" />
                    ) : (
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Kimga
                      </p>
                    )}
                    {isLoading ? (
                      <Skeleton className="h-5 w-28" />
                    ) : (
                      <p className="text-sm font-medium text-foreground line-clamp-2">
                        {data?.tuzilma_nomi}
                      </p>
                    )}
                  </div>

                  <div>
                    {isLoading ? (
                      <Skeleton className="h-4 w-16 mb-2" />
                    ) : (
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Ariza yaratuvchi
                      </p>
                    )}
                    {isLoading ? (
                      <Skeleton className="h-5 w-32" />
                    ) : (
                      <p className="text-sm font-medium text-foreground line-clamp-2">
                        {data?.created_by}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description Section */}
            <Card>
              <CardHeader className="pb-3">
                {isLoading ? (
                  <Skeleton className="h-7 w-40" />
                ) : (
                  <CardTitle className="text-lg md:text-xl">
                    Batafsil izoh
                  </CardTitle>
                )}
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ) : (
                  <p className="text-sm md:text-base text-foreground leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {data?.comment}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* ish jarayoni */}
            <Card>
              <CardHeader className="pb-3">
                {isLoading ? (
                  <Skeleton className="h-7 w-40" />
                ) : (
                  <CardTitle className="text-lg md:text-xl">
                    Ish jarayoni
                  </CardTitle>
                )}
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ) : (
                  <div>
                    {data?.steplar?.map((item, index) => {
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
                )}
              </CardContent>
            </Card>

            {/* Action Buttons Section */}
            {isLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              (() => {
                switch (data?.status) {
                  case "bajarilgan":
                    return (
                      <div className="p-4 md:p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-center text-lg md:text-xl font-semibold text-green-700 dark:text-green-300">
                          ✓ Arizangiz muvaffaqiyatli bajarildi
                        </p>
                      </div>
                    );

                  case "qabul qilindi":
                    return (
                      <div className="p-4 md:p-6 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-950 dark:to-blue-900 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-center text-lg md:text-xl font-semibold text-blue-600 dark:text-blue-300">
                          ✓ Arizangiz qabul qilgan
                        </p>
                      </div>
                    );

                  default:
                    return (
                      <div className="flex flex-col sm:flex-row gap-3">
                        {show ? (
                          <Button
                            variant="outline"
                            className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 border-red-200 dark:border-red-800 flex-1 sm:flex-none"
                            onClick={() => setShow(false)}
                          >
                            <MessageCircleX size={18} />
                            <span className="hidden sm:inline">Yopish</span>
                          </Button>
                        ) : (
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none"
                            onClick={() => setShow(true)}
                          >
                            <FilePenLine size={18} />
                            <span className="hidden sm:inline">Tahrirlash</span>
                          </Button>
                        )}

                        <Button
                          className={
                            DeleteLoading
                              ? "bg-gray-600 flex-1 sm:flex-none"
                              : "bg-red-600 hover:bg-red-700 text-white flex-1 sm:flex-none"
                          }
                          disabled={DeleteLoading}
                          onClick={handleDeleteAplication}
                        >
                          {DeleteLoading ? (
                            <>
                              <Loader size={18} className="animate-spin" />
                              <span className="hidden sm:inline">
                                O'chirilmoqda...
                              </span>
                            </>
                          ) : (
                            <>
                              <Trash2 size={18} />
                              <span className="hidden sm:inline">
                                O'chirish
                              </span>
                            </>
                          )}
                        </Button>
                      </div>
                    );
                }
              })()
            )}

            {/* Edit Form Section */}
            {show && (
              <Card>
                <CardHeader className="rounded-t-lg pb-3">
                  <CardTitle className="text-lg md:text-xl text-blue-900 dark:text-blue-100">
                    Arizani tahrirlash
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-6 flex flex-col gap-5">
                  {/* COMMENT */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold">Komment</Label>
                    <Textarea
                      placeholder="Komment yozing"
                      value={form.comment}
                      onChange={(e) =>
                        setForm({ ...form, comment: e.target.value })
                      }
                      className="min-h-24 resize-none"
                    />
                  </div>

                  {/* PASSWORD */}
                  <div className="flex flex-col gap-2 relative">
                    <Label className="text-sm font-semibold">Parol</Label>
                    <div className="relative">
                      <Input
                        type={passwordVisible ? "text" : "password"}
                        placeholder="Parol"
                        value={form.parol}
                        onChange={(e) =>
                          setForm({ ...form, parol: e.target.value })
                        }
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      >
                        {passwordVisible ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* TUZILMA SELECT */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold">Tuzilma</Label>
                    <Select
                      value={form.tuzilma}
                      onValueChange={(val) =>
                        setForm({ ...form, tuzilma: Number(val) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tuzilma tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        {OptionTuzilma?.map((item) => {
                          return (
                            <SelectItem key={item?.id} value={item?.id}>
                              {item?.tuzilma_nomi}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* PHOTOS */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold">
                      Rasmlarni qo'shish{" "}
                      <span className="text-muted-foreground text-xs">
                        (ixtiyoriy)
                      </span>
                    </Label>

                    <label className="border-2 border-dashed border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 flex items-center justify-center gap-2 p-4 rounded-lg cursor-pointer transition">
                      <Upload
                        size={18}
                        className="text-blue-600 dark:text-blue-400"
                      />
                      <span className="text-sm font-medium">
                        Rasmlar yuklash
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                      />
                    </label>

                    {form.photos.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 mt-2">
                        {form.photos.map((photo, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={
                                URL.createObjectURL(photo) || "/placeholder.svg"
                              }
                              alt="preview"
                              className="w-full aspect-square object-cover rounded-lg border border-border"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute -right-2 -top-2 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition z-10"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* FILE UPLOAD */}
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold">Fayl</Label>

                    <label className="border-2 border-dashed border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 flex items-center justify-center gap-2 p-4 rounded-lg cursor-pointer transition">
                      <Upload
                        size={18}
                        className="text-blue-600 dark:text-blue-400"
                      />
                      <span className="text-sm font-medium">
                        Faylni yuklash
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                        onChange={handleBildirgiUpload}
                      />
                    </label>

                    {form.bildirgi && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                        <span className="text-sm text-green-700 dark:text-green-300">
                          ✓ {form.bildirgi.name}
                        </span>
                      </div>
                    )}
                  </div>
                  {form?.bildirgi ? (
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-semibold">
                        Bildirgini yangilaganingiz haqida habar beraylikmi?
                      </Label>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id="qayta_yuklandi"
                            checked={form.qayta_yuklandi}
                            onCheckedChange={(value) =>
                              setForm({ ...form, qayta_yuklandi: value })
                            }
                          />
                          <label
                            htmlFor="qayta_yuklandi"
                            className="text-sm cursor-pointer select-none"
                          >
                            Ha, xabar bering
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={AplicationLoader}
                    className="bg-green-600 hover:bg-green-700 text-white w-full h-11 font-semibold text-base"
                  >
                    {AplicationLoader ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Yuborilmoqda...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        O'zgarishlarni saqlash
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
