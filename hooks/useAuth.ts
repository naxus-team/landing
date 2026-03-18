"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { type AuthUser } from "@/types/auth";

type AuthState = {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
};

export function useAuth() {
    const router = useRouter();
    const [state, setState] = useState<AuthState>({
        user: null,
        loading: true,
        error: null,
    });

    const fetchUser = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/me");
            if (res.ok) {
                const { user } = await res.json();
                setState({ user, loading: false, error: null });
            } else {
                setState({ user: null, loading: false, error: null });
            }
        } catch {
            setState({ user: null, loading: false, error: null });
        }
    }, []);

    useEffect(() => { fetchUser(); }, [fetchUser]);

    const login = useCallback(async (email: string, password: string) => {
        setState((s) => ({ ...s, loading: true, error: null }));

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
            setState({ user: data.user, loading: false, error: null });
            router.replace("/dashboard");
        } else {
            setState((s) => ({ ...s, loading: false, error: data.error }));
        }
    }, []);

    const register = useCallback(async (name: string, email: string, password: string) => {
        setState((s) => ({ ...s, loading: true, error: null }));
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (res.ok) {
            setState({ user: data.user, loading: false, error: null });
            router.replace("/dashboard");
        } else {
            setState((s) => ({ ...s, loading: false, error: data.error }));
        }
    }, []);

    const logout = useCallback(async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setState({ user: null, loading: false, error: null });
        window.location.href = "/";
    }, []);

    return {
        user: state.user,
        loading: state.loading,
        error: state.error,
        isAuth: !!state.user,
        login,
        register,
        logout,
    };
}