import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SegmentedButtonGroup({
  options = [],
  value, // parentdan keladigan qiymat (form.status)
  onChange,
  className,
}) {
  return (
    <div className={cn("inline-flex rounded-full bg-background", className)}>
      {options.map((option, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === options.length - 1;
        const isActive = option.value === value;

        return (
          <Button
            key={option.value}
            type="button"
            onClick={() => onChange?.(option.value)}
            variant={isActive ? "default" : "outline"}
            className={cn(
              "rounded-none px-4 py-2 transition-colors",
              isFirst && "rounded-l-full",
              isLast && "rounded-r-full",
              isActive && "bg-primary text-primary-foreground",
              !isActive && "bg-background text-foreground",
            )}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}
