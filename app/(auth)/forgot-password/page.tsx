"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProgressRouter } from "@/hooks/useProgressRouter";
import LoginSkeleton from "@/components/auth/LoginSkeleton";

function ForgotPasswordForm() {
  const router = useProgressRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      setSent(true);
    } else {
      setError(data.error ?? "Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <AnimatePresence mode="wait">

      {/* Success state */}
      {sent ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-6 text-center"
        >
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 size={24} className="text-emerald-600" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tighter text-foreground">
              Check your inbox
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              If <span className="font-medium text-foreground">{email}</span> is registered,
              we've sent a password reset link. Check your spam folder if you don't see it.
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Button
              className="rounded-full"
              onClick={() => { setSent(false); setEmail(""); }}
            >
              Try a different email
            </Button>
            <Button
              variant="ghost"
              className="rounded-full"
              onClick={() => router.push("/login")}
            >
              Back to sign in
            </Button>
          </div>
        </motion.div>

      ) : (

        /* Form state */
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6"
        >
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tighter text-foreground">
              Forgot password?
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and we'll send you a reset link.
            </p>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 text-center">
              {error}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Email
              </Label>
              <div className="relative">
                <Mail size={13} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="rounded-xl h-10 ps-9 bg-muted border-0 focus-visible:ring-1"
                  autoFocus
                />
              </div>
            </div>

            <Button
              type="submit"
              className="rounded-xl h-10 gap-2 mt-1"
              disabled={loading}
            >
              {loading ? (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-background/30 border-t-background animate-spin" />
              ) : (
                "Send reset link"
              )}
            </Button>
          </form>

          {/* Back */}
          <button
            onClick={() => router.push("/login")}
            className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={12} />
            Back to sign in
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}