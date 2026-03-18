import type { Metadata } from "next";
import LangDialog from "@/components/common/LangDialog";
import ThemeToggle from "@/components/common/ThemeToggle";
import Logo from "@/components/common/Logo";
import Branding from "@/components/common/Branding";
import FooterInfo from "@/components/common/FooterInfo";
import GridSquares from "@/components/common/GridSquares";
import TestimonialCards from "@/components/auth/TestimonialCards";
import { findActiveTestimonials } from "@/lib/db/testimonials";

export const metadata: Metadata = { title: "Naxus" };

export default async function AuthLayout({
  children }: { children: React.ReactNode }) {
  let testimonials: any = [];
  try {
    testimonials = await findActiveTestimonials();
  } catch {
    testimonials = [];
  }
  return (
    <div className="min-h-screen bg-background flex">

      {/* Left branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-e bg-muted/30 relative overflow-hidden">
        <GridSquares />

        <div className="relative z-10 max-w-[32px]">
          <a
            href="/"
            className="relative w-[32px] bg-red"
          >
            <Logo size={32} />
          </a>
        </div>

        <TestimonialCards testimonials={testimonials} />

      </div>

      {/* Right form */}
      <div className="flex-1 flex flex-col">

        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4">
          <div className="lg:hidden flex items-center gap-2">
            <a
              href="/"
            >
              <Logo size={32} />
            </a>
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-12 pb-12">
          <div className="w-full max-w-sm mb-8">
            {children}
          </div>
          <FooterInfo />
        </div>
      </div>
    </div>
  );
}