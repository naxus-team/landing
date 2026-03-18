import { ArrowUpRight } from "lucide-react";
import { Button }       from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">

      <div className="flex flex-col items-center gap-6 max-w-sm text-center">

        <div className="flex items-end gap-1">
          <span
            className="text-[8rem] font-extrabold leading-none tracking-tighter text-foreground"
            style={{ lineHeight: 1 }}
          >
            4
          </span>
          <div className="flex flex-col items-center pb-3">
            <div className="w-14 h-14 rounded-full border-4 border-foreground" />
          </div>
          <span
            className="text-[8rem] font-extrabold leading-none tracking-tighter text-foreground"
            style={{ lineHeight: 1 }}
          >
            4
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Page not found
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button className="rounded-full gap-2" asChild>
            <a href="/">
              Go home
              <ArrowUpRight size={13} />
            </a>
          </Button>
          <Button variant="outline" className="rounded-full" asChild>
            <a href="/dashboard">Dashboard</a>
          </Button>
        </div>
      </div>
    </div>
  );
}