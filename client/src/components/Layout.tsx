import { Link, useLocation } from "wouter";
import { Leaf, History, Home, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-green-50/30 to-background dark:from-background dark:to-background overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px]" />
      </div>

      {/* Main Content Area - Scrollable */}
      <main className="flex-1 overflow-y-auto pb-24 relative z-10 scroll-smooth">
        <div className="max-w-md mx-auto w-full min-h-full p-4 md:p-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border/50 pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-around p-2">
          <NavItem 
            href="/" 
            active={location === "/"} 
            icon={<Home className="w-6 h-6" />} 
            label="Scan" 
          />
          
          <div className="relative -top-6">
            <Link href="/" className="flex items-center justify-center">
              <div className="w-14 h-14 rounded-full primary-gradient shadow-lg shadow-primary/30 flex items-center justify-center transform transition-transform active:scale-95 hover:scale-105 border-4 border-background">
                <Leaf className="w-7 h-7 text-white" />
              </div>
            </Link>
          </div>

          <NavItem 
            href="/history" 
            active={location === "/history"} 
            icon={<History className="w-6 h-6" />} 
            label="History" 
          />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ href, active, icon, label }: { href: string; active: boolean; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex-1 flex flex-col items-center justify-center py-2 group cursor-pointer">
      <div className={cn(
        "transition-colors duration-300",
        active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
      )}>
        {icon}
      </div>
      <span className={cn(
        "text-[10px] font-medium mt-1 transition-colors duration-300",
        active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
      )}>
        {label}
      </span>
    </Link>
  );
}
