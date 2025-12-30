import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useDeletePPRMonthMutation,
  usePprMonthDetailsQuery,
} from "@/services/api";
import { Building2, CalendarDays, Loader, Trash2, Wrench } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import EditPPRMonth from "./edit.ppr.month";

export default function PprMonthDetails() {
  const { id } = useParams();
  const { data, isLoading } = usePprMonthDetailsQuery(id);
  const [deletePPR, { isLoading: loads }] = useDeletePPRMonthMutation();
  const navigate = useNavigate();
  const handleDelete = async () => {
    try {
      await deletePPR(id).unwrap();
      toast.success("Muvaffaqiyatli o‘chirildi");
      navigate(-1)
    } catch (error) {
      toast.error("O‘chirishda xatolik");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="rounded-2xl">
            <CardHeader>
              <Skeleton className="h-5 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Asosiy ma'lumotlar */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wrench className="h-5 w-5" /> PPR ma'lumotlari
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">PPR turi</span>
            <Badge>{data.ppr_turi_name}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Davriyligi</span>
            <span>{data.ppr_davriyligi} kun</span>
          </div>
        </CardContent>
      </Card>

      {/* Obyekt */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5" /> Obyekt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Nomi</span>
            <span>{data.obyekt_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">ID</span>
            <span>#{data.obyekt}</span>
          </div>
        </CardContent>
      </Card>

      {/* Sanalar */}
      <Card className="rounded-2xl md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarDays className="h-5 w-5" /> Vaqt oralig'i
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Boshlash sanasi</p>
            <p className="font-medium">{data.boshlash_sanasi}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Yakunlash sanasi</p>
            <p className="font-medium">{data.yakunlash_sanasi}</p>
          </div>
        </CardContent>
      </Card>

      {/* Izoh */}

      {data.comment && (
        <Card className="rounded-2xl md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Izoh</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {data.comment}
          </CardContent>
        </Card>
      )}
      {/* Action buttons */}
      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
        <EditPPRMonth startData={data} />
        {loads ? (
          <button
            disabled={loads}
            className="inline-flex items-center gap-2 rounded-xl border border-destructive text-destructive px-4 py-2 text-sm hover:bg-destructive/10 transition"
          >
            <Loader className="h-4 w-4 animate-spin" /> O'chirilmoqda...
          </button>
        ) : (
          <button
            disabled={loads}
            onClick={handleDelete}
            className="inline-flex items-center gap-2 rounded-xl border border-destructive text-destructive px-4 py-2 text-sm hover:bg-destructive/10 transition"
          >
            <Trash2 className="h-4 w-4" /> O'chirish
          </button>
        )}
      </div>
    </div>
  );
}
