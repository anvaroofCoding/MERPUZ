import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import { useGridDaashoardQuery } from "@/services/api";

export function SectionCards() {
  const { data, isLoading } = useGridDaashoardQuery();

  const stats = data?.stats ? Object.values(data.stats) : [1, 2, 3, 4]; // loading paytida 4 skeleton chiqadi

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item, index) => {
        const growth = item?.growth_percentage ?? 0;

        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader>
              {/* Title */}
              {isLoading ? (
                <Skeleton className="h-4 w-28" />
              ) : (
                <CardDescription>{item.title}</CardDescription>
              )}

              {/* Count */}
              {isLoading ? (
                <Skeleton className="h-8 w-20 mt-2" />
              ) : (
                <CardTitle className="text-3xl font-semibold tabular-nums">
                  {item.count} ta
                </CardTitle>
              )}

              {/* Growth */}
              {!isLoading && (
                <CardAction>
                  <Badge variant="outline" className="flex gap-1 items-center">
                    {growth >= 0 ? (
                      <IconTrendingUp size={16} />
                    ) : (
                      <IconTrendingDown size={16} />
                    )}
                    {Math.abs(growth)}%
                  </Badge>
                </CardAction>
              )}
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
