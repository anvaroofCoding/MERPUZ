"use client";

import {
  Banner,
  BannerAction,
  BannerClose,
  BannerIcon,
  BannerTitle,
} from "@/components/ui/shadcn-io/banner";
import { CircleAlert } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

export default function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🔔 Banner */}
      <Banner
        className="
          fixed
          bottom-5
          left-1/2
          -translate-x-1/2
          z-50
          w-[90%]
          max-w-md
          rounded-xl
        "
      >
        <BannerIcon icon={CircleAlert} />
        <BannerTitle>PPR jadvalini saqlashni xohlaysizmi?</BannerTitle>

        <BannerAction onClick={() => setOpen(true)}>Ha, albatta</BannerAction>

        <BannerClose />
      </Banner>

      {/* 🪟 Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-50 bg-black/70" />

          <DialogContent className="fixed left-1/2 top-1/2 z-50 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-background p-6">
            <DialogClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </DialogClose>

            <DialogHeader>
              <DialogTitle>PPR jadvalini saqlash</DialogTitle>
            </DialogHeader>

            <p className="py-4 text-sm text-muted-foreground">
              Agar siz PPR jadvalini to'ldirib bo'lmagan bo'lsangiz saqlashni
              maslahat bermaymiz!
            </p>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Bekor qilish
              </Button>

              <Button
                onClick={() => {
                  setOpen(false);
                  // 👉 shu yerda submit / save funksiyani chaqirasiz
                }}
              >
                Saqlash
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}
