import { Activity } from "lucide-react";

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground leading-tight">{title}</h1>
        </div>
      </div>
      {subtitle && <p className="text-muted-foreground text-sm ml-13">{subtitle}</p>}
    </div>
  );
}
