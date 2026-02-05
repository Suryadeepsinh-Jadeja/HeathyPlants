import { Scan } from "@shared/schema";
import { CheckCircle, AlertTriangle, Info, Calendar } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ScanResultCardProps {
  scan: Scan;
  compact?: boolean;
}

export function ScanResultCard({ scan, compact = false }: ScanResultCardProps) {
  const isHealthy = scan.topLabel.toLowerCase().includes("healthy");
  const confidence = parseFloat(scan.confidence);
  
  // Format confidence nicely
  const confidenceDisplay = (confidence * 100).toFixed(1) + "%";
  
  // Determine status color
  const statusColor = isHealthy 
    ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400"
    : "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400";

  if (compact) {
    return (
      <div className="bg-card hover:bg-accent/5 rounded-2xl p-4 border border-border shadow-sm hover:shadow-md transition-all flex items-center gap-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted border border-border/50">
          <img 
            src={scan.imageUrl} 
            alt="Scan thumbnail" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-foreground truncate pr-2">{scan.topLabel}</h3>
            <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", statusColor)}>
              {confidenceDisplay}
            </span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1" />
            {scan.createdAt ? format(new Date(scan.createdAt), 'MMM d, yyyy') : 'Just now'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-3xl p-6 border border-border shadow-lg shadow-black/5 animate-in fade-in zoom-in duration-300">
      <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-muted shadow-inner">
        <img 
          src={scan.imageUrl} 
          alt="Analyzed leaf" 
          className="w-full h-full object-contain"
        />
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-medium border border-white/10">
          {format(new Date(scan.createdAt || new Date()), 'h:mm a')}
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">{scan.topLabel}</h2>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-semibold">
          <Activity className="w-4 h-4" />
          <span>Confidence: {confidenceDisplay}</span>
        </div>
      </div>

      <div className="space-y-3">
        {isHealthy ? (
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl p-4 flex gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-emerald-900 dark:text-emerald-200">Healthy Plant</h4>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                No disease symptoms detected. Continue regular care and monitoring.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-900 dark:text-amber-200">Disease Detected</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Symptoms match {scan.topLabel}. Consider consulting a specialist or applying appropriate treatment.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
