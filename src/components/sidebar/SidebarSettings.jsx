"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useSidebar } from "@/context/sidebar-context";
import { Settings } from "lucide-react";
import { useState } from "react";

export default function SidebarSettings() {
  const [open, setOpen] = useState(false);
  const {
    position,
    setPosition,
    collapsed,
    setCollapsed,
    overlay,
    setOverlay,
    width,
    setWidth,
    autoClose,
    setAutoClose,
  } = useSidebar();

  return (
    <>
      {/* FLOAT BUTTON */}
      <Button
        size="icon"
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
        onClick={() => setOpen(!open)}
      >
        <Settings />
      </Button>

      {/* PANEL */}
      {open && (
        <Card className="fixed bottom-20 right-6 w-80 z-50 shadow-xl">
          <CardHeader>
            <CardTitle>Sidebar sozlamalari</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* POSITION */}
            <div className="flex items-center justify-between">
              <span>Joylashuvi</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPosition(position === "left" ? "right" : "left")
                }
              >
                {position === "left" ? "Chap" : "O‘ng"}
              </Button>
            </div>

            {/* COLLAPSE */}
            <div className="flex items-center justify-between">
              <span>Collapse</span>
              <Switch checked={collapsed} onCheckedChange={setCollapsed} />
            </div>

            {/* OVERLAY */}
            <div className="flex items-center justify-between">
              <span>Overlay</span>
              <Switch checked={overlay} onCheckedChange={setOverlay} />
            </div>

            {/* AUTO CLOSE */}
            <div className="flex items-center justify-between">
              <span>Auto close</span>
              <Switch checked={autoClose} onCheckedChange={setAutoClose} />
            </div>

            {/* WIDTH */}
            <div className="space-y-2">
              <span>Kengligi</span>
              <Slider
                min={200}
                max={360}
                step={10}
                value={[width]}
                onValueChange={(v) => setWidth(v[0])}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
