import { Link } from "@tanstack/react-router";

import { t } from "../lib/i18n";
import type { Lang } from "../lib/locations";

export function SiteFooter({ lang }: { lang: Lang }) {
  return (
    <footer className="mt-4 border-t border-border bg-surface/50">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-x-5 gap-y-2 px-4 py-4 text-xs text-muted-foreground">
        <span className="font-semibold tracking-[0.18em] text-primary">ORCA</span>
        <span className="max-w-3xl leading-relaxed">{t(lang, "disclaimerShort")}</span>
        <div className="ml-auto flex gap-4">
          <Link to="/privacy" className="hover:text-foreground">
            {t(lang, "privacy")}
          </Link>
          <Link to="/terms" className="hover:text-foreground">
            {t(lang, "terms")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
