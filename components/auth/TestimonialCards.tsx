"use client";

import { useEffect, useRef, useState } from "react";
import { Quote }                       from "lucide-react";
import { type DBTestimonial }          from "@/lib/db/testimonials";
import Logo from "../common/Logo";

// ── Default data with real companies ──
const FALLBACK: DBTestimonial[] = [
  {
    id: "1",
    quote: "ناكسوس سلَّمت منصتنا في وقت قياسي. الجودة فاقت توقعاتنا.",
    author_name: "Jeff Reynolds",
    author_title: "Senior Engineer, Amazon",
    author_image: "/assets/teams/images/abdelrahman_khadr.jpg",
    company_id: null,
    company_name: "Amazon",
    company_logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    is_active: true,
    order_index: 0,
  },
  {
    id: "2",
    quote: "العمل مع ناكسوس كان كأن لدينا فريق داخلي يفهم رؤيتنا حقًا.",
    author_name: "Sara Mitchell",
    author_title: "Product Lead, Meta",
    author_image: "/assets/teams/images/abdelrahman_khadr.jpg",
    company_id: null,
    company_name: "Meta",
    company_logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
    is_active: true,
    order_index: 1,
  },
  {
    id: "3",
    quote: "من الاجتماع الأول حتى النشر، كانت العملية سلسة ومهنية.",
    author_name: "David Park",
    author_title: "iOS Lead, Apple",
    author_image: "/assets/teams/images/mohamed_reda.jpg",
    company_id: null,
    company_name: "Apple",
    company_logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    is_active: true,
    order_index: 2,
  },
  {
    id: "4",
    quote: "الاهتمام بالتفاصيل والالتزام بأهدافنا أحدث كل الفرق.",
    author_name: "Layla Hassan",
    author_title: "Data Engineer, Google",
    author_image: "/assets/teams/images/abdelrahman_khadr.jpg",
    company_id: null,
    company_name: "Google",
    company_logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    is_active: true,
    order_index: 3,
  },
  {
    id: "5",
    quote: "فريق عالمي المستوى يقدّم دائمًا أكثر مما يعد به في كل مرة.",
    author_name: "James Carter",
    author_title: "CTO, Microsoft",
    author_image: "/assets/teams/images/abdelrahman_khadr.jpg",
    company_id: null,
    company_name: "Microsoft",
    company_logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
    is_active: true,
    order_index: 4,
  },
];

// ── Avatar component ──
function Avatar({ name, image, size = 32 }: {
  name:   string;
  image?: string | null;
  size?:  number;
}) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size, border: "1px solid var(--border)" }}
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center font-bold shrink-0"
      style={{
        width:      size,
        height:     size,
        fontSize:   size * 0.32,
        background: "var(--muted)",
        color:      "var(--muted-foreground)",
        border:     "1px solid var(--border)",
      }}
    >
      {initials}
    </div>
  );
}

