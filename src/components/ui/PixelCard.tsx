import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface PixelCardProps extends HTMLAttributes<HTMLDivElement> {
  outerClassName?: string;
}

/** Ported from the Stitch "double frame" card pattern (thick outer + thin inner border). */
export function PixelCard({ className, outerClassName, children, ...props }: PixelCardProps) {
  return (
    <div className={cn("bg-surface-container border-[8px] border-primary p-1 shadow-[8px_8px_0_0_#020617]", outerClassName)}>
      <div className={cn("border-[4px] border-surface-variant bg-surface-container-lowest p-4", className)} {...props}>
        {children}
      </div>
    </div>
  );
}
