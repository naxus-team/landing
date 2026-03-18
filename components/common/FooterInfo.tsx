"use client";

import { useI18n } from "@/lib/i18n-context";

export default function FooterInfo() {
    const { t } = useI18n();
    return (
        <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Naxus. {t.footer.copyright}
        </span>
    );
}