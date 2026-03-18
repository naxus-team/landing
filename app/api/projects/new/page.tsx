"use client";

import { useState }    from "react";
import { motion }      from "framer-motion";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { Button }      from "@/components/ui/button";
import { Input }       from "@/components/ui/input";
import { Label }       from "@/components/ui/label";

export default function NewProjectPage() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form  = new FormData(e.currentTarget);
    const price = form.get("price") as string;

    const res = await fetch("/api/projects", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        name:        form.get("name"),
        description: form.get("description"),
        price:       price ? Number(price) : undefined,
        start_date:  form.get("start_date") || undefined,
        end_date:    form.get("end_date")   || undefined,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = `/dashboard/projects/${data.project.id}`;
    } else {
      setError(data.error ?? "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" className="rounded-full w-8 h-8" asChild>
          <a href="/dashboard/projects">
            <ArrowLeft size={14} />
          </a>
        </Button>
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-0.5">
            Projects
          </p>
          <h1 className="text-2xl font-extrabold tracking-tighter text-foreground">
            New Project
          </h1>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Project Name
          </Label>
          <Input
            name="name"
            required
            placeholder="e.g. FinTrack Platform"
            className="rounded-xl h-10 bg-muted border-0 focus-visible:ring-1"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Description
          </Label>
          <textarea
            name="description"
            rows={3}
            placeholder="Brief description of the project..."
            className="px-3 py-2.5 rounded-xl bg-muted border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Budget (USD)
          </Label>
          <Input
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 5000"
            className="rounded-xl h-10 bg-muted border-0 focus-visible:ring-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              Start Date
            </Label>
            <Input
              name="start_date"
              type="date"
              className="rounded-xl h-10 bg-muted border-0 focus-visible:ring-1"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
              End Date
            </Label>
            <Input
              name="end_date"
              type="date"
              className="rounded-xl h-10 bg-muted border-0 focus-visible:ring-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            className="rounded-full gap-2"
            disabled={loading}
          >
            {loading ? (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-background/30 border-t-background animate-spin" />
            ) : (
              <>
                Create Project
                <ArrowUpRight size={13} />
              </>
            )}
          </Button>
          <Button variant="ghost" className="rounded-full" asChild>
            <a href="/dashboard/projects">Cancel</a>
          </Button>
        </div>
      </form>
    </div>
  );
}