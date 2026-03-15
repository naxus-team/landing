"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n-context";

type ThemeOption = "light" | "dark" | "system";

const OPTIONS: { value: ThemeOption; icon: React.ReactNode }[] = [
  { value: "light",  icon: <Sun size={11} />    },
  { value: "system", icon: <Monitor size={11} /> },
  { value: "dark",   icon: <Moon size={11} />    },
];

const PILL  = 28;
const GAP   = 2;
const STEP  = PILL + GAP;
const WIDE  = 44;

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { isRTL }           = useI18n();
  const [mounted, setMounted] = useState(false);

  // نحتاج نحفظ الـ animation state يدوياً
  const [animX,     setAnimX]     = useState<number[]>([0]);
  const [animWidth, setAnimWidth] = useState<number[]>([PILL]);
  const prevIndexRef = useRef(1); // system = default (index 1)

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const idx = OPTIONS.findIndex((o) => o.value === theme);
    if (idx === -1) return;

    const newX    = idx * STEP;
    const prevX   = prevIndexRef.current * STEP;
    const goRight = isRTL ? newX < prevX : newX > prevX;

    /*
      goRight → تمدد من اليمين:
        x stays at prevX first, then jumps to newX
        width: 28 → 44 → 28

      goLeft → تمدد من الشمال:
        x jumps to newX immediately
        width: 28 → 44 → 28
    */
    if (goRight) {
      setAnimX([prevX, prevX, newX]);
    } else {
      setAnimX([prevX, newX, newX]);
    }
    setAnimWidth([PILL, WIDE, PILL]);

    prevIndexRef.current = idx;
  }, [theme, mounted, isRTL]);

  if (!mounted) {
    return <div className="rounded-full bg-muted border h-8" style={{ width: OPTIONS.length * STEP + 2 }} />;
  }

  const handleChange = (value: ThemeOption) => {
    if (value === theme) return;
    setTheme(value);
  };

  // LTR: left=2 ثابت، نحرك x
  // RTL:  right=2 ثابت، نحرك x بالعكس
  const rtlX = animX.map((x) => {
    const maxX = (OPTIONS.length - 1) * STEP;
    return (maxX - x-STEP*2);
  });

  return (
    <div
      className="relative flex items-center rounded-full p-0.5 bg-muted h-8"
      style={{
        width: OPTIONS.length * STEP + 2,
        gap: GAP,
        direction: "ltr", // الـ pill دايماً LTR internally
      }}
    >
      {/* Pill */}
      <motion.div
        className="absolute rounded-full bg-background shadow-sm pointer-events-none"
        animate={{
          x:     isRTL ? rtlX     : animX,
          width: animWidth,
        }}
        transition={{
          duration: 0.45,
          ease: [0.45, 0, 0.8, 1],
          times: [0, 0.45, 1],
        }}
        style={{
          left:   isRTL ? "auto" : 2,
          right:  isRTL ? 2      : "auto",
          height: PILL,
          width:  PILL,
        }}
      />

      {/* Buttons — ترتيب بحسب اللغة */}
      {(isRTL ? [...OPTIONS].reverse() : OPTIONS).map(({ value, icon }) => {
        const isActive = theme === value;
        return (
          <button
            key={value}
            onClick={() => handleChange(value)}
            className={`relative z-10 flex items-center justify-center rounded-full transition-colors duration-100 ${
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            style={{ width: PILL, height: PILL, flexShrink: 0 }}
            aria-label={value}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}