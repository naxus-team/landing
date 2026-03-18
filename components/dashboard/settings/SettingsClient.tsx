"use client";

import { useState }      from "react";
import { useTheme }      from "next-themes";
import { useThemeColor } from "@/lib/theme-context";
import { useI18n }       from "@/lib/i18n-context";
import { THEMES, THEME_PREVIEWS, type ThemeColor } from "@/lib/theme";
import { Button }        from "@/components/ui/button";
import { Separator }     from "@/components/ui/separator";
import { Sun, Moon, Monitor, Check, Languages } from "lucide-react";
import { type JWTPayload } from "@/lib/auth/jwt";
import LangDialog        from "@/components/common/LangDialog";

const THEME_COLORS = Object.keys(THEMES) as ThemeColor[];

type Props = { user: JWTPayload };

export default function SettingsClient({ user }: Props) {
  const { theme, setTheme }   = useTheme();
  const { color, setColor }   = useThemeColor();
  const { t, locale }         = useI18n();
  const [saving, setSaving]   = useState(false);
  const [saved,  setSaved]    = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-full">

      {/* Header */}
      <div>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
          Settings
        </p>
        <h1 className="text-2xl font-extrabold tracking-tighter text-foreground">
          Preferences
        </h1>
      </div>

      {/* ── Appearance ── */}
      <section className="flex flex-col gap-5 p-5 rounded-2xl border bg-card">
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-0.5">Appearance</h2>
          <p className="text-xs text-muted-foreground">Customize the look and feel.</p>
        </div>

        <Separator />

        {/* Mode */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Mode
          </p>
          <div className="flex gap-2">
            {[
              { value: "light",  icon: Sun,     label: "Light"  },
              { value: "system", icon: Monitor, label: "System" },
              { value: "dark",   icon: Moon,    label: "Dark"   },
            ].map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border flex-1 transition-all duration-150 ${
                  theme === value
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                <span className="text-[10px] font-mono">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Color theme */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            Color Theme
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {THEME_COLORS.map((c) => {
              const preview  = THEME_PREVIEWS[c];
              const isActive = color === c;
              return (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-150 ${
                    isActive
                      ? "border-foreground shadow-sm"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  {/* Preview swatch */}
                  <div
                    className="w-8 h-8 rounded-full border shadow-inner"
                    style={{ background: preview.bg, borderColor: preview.fg + "22" }}
                  >
                    <div
                      className="w-4 h-4 rounded-full mt-2 ms-2"
                      style={{ background: preview.fg }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {THEMES[c].name}
                  </span>
                  {isActive && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-foreground flex items-center justify-center">
                      <Check size={9} className="text-background" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Language ── */}
      <section className="flex flex-col gap-5 p-5 rounded-2xl border bg-card">
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-0.5">Language</h2>
          <p className="text-xs text-muted-foreground">
            Currently: <span className="font-medium text-foreground">{locale.toUpperCase()}</span>
          </p>
        </div>

        <Separator />

        <div className="flex items-center gap-3">
          <Languages size={14} className="text-muted-foreground" />
          <span className="text-sm text-foreground">Change language</span>
          <div className="ms-auto">
            <LangDialog />
          </div>
        </div>
      </section>

      {/* ── Account ── */}
      <section className="flex flex-col gap-5 p-5 rounded-2xl border bg-card">
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-0.5">Account</h2>
          <p className="text-xs text-muted-foreground">Your account information.</p>
        </div>

        <Separator />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Name",  value: user.name  },
            { label: "Email", value: user.email },
            { label: "Role",  value: user.role  },
          ].map((field) => (
            <div key={field.label} className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                {field.label}
              </span>
              <span className="text-sm text-foreground font-medium">{field.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center gap-3">
        <Button
          className="rounded-full gap-2"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <span className="w-3.5 h-3.5 rounded-full border-2 border-background/30 border-t-background animate-spin" />
          ) : saved ? (
            <>
              <Check size={13} />
              Saved
            </>
          ) : (
            "Save Preferences"
          )}
        </Button>
      </div>
    </div>
  );
}