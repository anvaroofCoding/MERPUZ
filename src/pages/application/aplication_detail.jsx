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
import { useAplication_detailsQuery } from "@/services/api";
import { FilePenLine, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ApplicationDetailPage() {
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

  const { data, isLoading } = useAplication_detailsQuery(id);
  if (isLoading) {
    return <div>...</div>;
  }
  console.log(data);
  return (
    <div className="min-h-[90vh] bg-background ">
      <div className=" mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 md:gap-8">
          {/* Left Column - Carousel */}
          <div className="lg:col-span-2">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">
                  {data?.tuzilma_nomi} tarkibiy tuzilmasiga jo'natilga arizdagi
                  barcha rasmlar
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <Carousel
                  setApi={setApi}
                  opts={{
                    loop: true,
                    align: "center",
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {data?.rasmlar?.map((item, index) => (
                      <CarouselItem key={index}>
                        <div className="flex items-center justify-center">
                          <Card className="border-none w-full">
                            <CardContent className="flex aspect-square items-center justify-center p-6">
                              <img
                                src={item?.rasm || "/placeholder.svg"}
                                alt={`Application image ${index + 1}`}
                                className="w-full h-full object-cover rounded"
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="hidden sm:flex -left-10" />
                  <CarouselNext className="hidden sm:flex -right-10" />
                </Carousel>
                <div className="text-muted-foreground text-center text-sm mt-4 font-medium">
                  {current} - {count}
                </div>
                <Button className="bg-red-600 hover:bg-red-500 mt-4">
                  Rasmlarni o'chirish <Trash2 />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Information Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Arizadagi ma'lumotlar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Created By */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Ariza yaratuvchi
                    </p>
                    <p className="text-lg font-medium text-foreground">
                      {data.created_by}
                    </p>
                  </div>

                  {/* Approved By */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Ariza beruvchi
                    </p>
                    <p className="text-lg font-medium text-foreground">
                      {data.kim_tomonidan}
                    </p>
                  </div>

                  {/* Structure */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Kimga
                    </p>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className="text-base px-3 py-1"
                      >
                        {data.tuzilma_nomi} tarkibiga
                      </Badge>
                    </div>
                  </div>

                  {/* Approval Status */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Ariza holati
                    </p>
                    <Badge
                      className={
                        data.status == "bajarilgan"
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-yellow-600 text-white  hover:bg-yellow-700"
                      }
                    >
                      {data.status == "bajarilgan" ? "Bajarilgan" : "Jarayonda"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comment Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Batafsil izoh</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                    {data.comment}
                  </p>
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-5">
              <Button className="bg-orange-600 hover:bg-orange-500">
                Tahrirlash <FilePenLine />
              </Button>
              <Button className="bg-red-600 hover:bg-red-500">
                Arizani o'chirish <Trash2 />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
