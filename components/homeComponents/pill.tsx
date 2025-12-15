export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-foreground/20 bg-background px-3 py-1 text-xs font-medium text-foreground">
      {children}
    </span>
  );
}