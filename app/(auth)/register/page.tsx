"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Eye, EyeOff, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n-context";
import RegisterSkeleton from "@/components/auth/RegisterSkeleton";
import { useProgressRouter } from "@/hooks/useProgressRouter";

function RegisterForm() {
    const router = useProgressRouter();
    const { register, loading, error } = useAuth();
    const { t } = useI18n();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        register(name, email, password);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
        >
            <div className="space-y-1">
                <h1 className="text-2xl font-extrabold tracking-tighter text-foreground">
                    {t.auth.registerTitle}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {t.auth.registerSubtitle}
                </p>
            </div>

            {error && (
                <p className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 text-center">
                    {error}
                </p>
            )}

            <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="rounded-xl gap-2 h-10" asChild>
                    <a href="/api/auth/oauth/google">
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                    </a>
                </Button>
                <Button variant="outline" className="rounded-xl gap-2 h-10" asChild>
                    <a href="/api/auth/oauth/github">
                        <Github size={14} />
                        GitHub
                    </a>
                </Button>
            </div>

            <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                    {t.auth.orContinueWith}
                </span>
                <Separator className="flex-1" />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        {t.auth.name}
                    </Label>
                    <div className="relative">
                        <User size={13} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t.auth.namePlaceholder}
                            className="rounded-xl h-10 ps-9 bg-muted border-0 focus-visible:ring-1"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        {t.auth.email}
                    </Label>
                    <div className="relative">
                        <Mail size={13} className="absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t.auth.emailPlaceholder}
                            className="rounded-xl h-10 ps-9 bg-muted border-0 focus-visible:ring-1"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                        {t.auth.password}
                    </Label>
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t.auth.passwordPlaceholder}
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
                </div>

                <Button
                    type="submit"
                    className="rounded-xl h-12 gap-2 mt-1 bg-foreground text-background"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-background/30 border-t-background animate-spin" />
                    ) : (
                        <>
                            {t.auth.createAccount}
                        </>
                    )}
                </Button>

                <p className="text-[10px] text-center text-muted-foreground leading-relaxed">
                    {t.auth.termsText}{" "}
                    <a href="/terms" className="underline underline-offset-2 hover:text-foreground">
                        {t.auth.terms}
                    </a>{" "}
                    {t.auth.and}{" "}
                    <a href="/privacy" className="underline underline-offset-2 hover:text-foreground">
                        {t.auth.privacy}
                    </a>
                </p>
            </form>

            <p className="text-xs text-center text-muted-foreground">
                {t.auth.hasAccount}{" "}
                <button
                    onClick={() => router.push("/login")}
                    className="text-foreground font-medium hover:underline underline-offset-4"
                >
                    {t.auth.signInLink}
                </button>
            </p>
        </motion.div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<RegisterSkeleton />}>
            <RegisterForm />
        </Suspense>
    );
}