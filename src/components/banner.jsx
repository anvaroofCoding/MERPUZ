import { useEffect, useState } from "react";
import {
  ArrowUpRightIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheckBig,
  List,
  Loader2,
  Reply,
  Search,
  Send,
  SendHorizontal,
  XCircle,
} from "lucide-react";
import {
  Banner,
  BannerAction,
  BannerClose,
  BannerIcon,
  BannerTitle,
} from "@/components/ui/shadcn-io/banner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Badge } from "./ui/badge";
import {
  useMEQuery,
  usePprJarayondaForFindingQuery,
  usePPrniJonatishPostMutation,
  usePPRtastiqlashGetForFindQuery,
  usePPRtastiqlashGetQuery,
  usePPRtastiqlashPOStMutation,
  usePprYuborishMutation,
} from "@/services/api";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { IconError404, IconFolderCode } from "@tabler/icons-react";
import { useSelector } from "react-redux";

export default function Example() {
  const now = new Date();
  const currentYear = now.getFullYear(); // yil
  const currentMonth = now.getMonth() + 1;
  const [page, setPage] = useState(1);
  const limit = 10;
  const [id, setId] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setFrom] = useState({
    yuborish_paketi: 0,
    status: "tasdiqlandi",
    comment: "",
  });
  const [atkaz, setAtkaz] = useState({
    comment: "",
    status: "rad_etildi",
  });
  const [DataDate, setDataDate] = useState({
    yil: currentYear.toString(),
    oy: currentMonth.toString(),
  });
  const [PPrniJonatishPost, { isLoading: PprniJonatishPostLoading }] =
    usePPrniJonatishPostMutation();
  const [yuborildiText, setyuborildi] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [postTastiqlash, { isLoading: tastiqlashLoading }] =
    usePPRtastiqlashPOStMutation();
  const { data: me } = useMEQuery();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const bolim = useSelector((state) => state.bolim.bolim);

  const { data, isLoading } = usePPRtastiqlashGetQuery({
    status: activeTab === "all" ? "" : activeTab,
    search: debouncedSearch,
    page,
    limit,
    bolim_category__nomi:
      me?.role == "tarkibiy" || me?.role == "monitoring" ? bolim : "",
  });
  const { data: men, isLoading: mainLoad } = useMEQuery();
  const { data: usePPRtastqlashforFind, isLoading: forFindLoad } =
    usePPRtastiqlashGetForFindQuery();
  const [yuborishPprText, { isLoading: loadYuborish }] =
    usePprYuborishMutation();
  const total = data?.count || 0;
  const totalPages = Math.ceil(total / limit);

  const { data: jarayondaFind, isLoading: prosessLoading } =
    usePprJarayondaForFindingQuery();

  const [sts, setSts] = useState(null);
  const [step, setStep] = useState(0);
  const finded_respect_btn = jarayondaFind?.results?.find((we) => {
    return (
      Number(DataDate.yil) === we.yil &&
      Number(DataDate.oy) === we.oy &&
      we.status === "jarayonda"
    );
  });

  const tastiqlashPPR = async () => {
    try {
      const body = {
        yuborish_paketi: sts.yuborish_id,
        status: form.status,
        comment: form.comment,
      };
      await postTastiqlash({ body }).unwrap();
      toast.success("Muvaffaqiyatli tastiqlandi!");
      setFrom({
        yuborish_paketi: null,
        comment: "",
      });
    } catch (error) {
      console.log(error);
      toast.error("Xatolik yuz berdi!");
    }
  };

  async function yuborildiTextSumbit() {
    const body = {
      comment: yuborildiText,
    };
    try {
      await yuborishPprText({ body, id: sts.yuborish_id }).unwrap();
      toast.success("Muvaffaqiyatli yuborildi!");
    } catch (error) {
      console.log(error);
      toast.error("Nimadir xato ketdi");
    }
  }

  async function gonnaWork() {
    try {
      await PPrniJonatishPost(DataDate).unwrap();
      toast.success("Muvaffaqiyatli yuborildi!");
    } catch (error) {
      console.log(error);

      const errorMessage =
        error?.data?.detail ||
        error?.data?.message ||
        error?.data?.[0] ||
        "Xatolik yuz berdi";

      toast.error(errorMessage);
    }
  }

  async function atkazWork() {
    const body = {
      comment: atkaz.comment,
      yuborish_paketi: sts.yuborish_id,
      status: atkaz.status,
    };
    try {
      await postTastiqlash({ body }).unwrap();
      toast.success("Qaytarildi!");
      setAtkaz({
        comment: "",
      });
    } catch (error) {
      console.log(error);
    }
  }

  const status = [
    { name: "Hammasi", value: "all", icon: List },
    { name: "Tasdiqlandi", value: "tasdiqlandi", icon: CheckCircle2 },
    { name: "Rad etildi", value: "rad_etildi", icon: XCircle },
    { name: "Yuborildi", value: "yuborildi", icon: Send },
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
        return "outline";
      case "bajarildi":
        return "default";
      default:
        return "default";
    }
  };

  const maxSteps = sts?.tasdiqlashlar?.length || 0;
  const current = sts?.tasdiqlashlar?.[step];

  useEffect(() => {
    setStep(0);
  }, [sts]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedSearch]);

  const next = (e) => {
    e.stopPropagation();
    setStep((prev) => Math.min(prev + 1, maxSteps - 1));
  };

  const back = (e) => {
    e.stopPropagation();
    setStep((prev) => Math.max(prev - 1, 0));
  };

  // for pagenation
  const rightPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  function leftPage() {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  }

  return (
    <>
      <Sheet>
        <Banner className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md rounded-xl">
          <BannerIcon icon={CircleAlert} />
          <BannerTitle>PPR jadvalni tastiqlang!</BannerTitle>
          <SheetTrigger asChild>
            <BannerAction
              className={"text-white hover:text-white/40"}
              disabled={isLoading || forFindLoad || prosessLoading}
            >
              Batafsil ko'rish
            </BannerAction>
          </SheetTrigger>
          <BannerClose className={"text-white hover:text-white"} />
        </Banner>
        <SheetContent className="w-full sm:w-[500px] pb-82">
          <SheetHeader className="p-0 px-2 pt-5 border-b pb-2">
            <SheetTitle>PPR jadvalidagi ishlar</SheetTitle>
            <SheetDescription>
              Tuzilma raxbari va bo'lim raxbarlari bilan oylik PPR jadvani
              tastiqlab olish
            </SheetDescription>

            <div>
              <Input
                placeholder="Search..."
                leftIcon={<Search className="w-4 h-4" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                clearable
                onClear={() => setSearchTerm("")}
                className="mt-2 rounded-lg"
              />
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full mt-2"
            >
              <TabsList className="grid grid-cols-4 w-full">
                {status.map((st) => (
                  <TabsTrigger
                    key={st.value}
                    value={st.value}
                    className="w-full"
                  >
                    {st.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="flex items-center justify-between mt-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={leftPage}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Ortga
              </Button>
              <span className="text-xs text-muted-foreground">
                {page}/{totalPages}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={rightPage}
                disabled={page === totalPages}
              >
                Oldinga <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </SheetHeader>

          <ScrollArea className="h-full w-full p-2">
            {data?.results?.length === 0 && (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <IconError404 stroke={2} />
                  </EmptyMedia>
                  <EmptyTitle>Ma'lumot topilmadi</EmptyTitle>
                  <EmptyDescription>
                    Iltimos qaytadan urinib ko'rishingizni so'raymiz
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
            {isLoading || mainLoad ? (
              <div className="flex justify-center p-10">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              data?.results?.map((kiss, index) => (
                <Popover key={kiss.id || index}>
                  <PopoverTrigger asChild>
                    <Card
                      onClick={() => setSts(kiss)}
                      className="mt-3 cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center text-base">
                          <span>
                            {kiss.yil}-yil {kiss.oy_nomi}
                          </span>
                          <Badge variant={getVariant(kiss.status)}>
                            {kiss.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="flex justify-between items-center w-full">
                          <span>Yaratuvchi: {kiss.yaratuvchi_user}</span>
                          <span>Sana: {kiss.yaratilgan_sana}</span>
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-[400px] p-0">
                    <div className="h-[200px] overflow-y-auto p-4 space-y-3">
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <p className="font-medium text-sm">
                            {current?.user || "Tasdiqlovchi ma'lumoti"}
                          </p>
                          <Badge variant={getVariant(current?.status)}>
                            {current?.status}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground break-words">
                          {current?.comment || kiss.comment}
                        </p>

                        <p className="text-sm text-muted-foreground">
                          {current?.created_at
                            ? new Date(current.created_at).toLocaleString(
                                "uz-UZ",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                },
                              )
                            : "Aniq emas"}
                        </p>
                      </div>

                      {/* 👇 MUHIM */}
                    </div>

                    <div className="flex items-center justify-between border-t px-4 py-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={back}
                        disabled={step === 0}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Ortga
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {maxSteps > 0 ? step + 1 : 0} / {maxSteps}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={next}
                        disabled={step === maxSteps - 1 || maxSteps === 0}
                      >
                        Oldinga <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between gap-4 border-t px-4 py-2">
                      {men.role == "bolim" ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghous"
                              className="cursor-pointer text-green-600"
                              // onClick={yuborildiTextSumbit}
                              disabled={
                                kiss.status == "tasdiqlandi" ||
                                kiss.status == "yuborildi" ||
                                kiss.status == "bajarildi"
                              }
                            >
                              <Send className="h-4 w-4 mr-1" /> Yuborish
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="grid gap-4">
                              <div className="space-y-2">
                                <h4 className="leading-none font-medium">
                                  PPRni tastiqlash
                                </h4>
                                <p className="text-muted-foreground text-sm">
                                  Tastiqlash bo'yicha izoh qoldirishingiz mumkin
                                </p>
                              </div>
                              <div className="grid gap-2">
                                <div>
                                  <Textarea
                                    className="col-span-2 h-8 w-full"
                                    value={yuborildiText}
                                    onChange={(e) => {
                                      setyuborildi(e.target.value);
                                    }}
                                  />
                                </div>
                                <div className="flex justify-end">
                                  <Button
                                    size="sm"
                                    disabled={
                                      loadYuborish || yuborildiText === ""
                                    }
                                    className="w-20"
                                    onClick={yuborildiTextSumbit}
                                  >
                                    Saqlash
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghous"
                              className="cursor-pointer text-green-600"
                              disabled={kiss.status == "tasdiqlandi"}
                            >
                              <CircleCheckBig className="h-4 w-4 mr-1" />{" "}
                              Tastiqlash
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="grid gap-4">
                              <div className="space-y-2">
                                <h4 className="leading-none font-medium">
                                  PPRni tastiqlash
                                </h4>
                                <p className="text-muted-foreground text-sm">
                                  Tastiqlash bo'yicha izoh qoldirishingiz mumkin
                                </p>
                              </div>
                              <div className="grid gap-2">
                                <div>
                                  <Textarea
                                    value={form.comment}
                                    className="col-span-2 h-8 w-full"
                                    onChange={(e) => {
                                      setFrom((prev) => ({
                                        ...prev,
                                        comment: e.target.value,
                                      }));
                                    }}
                                  />
                                </div>
                                <div className="flex justify-end">
                                  <Button
                                    size="sm"
                                    disabled={
                                      men.role == "monitoring" ||
                                      form.comment == "" ||
                                      tastiqlashLoading
                                    }
                                    className={`w-20 ${tastiqlashLoading ? "w-30" : "w-20"}`}
                                    onClick={tastiqlashPPR}
                                  >
                                    {tastiqlashLoading
                                      ? "Saqlanmoqda..."
                                      : "Saqlash"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghous"
                            className={"text-red-600"}
                            disabled={
                              men.role !== "tarkibiy" ||
                              kiss?.status == "bajarildi" ||
                              kiss?.status == "tasdiqlandi" ||
                              kiss?.status == "rad_etildi"
                            }
                          >
                            Qaytarish <Reply className="h-4 w-4 ml-1" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="leading-none font-medium">
                                PPRni tastiqlash
                              </h4>
                              <p className="text-muted-foreground text-sm">
                                Tastiqlash bo'yicha izoh qoldirishingiz mumkin
                              </p>
                            </div>
                            <div className="grid gap-2">
                              <div>
                                <Textarea
                                  value={atkaz.comment}
                                  className="col-span-2 h-8 w-full"
                                  onChange={(e) => {
                                    setAtkaz((prev) => ({
                                      ...prev,
                                      comment: e.target.value,
                                    }));
                                  }}
                                />
                              </div>
                              <div className="flex justify-end">
                                <Button
                                  size="sm"
                                  className="w-20"
                                  onClick={atkazWork}
                                  disabled={tastiqlashLoading}
                                >
                                  Saqlash
                                </Button>
                              </div>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </PopoverContent>
                </Popover>
              ))
            )}
          </ScrollArea>

          <SheetFooter className="absolute bottom-0 left-0 w-full p-6 bg-background border-t ">
            <div className="flex gap-5">
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="submit" className="w-full mb-2">
                    PPR sanasini jo'natish
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="flex items-center justify-start gap-5">
                    {/* YIL */}
                    <div className="space-y-2">
                      <Label>Yilni tanlang</Label>
                      <Select
                        value={DataDate.yil}
                        onValueChange={(value) =>
                          setDataDate((prev) => ({
                            ...prev,
                            yil: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Yilni tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {[
                              2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032,
                            ].map((year) => (
                              <SelectItem key={year} value={String(year)}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* OY */}
                    <div className="space-y-2">
                      <Label>Oyni tanlang</Label>
                      <Select
                        value={DataDate.oy}
                        onValueChange={(value) =>
                          setDataDate((prev) => ({
                            ...prev,
                            oy: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Oyni tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {[
                              "Yanvar",
                              "Fevral",
                              "Mart",
                              "Aprel",
                              "May",
                              "Iyun",
                              "Iyul",
                              "Avgust",
                              "Sentabr",
                              "Oktabr",
                              "Noyabr",
                              "Dekabr",
                            ].map((month, index) => (
                              <SelectItem key={index} value={String(index + 1)}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* BUTTON */}
                  <div className="flex justify-end">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          className="mt-2 cursor-pointer"
                          onClick={gonnaWork}
                          disabled={!finded_respect_btn}
                        >
                          Jo'natish
                          <SendHorizontal className="ml-2" size={15} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Faqat to'ldirilgan oylarni yubora olasiz!</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </PopoverContent>
              </Popover>
              <SheetClose asChild>
                <Button variant="outline" className="w-full">
                  Bekor qilish
                </Button>
              </SheetClose>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
