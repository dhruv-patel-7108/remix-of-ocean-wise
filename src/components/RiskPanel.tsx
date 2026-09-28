import { formatDateTime, t } from "../lib/i18n";
import { RISK_GLYPH, RISK_LABEL_KEY, type RiskLevel } from "../lib/risk";
import { useApp } from "../state/app-state";
import { EmptyState, Note, Section, StatusBadge } from "./ui/primitives";

const TONE: Record<RiskLevel, string> = {
  low: "border-ok/50 text-ok",
  moderate: "border-caution/60 text-caution",
  high: "border-warning/60 text-warning",
  severe: "border-destructive/70 text-destructive",
};

export function RiskPanel() {
  const { lang, snapshot } = useApp();

  return (
    <Section
      id="risk"
      index={7}
      title={t(lang, "secRisk")}
      status={snapshot ? <StatusBadge status={snapshot.overallStatus} lang={lang} /> : null}
    >
      {!snapshot ? (
        <EmptyState text={t(lang, "loading")} />
      ) : (
        <>
          <div
            className={`flex items-center gap-3 rounded-sm border px-3 py-2 ${TONE[snapshot.risk.level]}`}
          >
            <span
              aria-hidden
              className="num rounded-sm border border-current px-2 py-0.5 text-sm font-semibold"
            >
              {RISK_GLYPH[snapshot.risk.level]}
            </span>
            <div>
              <div className="text-sm font-semibold">
                {t(lang, RISK_LABEL_KEY[snapshot.risk.level])}
              </div>
              <div className="num text-xs text-muted-foreground">
                {snapshot.risk.score}/100 · {formatDateTime(snapshot.validTime, lang)}
              </div>
            </div>
          </div>

          <h3 className="label-xs mt-4">{t(lang, "reasons")}</h3>
          <ul className="mt-2 divide-y divide-border border-y border-border">
            {snapshot.risk.factors.map((f) => (
              <li key={f.key} className="flex items-baseline justify-between gap-3 py-1.5 text-sm">
                <span className="min-w-0">{f.label[lang]}</span>
                {f.value ? (
                  <span className="num shrink-0 text-muted-foreground">{f.value}</span>
                ) : null}
              </li>
            ))}
          </ul>
          <Note>{t(lang, "riskDisclaimer")}</Note>
        </>
      )}
    </Section>
  );
}
