import { useScans } from "@/hooks/use-scans";
import Layout from "@/components/Layout";
import { Header } from "@/components/Header";
import { ScanResultCard } from "@/components/ScanResultCard";
import { Loader2, SearchX, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function History() {
  const { data: scans, isLoading, isError } = useScans();

  // Group scans by date
  const groupedScans = scans?.reduce((acc, scan) => {
    const dateKey = scan.createdAt 
      ? format(new Date(scan.createdAt), 'MMM d, yyyy')
      : 'Unknown Date';
    
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(scan);
    return acc;
  }, {} as Record<string, typeof scans>);

  // Sort dates descending
  const sortedDates = Object.keys(groupedScans || {}).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <Layout>
      <Header 
        title="History" 
        subtitle="Previous analysis results" 
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
          <p>Loading history...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-destructive bg-destructive/5 rounded-2xl border border-destructive/20">
          <p>Failed to load history.</p>
        </div>
      ) : !scans || scans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <SearchX className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No scans yet</h3>
          <p className="text-muted-foreground max-w-[200px] mt-2">
            Your analysis history will appear here once you scan a leaf.
          </p>
        </div>
      ) : (
        <div className="space-y-6 pb-20 animate-in slide-in-from-bottom-4 duration-500">
          {sortedDates.map((date) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3 ml-1">
                <Calendar className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {date}
                </h3>
              </div>
              <div className="space-y-3">
                {groupedScans?.[date]?.map((scan) => (
                  <ScanResultCard key={scan.id} scan={scan} compact />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
