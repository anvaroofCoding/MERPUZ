import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Banner,
  BannerAction,
  BannerClose,
  BannerIcon,
  BannerTitle,
} from "@/components/ui/shadcn-io/banner";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useMEQuery,
  usePprJarayondaForFindingQuery,
  usePPrniJonatishPostMutation,
  usePPRtastiqlashGetQuery,
  usePPRtastiqlashPOStMutation,
  usePprYuborishMutation,
} from "@/services/api";
import { IconError404 } from "@tabler/icons-react";
import {
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
  X,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Input } from "./input";
import { Badge } from "./ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

// ─── Constants ────────────────────────────────────────────────────────────────
const LIMIT = 10;
const YEARS = [2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032];
const MONTHS = [
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
];
const STATUSES = [
  { name: "Hammasi", value: "all", icon: List },
  { name: "Tasdiqlandi", value: "tasdiqlandi", icon: CheckCircle2 },
  { name: "Rad etildi", value: "rad_etildi", icon: XCircle },
  { name: "Yuborildi", value: "yuborildi", icon: Send },
];

const BADGE_VARIANT = {
  tasdiqlandi: "success",
  rad_etildi: "destructive",
  yuborildi: "secondary",
  jarayonda: "outline",
  bajarildi: "default",
};

const now = new Date();
const INITIAL_DATE = {
  yil: String(now.getFullYear()),
  oy: String(now.getMonth() + 1),
};

// ─── Sub-components ────────────────────────────────────────────────────────────

