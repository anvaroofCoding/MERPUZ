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
  useEditAplicationMutation,
  useOptionTuzilmaQuery,
} from "@/services/api";
import {
  Eye,
  EyeOff,
  FilePenLine,
  Loader,
  MessageCircleX,
  ReplaceAll,
  Send,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export default function ApplicationDetailPage() {
  const pass = localStorage.getItem("life");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    comment: "",
    parol: "",
    tuzilma: 0,
    photos: [],
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
    setForm({ comment: "", parol: "", tuzilma: 0, photos: [] });
  };
  const { data, isLoading } = useAplication_detailsQuery(id);
  const { data: OptionTuzilma, isLoading: OptionTuzilmaLoader } =
    useOptionTuzilmaQuery();
  const [EditAplications, { isLoading: AplicationLoader, isError, error }] =
    useEditAplicationMutation();
  useEffect(() => {
    setForm({
      comment: data?.comment,
      parol: pass,
      tuzilma: data?.tuzilma,
      photos: [],
    });
  }, [data, pass]);
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData();
    body.append("comment", form.comment);
    body.append("parol", form.parol);
    body.append("tuzilma", form.tuzilma);
    form.photos.forEach((p) => body.append("photos", p));
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
  return (
    <div className="min-h-[90vh] bg-background ">
      <div className="mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-6 md:gap-8">
          {/* Left Column - Carousel */}
          <div className="lg:col-span-2 2xl:h-[75vh] xl:h-[50vh] ">
            <Card className="h-full  flex flex-col ">
              <CardHeader>
                {isLoading ? (
                  <Skeleton className="w-full h-10" />
                ) : (
                  <CardTitle className="text-lg">
                    {data?.tuzilma_nomi} tarkibiy tuzilmasiga jo'natilga
                    arizadagi barcha rasmlar
                  </CardTitle>
                )}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between ">
                <Carousel
                  setApi={setApi}
                  opts={{
                    loop: true,
                    align: "center",
                  }}
                  className="w-full "
                >
                  {isLoading ? (
                    <Skeleton className="h-120 w-full" />
                  ) : (
                    <CarouselContent>
                      {data?.rasmlar?.map((item, index) => (
                        <CarouselItem key={index} className="p-0">
                          <div className="flex items-center justify-center ">
                            <CardContent className="flex aspect-square items-center justify-center ">
                              <img
                                src={item?.rasm || "/placeholder.svg"}
                                alt={`Application image ${index + 1}`}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            </CardContent>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  )}
                  <CarouselPrevious className="hidden sm:flex -left-10 " />
                  <CarouselNext className="hidden sm:flex -right-10" />
                </Carousel>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Skeleton className="h-5 w-10 my-2" />
                  </div>
                ) : (
                  <div className="text-muted-foreground text-center text-sm mt-2  font-medium">
                    {current} - {count}
                  </div>
                )}
                {isLoading ? (
                  <Skeleton className={"h-10"} />
                ) : (
                  <Button className="mt-2">
                    Rasmlarni o'zgartirish <ReplaceAll />
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Information Cards */}
            <Card>
              <CardHeader>
                {isLoading ? (
                  <Skeleton className={"h-10"} />
                ) : (
                  <CardTitle className="text-lg">
                    Arizadagi ma'lumotlar
                  </CardTitle>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Created By */}
                  <div className="space-y-2">
                    {isLoading ? (
                      <Skeleton className={"h-6"} />
                    ) : (
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Kimdan
                      </p>
                    )}
                    {isLoading ? (
                      <Skeleton className={"h-6"} />
                    ) : (
                      <p className="text-lg font-medium text-foreground">
                        {data?.kim_tomonidan}
                      </p>
                    )}
                  </div>

                  {/* Approved By */}
                  <div className="space-y-2">
                    {isLoading ? (
                      <Skeleton className={"h-6"} />
                    ) : (
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Ariza yaratuvchi
                      </p>
                    )}
                    {isLoading ? (
                      <Skeleton className={"h-6"} />
                    ) : (
                      <p className="text-lg font-medium text-foreground">
                        {data?.created_by}
                      </p>
                    )}
                  </div>

                  {/* Structure */}
                  <div className="space-y-2">
                    {isLoading ? (
                      <Skeleton className={"h-6"} />
                    ) : (
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Kimga
                      </p>
                    )}

                    {isLoading ? (
                      <Skeleton className={"h-6"} />
                    ) : (
                      <Badge
                        variant="secondary"
                        className="text-base px-3 py-1"
                      >
                        {data?.tuzilma_nomi} tarkibiga
                      </Badge>
                    )}
                  </div>

                  {/* Approval Status */}
                  <div className="space-y-2">
                    {isLoading ? (
                      <Skeleton className={"h-6"} />
                    ) : (
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                        Ariza holati
                      </p>
                    )}
                    {isLoading ? (
                      <Skeleton className={"h-6"} />
                    ) : (
                      <Badge
                        className={
                          data?.status == "bajarilgan"
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-yellow-600 text-white  hover:bg-yellow-700"
                        }
                      >
                        {data?.status == "bajarilgan"
                          ? "Bajarilgan"
                          : "Jarayonda"}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comment Section */}
            <Card>
              <CardHeader>
                {isLoading ? (
                  <Skeleton className={"h-10"} />
                ) : (
                  <CardTitle className="text-lg">Batafsil izoh</CardTitle>
                )}
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {isLoading ? (
                    <Skeleton className={"h-6"} />
                  ) : (
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                      {data?.comment}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* button */}
            {data?.status == "jarayonda" ? (
              <div className="flex gap-5">
                {show ? (
                  <div>
                    <Button
                      variant="outline"
                      className="bg-red-600 hover:bg-red-500 text-white hover:text-gray-200"
                      onClick={() => setShow(false)}
                    >
                      Yopish <MessageCircleX />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      className="bg-orange-600 hover:bg-orange-500 text-white"
                      onClick={() => {
                        setShow(true);
                      }}
                    >
                      Tahrirlash <FilePenLine />
                    </Button>
                  </div>
                )}
                <Button className="bg-red-600 hover:bg-red-500 text-white">
                  Arizani o'chirish <Trash2 />
                </Button>
              </div>
            ) : (
              <div className="flex">
                {isLoading ? (
                  <Skeleton className={"h-10 xl:w-[50%] w-full"} />
                ) : (
                  <blockquote class="text-center text-2xl font-semibold text-gray-900 italic dark:text-white">
                    Arizangiz
                    <span class="relative inline-block before:absolute before:-inset-0.5 before:block before:-skew-y-3 before:bg-green-500">
                      <span class="relative text-white dark:text-gray-950">
                        Muvaffaqiyatli
                      </span>
                    </span>
                    Bajarildi
                  </blockquote>
                )}
              </div>
            )}

            {/* edit */}
            {show ? (
              <Card className="w-full ">
                <CardHeader>
                  <CardTitle className="text-lg">Arizani tahrirlash</CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col gap-4">
                  {/* COMMENT */}
                  <div className="flex flex-col gap-1">
                    <Label>Komment</Label>
                    <Textarea
                      placeholder="Komment yozing"
                      value={form.comment}
                      onChange={(e) =>
                        setForm({ ...form, comment: e.target.value })
                      }
                    />
                  </div>

                  {/* PASSWORD */}
                  <div className="flex flex-col gap-1 relative">
                    <Label>Parol</Label>
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
                      className="absolute right-3 top-7 text-muted-foreground"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {/* TUZILMA SELECT */}
                  <div className="flex flex-col gap-1">
                    <Label>Tuzilma</Label>
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
                  <div className="flex flex-col gap-1">
                    <Label>Rasmlarni qo'shishingiz majburiy emas</Label>

                    <label className="border flex items-center justify-center gap-2 p-3 rounded cursor-pointer hover:bg-muted/40">
                      <Upload size={18} /> Rasmlar yuklash
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                      />
                    </label>

                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                      {form.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt="preview"
                            className="w-full h-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -right-2 -top-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow group-hover:scale-110 transition"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex grid grid-cols-2 gap-5 ">
                    <Button
                      className="bg-red-600 hover:bg-red-500 text-white mt-2"
                      onClick={() => {
                        setShow(false);
                        aplication_clear();
                      }}
                    >
                      Bekor qilish <MessageCircleX />
                    </Button>
                    {AplicationLoader ? (
                      <Button className=" mt-2" disabled>
                        Yuborilmoqda... <Loader />
                      </Button>
                    ) : (
                      <Button
                        className=" mt-2"
                        disabled={form?.comment ? false : true}
                        onClick={handleSubmit}
                      >
                        Yuborish <Send />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
