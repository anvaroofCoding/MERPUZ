import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGridDaashoardQuery } from "@/services/api";

export function SectionCards() {
  const { data, isLoading } = useGridDaashoardQuery();
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Yillik PPRLAR</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data?.stats?.ppr?.count}ta
          </CardTitle>
          <CardAction>
            {data?.stats?.ppr?.growth_percentage > 0 ? (
              <Badge variant="outline">
                <IconTrendingUp />
                {data?.stats?.ppr?.growth_percentage}%
              </Badge>
            ) : (
              ""
            )}
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Mavjud Arizalar</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data?.stats?.total_arizalar?.count}ta
          </CardTitle>
          <CardAction>
            {data?.stats?.total_arizalar?.growth_percentage > 0 ? (
              <Badge variant="outline">
                <IconTrendingUp />
                {data?.stats?.total_arizalar?.growth_percentage}%
              </Badge>
            ) : (
              ""
            )}
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Bajarilgan arizalar</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data?.stats?.completed_arizalar?.count}ta
          </CardTitle>
          <CardAction>
            {data?.stats?.total_arizalar?.growth_percentage > 0 ? (
              <Badge variant="outline">
                <IconTrendingUp />
                {data?.stats?.total_arizalar?.growth_percentage}%
              </Badge>
            ) : (
              ""
            )}
          </CardAction>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Foydalanuvchilar</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data?.user_growth?.total_users}ta
          </CardTitle>
          <CardAction>
            {data?.user_growth?.new_users_this_month > 0 ? (
              <Badge variant="outline">
                <IconTrendingUp />
                Bu oy {data?.user_growth?.new_users_this_month}ta qo'shildi
              </Badge>
            ) : (
              ""
            )}
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
