import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2.5 border border-ink rounded-none bg-ink px-6 text-[13px] font-medium uppercase tracking-[.045em] text-white cursor-pointer transition-[background,color,border-color] duration-[180ms] hover:border-wine hover:bg-wine disabled:cursor-default disabled:opacity-[.35]",
  {
    variants: {
      variant: {
        default: "",
        outline: "bg-transparent text-ink hover:text-white",
        ghost:
          "border-transparent bg-transparent px-2 text-ink hover:border-transparent hover:bg-transparent hover:text-red",
        inverse: "border-white bg-white text-ink hover:border-ink hover:bg-ink hover:text-white",
      },
      size: {
        default: "",
        sm: "min-h-10 px-4",
        icon: "h-11 w-11 min-h-11 shrink-0 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
