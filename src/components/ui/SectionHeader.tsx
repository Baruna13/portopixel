interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  meta?: string;
}

export function SectionHeader({ title, subtitle, meta }: SectionHeaderProps) {
  return (
    <div className="mb-2 pb-4 border-b-[4px] border-primary">
      <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-primary flex items-center gap-4">
        <span aria-hidden="true" className="inline-block animate-bounce text-secondary">
          ▶
        </span>
        {title}
      </h1>
      {subtitle && (
        <p className="font-headline-md text-headline-md text-on-surface-variant mt-2">{subtitle}</p>
      )}
      {meta && (
        <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2 mt-2">
          <span aria-hidden="true" className="w-2 h-2 bg-secondary inline-block animate-pulse" />
          {meta}
        </p>
      )}
    </div>
  );
}