/** Approval history popover content */
function ApprovalHistory({ sts, step, onBack, onNext }) {
  const maxSteps = sts?.tasdiqlashlar?.length ?? 0;
  const current = sts?.tasdiqlashlar?.[step];

  return (
    <>
      <div className="h-[180px] overflow-y-auto p-4 space-y-2">
        <div className="flex justify-between items-center">
          <p className="font-medium text-sm truncate max-w-[60%]">
            {current?.user ?? "Tasdiqlovchi ma'lumoti"}
          </p>
          <Badge variant={BADGE_VARIANT[current?.status] ?? "default"}>
            {current?.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground break-words line-clamp-3">
          {current?.comment ?? sts?.comment ?? "—"}
        </p>
        <p className="text-xs text-muted-foreground">
          {current?.created_at
            ? new Date(current.created_at).toLocaleString("uz-UZ", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Aniq emas"}
        </p>
      </div>

      {/* Step navigation */}
      <div className="flex items-center justify-between border-t px-4 py-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={onBack}
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
          onClick={onNext}
          disabled={step >= maxSteps - 1 || maxSteps === 0}
        >
          Oldinga <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </>
  );
}

/** Confirm / send popover form */
function ActionPopover({
  label,
  icon: Icon,
  onSubmit,
  isLoading,
  disabled,
  textValue,
  onTextChange,
  colorClass,
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className={`cursor-pointer ${colorClass}`}
          disabled={disabled}
        >
          <Icon className="h-4 w-4 mr-1" /> {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm leading-none mb-1">
              PPRni {label.toLowerCase()}
            </h4>
            <p className="text-muted-foreground text-xs">
              Izoh qoldirishingiz mumkin
            </p>
          </div>
          <Textarea
            className="h-20 w-full resize-none text-sm"
            value={textValue}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Izoh..."
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              className="min-w-[80px]"
              onClick={onSubmit}
              disabled={isLoading || !textValue?.trim()}
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                "Saqlash"
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function PPRTasdiqlash() {
  const [page, setPage] = useState(1);
  const [sts, setSts] = useState(null);
  const [step, setStep] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [DataDate, setDataDate] = useState(INITIAL_DATE);
  const [confirmComment, setConfirmComment] = useState("");
  const [sendComment, setSendComment] = useState("");
  const [rejectComment, setRejectComment] = useState("");

  // API hooks
  const { data: me } = useMEQuery();
  const bolim = useSelector((state) => state.bolim.bolim);

  const { data, isLoading } = usePPRtastiqlashGetQuery({
    status: activeTab === "all" ? "" : activeTab,
    search: debouncedSearch,
    page,
    limit: LIMIT,
    bolim_category__nomi:
      me?.role === "tarkibiy" || me?.role === "monitoring" ? bolim : "",
  });

  const { data: jarayondaFind } = usePprJarayondaForFindingQuery();
  const [postTastiqlash, { isLoading: tastiqlashLoading }] =
    usePPRtastiqlashPOStMutation();
  const [yuborishPprText, { isLoading: loadYuborish }] =
    usePprYuborishMutation();
  const [PPrniJonatishPost, { isLoading: jonatishLoading }] =
    usePPrniJonatishPostMutation();

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [activeTab, debouncedSearch]);

  // Reset step when selected item changes
  useEffect(() => {
    setStep(0);
  }, [sts]);

  const totalPages = Math.ceil((data?.count ?? 0) / LIMIT);

  const finded_respect_btn = useMemo(
    () =>
      jarayondaFind?.results?.find(
        (w) =>
          Number(DataDate.yil) === w.yil &&
          Number(DataDate.oy) === w.oy &&
          w.status === "jarayonda",
      ),
    [jarayondaFind, DataDate],
  );

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleConfirm = useCallback(async () => {
    try {
      await postTastiqlash({
        body: {
          yuborish_paketi: sts.yuborish_id,
          status: "tasdiqlandi",
          comment: confirmComment,
        },
      }).unwrap();
      toast.success("Muvaffaqiyatli tastiqlandi!");
      setConfirmComment("");
    } catch {
      toast.error("Xatolik yuz berdi!");
    }
  }, [sts, confirmComment, postTastiqlash]);

  const handleSend = useCallback(async () => {
    try {
      await yuborishPprText({
        body: { comment: sendComment },
        id: sts.yuborish_id,
      }).unwrap();
      toast.success("Muvaffaqiyatli yuborildi!");
      setSendComment("");
    } catch {
      toast.error("Nimadir xato ketdi");
    }
  }, [sts, sendComment, yuborishPprText]);

  const handleReject = useCallback(async () => {
    try {
      await postTastiqlash({
        body: {
          comment: rejectComment,
          yuborish_paketi: sts.yuborish_id,
          status: "rad_etildi",
        },
      }).unwrap();
      toast.success("Qaytarildi!");
      setRejectComment("");
    } catch {
      toast.error("Xatolik yuz berdi!");
    }
  }, [sts, rejectComment, postTastiqlash]);

  const handleSubmitDate = useCallback(async () => {
    try {
      await PPrniJonatishPost(DataDate).unwrap();
      toast.success("Muvaffaqiyatli yuborildi!");
    } catch (error) {
      toast.error(
        error?.data?.detail ||
          error?.data?.message ||
          error?.data?.[0] ||
          "Xatolik yuz berdi",
      );
    }
  }, [DataDate, PPrniJonatishPost]);

  const isBolim = me?.role === "bolim";

  return (
    <Sheet>
      {/* ── Floating Banner ── */}
      <Banner
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md rounded-xl
                   border border-primary/20 bg-primary shadow-lg shadow-primary/20"
      >
        <BannerIcon icon={CircleAlert} />
        <BannerTitle className="font-medium tracking-tight">
          PPR jadvalni tastiqlang!
        </BannerTitle>
        <SheetTrigger asChild>
          <BannerAction className="text-primary-foreground hover:text-primary-foreground/70 font-medium">
            Batafsil ko'rish
          </BannerAction>
        </SheetTrigger>
        <BannerClose className="text-primary-foreground hover:text-primary-foreground/70" />
      </Banner>

      {/* ── Sheet Panel ── */}
      <SheetContent className="w-full sm:w-[480px] flex flex-col p-0 gap-0">
        {/* Header */}
        <SheetHeader className="px-5 pt-5 pb-3 border-b shrink-0 space-y-3">
          <div>
            <SheetTitle className="text-base font-semibold tracking-tight">
              PPR jadvalidagi ishlar
            </SheetTitle>
            <SheetDescription className="text-xs mt-0.5 leading-snug">
              Tuzilma va bo'lim raxbarlari bilan oylik PPR jadvalni tasdiqlab
              olish
            </SheetDescription>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-8 h-8 text-sm rounded-lg"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Status tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full h-8">
              {STATUSES.map((st) => (
                <TabsTrigger
                  key={st.value}
                  value={st.value}
                  className="text-xs px-1"
                >
                  {st.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Pagination mini */}
          <div className="flex items-center justify-between">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="h-7 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5 mr-0.5" /> Ortga
            </Button>
            <span className="text-xs text-muted-foreground tabular-nums">
              {page} / {totalPages || 1}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages}
              className="h-7 text-xs"
            >
              Oldinga <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
            </Button>
          </div>
        </SheetHeader>

        {/* List */}
        <ScrollArea className="flex-1 px-4 py-3 overflow-y-scroll">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
            </div>
          ) : data?.results?.length === 0 ? (
            <Empty className="py-10">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <IconError404
                    stroke={1.5}
                    className="h-10 w-10 text-muted-foreground"
                  />
                </EmptyMedia>
                <EmptyTitle className="text-sm">Ma'lumot topilmadi</EmptyTitle>
                <EmptyDescription className="text-xs">
                  Iltimos qaytadan urinib ko'ring
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-2">
              {data.results.map((item, index) => (
                <Popover key={item.id ?? index}>
                  <PopoverTrigger asChild>
                    <Card
                      onClick={() => setSts(item)}
                      className="cursor-pointer hover:bg-accent/60 transition-colors duration-150 border border-border/60"
                    >
                      <CardHeader className="px-4 py-3">
                        <CardTitle className="flex justify-between items-center text-sm font-medium">
                          <span>
                            {item.yil}-yil {item.oy_nomi}
                          </span>
                          <Badge
                            variant={BADGE_VARIANT[item.status] ?? "default"}
                            className="text-xs"
                          >
                            {item.status}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="flex justify-between items-center text-xs mt-0.5">
                          <span className="truncate max-w-[55%]">
                            Yaratuvchi: {item.yaratuvchi_user}
                          </span>
                          <span className="text-muted-foreground/70">
                            {item.yaratilgan_sana}
                          </span>
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </PopoverTrigger>

                  <PopoverContent
                    align="end"
                    className="w-[380px] p-0 shadow-lg"
                  >
                    {/* History */}
                    <ApprovalHistory
                      sts={sts}
                      step={step}
                      onBack={(e) => {
                        e.stopPropagation();
                        setStep((p) => Math.max(p - 1, 0));
                      }}
                      onNext={(e) => {
                        e.stopPropagation();
                        setStep((p) =>
                          Math.min(
                            p + 1,
                            (sts?.tasdiqlashlar?.length ?? 1) - 1,
                          ),
                        );
                      }}
                    />

                    {/* Action buttons */}
                    <div className="flex items-center justify-between border-t px-3 py-2 bg-muted/30">
                      {isBolim ? (
                        <ActionPopover
                          label="Yuborish"
                          icon={Send}
                          colorClass="text-primary"
                          textValue={sendComment}
                          onTextChange={setSendComment}
                          onSubmit={handleSend}
                          isLoading={loadYuborish}
                          disabled={
                            item.status === "tasdiqlandi" ||
                            item.status === "yuborildi" ||
                            item.status === "bajarildi"
                          }
                        />
                      ) : (
                        <ActionPopover
                          label="Tastiqlash"
                          icon={CircleCheckBig}
                          colorClass="text-green-600 dark:text-green-400"
                          textValue={confirmComment}
                          onTextChange={setConfirmComment}
                          onSubmit={handleConfirm}
                          isLoading={tastiqlashLoading}
                          disabled={
                            item.status === "tasdiqlandi" ||
                            me?.role === "monitoring"
                          }
                        />
                      )}

                      <ActionPopover
                        label="Qaytarish"
                        icon={Reply}
                        colorClass="text-destructive"
                        textValue={rejectComment}
                        onTextChange={setRejectComment}
                        onSubmit={handleReject}
                        isLoading={tastiqlashLoading}
                        disabled={
                          me?.role !== "tarkibiy" ||
                          item.status === "bajarildi" ||
                          item.status === "tasdiqlandi" ||
                          item.status === "rad_etildi"
                        }
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <SheetFooter className="shrink-0 px-5 py-4 border-t bg-background">
          <div className="flex gap-3 w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button className="flex-1 h-9 text-sm font-medium">
                  PPR sanasini jo'natish
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                <p className="text-sm font-medium mb-3">Sana tanlang</p>
                <div className="flex gap-3">
                  {/* Year */}
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Yil</Label>
                    <Select
                      value={DataDate.yil}
                      onValueChange={(v) =>
                        setDataDate((p) => ({ ...p, yil: v }))
                      }
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {YEARS.map((y) => (
                            <SelectItem
                              key={y}
                              value={String(y)}
                              className="text-sm"
                            >
                              {y}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Month */}
                  <div className="flex-1 space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Oy</Label>
                    <Select
                      value={DataDate.oy}
                      onValueChange={(v) =>
                        setDataDate((p) => ({ ...p, oy: v }))
                      }
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {MONTHS.map((m, i) => (
                            <SelectItem
                              key={i}
                              value={String(i + 1)}
                              className="text-sm"
                            >
                              {m}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="mt-3 flex justify-end">
                      <Button
                        size="sm"
                        className="h-8 text-sm"
                        onClick={handleSubmitDate}
                        disabled={!finded_respect_btn || jonatishLoading}
                      >
                        {jonatishLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                        ) : (
                          <SendHorizontal className="h-3.5 w-3.5 mr-1" />
                        )}
                        Jo'natish
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Faqat to'ldirilgan oylarni yubora olasiz!
                  </TooltipContent>
                </Tooltip>
              </PopoverContent>
            </Popover>

            <SheetClose asChild>
              <Button variant="outline" className="flex-1 h-9 text-sm">
                Bekor qilish
              </Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
