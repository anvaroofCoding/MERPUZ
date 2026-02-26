import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-[color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/90",

        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/90",

        destructive:
          "border-transparent bg-red-600 text-white hover:bg-destructive/90",

        outline:
          "border border-input text-foreground hover:bg-accent hover:text-accent-foreground",

        /** 🟢 BAJARILGAN */
        success:
          "border-transparent bg-green-700 text-white hover:bg-green-600",

        /** 🟠 JARAYONDA */
        warning:
          "border-transparent bg-orange-400 text-white hover:bg-orange-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({ className, variant, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

