import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-primary border-on-primary text-on-primary hover:bg-secondary shadow-[4px_4px_0_0_#020617]",
  secondary:
    "bg-surface-variant border-primary text-primary hover:bg-primary hover:text-on-primary shadow-[4px_4px_0_0_#020617]",
  ghost:
    "bg-surface-container border-surface-variant text-on-surface-variant hover:text-primary hover:border-primary shadow-[4px_4px_0_0_#020617]",
  danger:
    "bg-surface-container-low border-error text-error hover:bg-error hover:text-on-error shadow-[6px_6px_0_0_#7f1d1d]",
};

export const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "relative border-[4px] px-6 py-3 font-headline-md text-headline-md uppercase transition-all",
          "active:translate-x-1 active:translate-y-1 active:shadow-none",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/60",
          "disabled:opacity-40 disabled:pointer-events-none",
          VARIANT_CLASSES[variant],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);
PixelButton.displayName = "PixelButton";
