import { Button } from "@/components/ui/button";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { CircleArrowOutUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Error401() {
  const navigate = useNavigate();
  return (
    <div className=" grid grid-cols-2 h-screen w-full">
      <div className=" flex justify-center items-center">
        <div className="flex flex-col justify-center px-10 space-y-5">
          <h1 className="text-5xl leading-none font-semibold tracking-tighter text-balance sm:text-6xl md:text-7xl lg:text-8xl text-purple-500">
            401
          </h1>
          <div>
            <p className="text-muted-foreground max-w-md">
              Sizga berilgan token muddati tugadi! Iltimos qilaman qaytadan
              shaxsiy profilingizga kiring!
            </p>
            <p className="text-muted-foreground ">
              Muammo hal bo'lmasa biz bilan bog'lanishingizni so'raymiz!
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              className={"bg-purple-500"}
              onClick={() => navigate("/no-token-and-go-login")}
            >
              Kirish <CircleArrowOutUpRight />
            </Button>
          </div>
        </div>
      </div>
      <div>
        <DotLottieReact
          src="https://lottie.host/03014d75-675d-4d3c-a4ce-39ac625f2dba/NV7awZGVSx.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
}
