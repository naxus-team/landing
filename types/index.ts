import { Locale } from "@/lib/i18n";

// ===== Navigation =====
export type NavItem = {
  label: string;
  href: string;
};

// ===== Sections =====
export type Stat = {
  value: string;
  label: string;
};

export type Service = {
  title: string;
  description: string;
  icon: string;
};

export type Project = {
  title: string;
  description: string;
  tags: string[];
  href?: string;
};

// ===== Team Roles =====
export type Role =
  | "founder"
  | "ceo"
  | "cto"
  | "coo"
  | "lead-engineer"
  | "senior-engineer"
  | "engineer"
  | "lead-designer"
  | "designer"
  | "product-manager"
  | "devops"
  | "ai-engineer"
  | "sales"
  | "marketing"
  | "advisor"
  | "viewer"
  ;

// ===== Role Display =====
export const ROLE_LABELS: Record<Role, Partial<Record<Locale, string>> & { en: string }> = {
  "founder": { en: "Founder", ar: "مؤسس" },
  "ceo": { en: "CEO", ar: "الرئيس التنفيذي" },
  "cto": { en: "CTO", ar: "مدير التقنية" },
  "coo": { en: "COO", ar: "مدير العمليات" },
  "lead-engineer": { en: "Lead Engineer", ar: "قائد هندسي" },
  "senior-engineer": { en: "Senior Engineer", ar: "مهندس أول" },
  "engineer": { en: "Engineer", ar: "مهندس" },
  "lead-designer": { en: "Lead Designer", ar: "قائد تصميم" },
  "designer": { en: "Designer", ar: "مصمم" },
  "product-manager": { en: "Product Manager", ar: "مدير المنتج" },
  "devops": { en: "DevOps", ar: "ديف أوبس" },
  "ai-engineer": { en: "AI Engineer", ar: "مهندس ذكاء اصطناعي" },
  "sales": { en: "Sales", ar: "مبيعات" },
  "marketing": { en: "Marketing", ar: "تسويق" },
  "advisor": { en: "Advisor", ar: "مستشار" },
  "viewer": { en: "Viewer", ar: "مشاهد" },
};

// ===== Role Badge Style =====
export const ROLE_STYLES: Record<Role, string> = {
  "founder": "bg-foreground text-background border-0",
  "ceo": "bg-foreground text-background border-0",
  "cto": "bg-foreground/85 text-background border-0",
  "coo": "bg-foreground/85 text-background border-0",
  "lead-engineer": "bg-foreground/70 text-background border-0",
  "lead-designer": "bg-foreground/70 text-background border-0",
  "senior-engineer": "border bg-transparent text-foreground",
  "engineer": "border bg-transparent text-foreground",
  "designer": "border bg-transparent text-foreground",
  "product-manager": "border bg-transparent text-foreground",
  "devops": "border bg-transparent text-foreground",
  "ai-engineer": "border bg-transparent text-foreground",
  "sales": "border bg-transparent text-muted-foreground",
  "marketing": "border bg-transparent text-muted-foreground",
  "advisor": "border bg-transparent text-muted-foreground",
  "viewer": "border bg-transparent text-muted-foreground",
};

export type TeamMember = {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
  image?: string;
  bio: Partial<Record<Locale, string>> & { en: string };
  email?: string;
  social?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
};

export type brandSocial = {
  brand?: {
    name?: string;
    url?:  string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    github?:   string;
    twitter?:  string;
    website?:  string;
  };
};