"use client";

import { useState, Suspense }        from "react";
import { useSearchParams }           from "next/navigation";
import { motion, AnimatePresence }   from "framer-motion";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { Button }                    from "@/components/ui/button";
import { Input }                     from "@/components/ui/input";
import { Label }                     from "@/components/ui/label";
import { useProgressRouter }         from "@/hooks/useProgressRouter";
import LoginSkeleton                 from "@/components/auth/LoginSkeleton";

function ResetPasswordForm() {
  const router                  = useProgressRouter();
  const params                  = useSearchParams();
  const token                   = params.get("token");

  const [password,     setPassword]     = useState("");
  const [confirm,      setConfirm]      = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [success,      setSuccess]      = useState(false);

  const passwordsMatch = password === confirm && confirm.length > 0;
  const isStrong       = password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch)  return setError("Passwords do not match.");
    if (!isStrong)        return setError("Password must be at least 8 characters.");
    if (!token)           return setError("Invalid reset link.");

    setLoading(true);
    setError("");

    const res  = await fetch("/api/auth/reset-password", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ token, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.replace("/login"), 2500);
    } else {
      setError(data.error ?? "Something went wrong.");
    }

    setLoading(false);
  };

  if (!token) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <XCircle size={24} className="text-red-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold tracking-tighter text-foreground">
            Invalid link
          </h1>
          <p className="text-sm text-muted-foreground">
            This reset link is invalid or has expired.
          </p>
        </div>
        <Button className="rounded-full w-full" onClick={() => router.push("/forgot-password")}>
          Request a new link
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">

      {/* Success */}
      {success ? (
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
              Password updated
            </h1>
            <p className="text-sm text-muted-foreground">
              Your password has been reset. Redirecting you to sign in...
            </p>
          </div>
          <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-foreground rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "linear" }}
            />
          </div>
        </motion.div>

      ) : (

        /* Form */
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6"
        >
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tighter text-foreground">
              Set new password
            </h1>
            <p className="text-sm text-muted-foreground">
              Choose a strong password for your account.
            </p>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                New Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  minLength={8}
                  className="rounded-xl h-10 pe-9 bg-muted border-0 focus-visible:ring-1"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>

              {/* Strength indicator */}
              {password.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {[4, 8, 12].map((threshold) => (
                    <div
                      key={threshold}
                      className="flex-1 h-1 rounded-full transition-colors duration-300"
                      style={{
                        background: password.length >= threshold
                          ? password.length >= 12
                            ? "hsl(142 76% 36%)"
                            : password.length >= 8
                            ? "hsl(38 92% 50%)"
                            : "hsl(0 84% 60%)"
                          : "var(--muted)",
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  className={`rounded-xl h-10 pe-9 bg-muted border-0 focus-visible:ring-1 ${
                    confirm.length > 0
                      ? passwordsMatch
                        ? "ring-1 ring-emerald-500/40"
                        : "ring-1 ring-red-500/40"
                      : ""
                  }`}
                />
                {confirm.length > 0 && (
                  <div className="absolute end-3 top-1/2 -translate-y-1/2">
                    {passwordsMatch
                      ? <CheckCircle2 size={13} className="text-emerald-500" />
                      : <XCircle     size={13} className="text-red-500"     />
                    }
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="rounded-xl h-10 gap-2 mt-1"
              disabled={loading || !passwordsMatch || !isStrong}
            >
              {loading ? (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-background/30 border-t-background animate-spin" />
              ) : (
                "Update password"
              )}
            </Button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <ResetPasswordForm />
    </Suspense>
  );
}