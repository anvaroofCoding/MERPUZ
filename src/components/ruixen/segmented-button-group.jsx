import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as React from "react";

export default function SegmentedButtonGroup({
  options,
  selected,
  onChange,
  className,
}) {
  // active endi value bo‘ladi
  const [active, setActive] = React.useState(selected ?? options?.[0]?.value);

  const handleClick = (value) => {
    setActive(value);
    onChange?.(value); // parentga value qaytadi
  };

  return (
    <div className={cn("inline-flex rounded-full bg-background", className)}>
      {options.map((option, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === options.length - 1;
        const isActive = option.value === active;

        return (
          <Button
            key={option.value}
            onClick={() => handleClick(option.value)}
            variant={isActive ? "default" : "outline"}
            className={cn(
              "rounded-none px-4 py-2",
              isFirst && "rounded-l-full",
              isLast && "rounded-r-full",
              isActive && "bg-primary text-primary-foreground",
              !isActive && "bg-background text-foreground",
            )}
          >
            {option.label} {/* ✅ FAQAT LABEL CHIQADI */}
          </Button>
        );
      })}
    </div>
  );
}
