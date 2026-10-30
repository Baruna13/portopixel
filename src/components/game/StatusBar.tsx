import { cn } from "@/lib/utils";

interface StatusBarProps {
  label: string;
  value: number;
  segments?: number;
  colorClass?: string;
  valueLabel?: string;
}

export function StatusBar({ label, value, segments = 10, colorClass = "bg-primary", valueLabel }: StatusBarProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="font-label-sm text-label-sm text-on-surface-variant">{label}</span>
        {valueLabel && <span className="font-label-sm text-label-sm text-on-surface-variant">{valueLabel}</span>}
      </div>
      <div
        className="h-3 w-full bg-surface-variant border-2 border-surface-container-highest flex p-[2px] gap-[2px]"
        role="img"
        aria-label={`${label} ${valueLabel ?? `${value}/${segments}`}`}
      >
        {Array.from({ length: segments }).map((_, i) => (
          <div key={i} className={cn("flex-1", i < value ? colorClass : "bg-transparent")} />
        ))}
      </div>
    </div>
  );
}