// ── Testimonial card component ──
function Card({ testimonial }: { testimonial: DBTestimonial }) {
  return (
    <div
      className="w-full flex flex-col gap-4"
      style={{
        padding:      "1.25rem",
        borderRadius: "1rem",
        background:   "var(--card)",
        border: "1px solid var(--border)",
        height:       "100%",
        boxShadow:    "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {/* Quote icon */}
      <Quote size={13} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />

      {/* Testimonial text */}
      <p
        className="leading-relaxed flex-1 font-medium text-lg text-[var(--foreground)]"
      >
        "{testimonial.quote}"
      </p>

      {/* Author info */}
      <div
        className="flex items-center justify-between pt-3"
      >
        {/* Name and title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar
            name={testimonial.author_name}
            image={testimonial.author_image}
            size={32}
          />
          <div className="min-w-0">
            <p
              className="font-medium leading-tight truncate text-sm text-[var(--foreground)]"
            >
              {testimonial.author_name}
            </p>
            {testimonial.author_title && (
              <p
                className="leading-tight mt-0.5 truncate text-xs text-[var(--muted-foreground)]"
              >
                {testimonial.author_title}
              </p>
            )}
          </div>
        </div>

        {/* Company logo */}
        <div className="flex items-center gap-1.5 shrink-0 ms-2">
          {testimonial.company_logo && (
            <img
              src={testimonial.company_logo}
              alt={testimonial.company_name ?? ""}
              className="object-contain"
              style={{
                height:  20,
                maxWidth: 78,
                filter:  "var(--logo-filter, none)",
                opacity: 1,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Constants ──
const CARD_HEIGHT = 210;
const CARD_GAP    = 20;
const STEP        = CARD_HEIGHT + CARD_GAP;
const HOLD_MS     = 5000;
const ANIM_MS     = 650;

export default function TestimonialCards({
  testimonials,
}: {
  testimonials: DBTestimonial[];
}) {
  // Use real data or fallback
  const data = testimonials.length >= 3 ? testimonials : FALLBACK;

  // Repeat the data 4 times to ensure infinity without any visible gap
  const looped = [...data, ...data, ...data, ...data];
  const N      = data.length;

  // Current index — start from the second copy to have space above and below
  const [currentIndex, setCurrentIndex] = useState(N);
  const [isAnimating,  setIsAnimating]  = useState(false);
  const holdTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Move to next card ──
  const goNext = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setCurrentIndex((prev) => {
      const next = prev + 1;
      // When reaching the third copy, silently reset to the second copy — without animation
      return next;
    });

    setTimeout(() => setIsAnimating(false), ANIM_MS);
  };

  // ── Silent reset to ensure infinity ──
  useEffect(() => {
    // If we reach the end of the second copy, do a silent reset to the first corresponding copy
    if (currentIndex >= N * 3) {
      // Wait for the current animation to finish then reset without animation
      const resetTimer = setTimeout(() => {
        setCurrentIndex((prev) => prev - N * 2);
      }, ANIM_MS + 50);
      return () => clearTimeout(resetTimer);
    }
  }, [currentIndex, N]);

  // ── Auto timer ──
  useEffect(() => {
    holdTimer.current = setInterval(goNext, HOLD_MS);
    return () => {
      if (holdTimer.current) clearInterval(holdTimer.current);
    };
  }, [isAnimating]);

  // ── Compute style for each card ──
  const getCardStyle = (i: number): React.CSSProperties => {
    const relIndex   = i - currentIndex;
    const isCenter   = relIndex === 0;
    const isAdjacent = Math.abs(relIndex) === 1;

    // Distant cards are completely hidden
    if (Math.abs(relIndex) > 2) return { display: "none" };

    const scale   = isCenter ? 1    : isAdjacent ? 0.84 : 0.68;
    const opacity = isCenter ? 1    : isAdjacent ? 0.4  : 0;
    const translateY = relIndex * STEP;

    return {
      position:        "absolute",
      top:             "50%",
      left:            "1rem",
      right:           "1rem",
      height:          CARD_HEIGHT,
      marginTop:       -(CARD_HEIGHT / 2),
      transform:       `translateY(${translateY}px) scale(${scale})`,
      opacity,
      transformOrigin: "center center",
      transition:      isAnimating
        ? `transform ${ANIM_MS}ms cubic-bezier(0.4,0,0.2,1), opacity ${ANIM_MS}ms cubic-bezier(0.4,0,0.2,1)`
        : "none",
      pointerEvents: isCenter ? "auto" : "none",
    };
  };

  // Active dot based on current index
  const activeI = ((currentIndex % N) + N) % N;

  return (
    <div
      className="relative z-10 w-full flex flex-col h-full"
    >
      {/* ── Fade from top ── */}
      <div
        className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height:     "30vh",
          background: "linear-gradient(to bottom, var(--background) 0%, transparent 100%)",
        }}
      />

      {/* ── Fade from bottom ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height:     "30vh",
          background: "linear-gradient(to top, var(--background) 0%, transparent 100%)",
        }}
      />

      {/* ── Cards area — fill entire viewport ── */}
      <div className="flex-1 relative overflow-hidden">
        {looped.map((t, i) => (
          <div key={`${t.id}-${i}`} style={getCardStyle(i)}>
            <Card testimonial={t} />
          </div>
        ))}
      </div>

      {/* ── Dots at the bottom ── */}
      <div
        className="relative z-20 flex justify-center gap-1.5 pb-6"
      >
        {data.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width:      i === activeI ? 20 : 6,
              height:     6,
              background: i === activeI
                ? "var(--foreground)"
                : "var(--border)",
            }}
          />
        ))}
      </div>
    </div>
  );
}