import type { Alert } from "../lib/alerts";
import { t } from "../lib/i18n";
import type { Lang } from "../lib/locations";
import { useApp } from "../state/app-state";
import { EmptyState, Section, StatusBadge } from "./ui/primitives";

const SEVERITY: Record<Alert["severity"], string> = {
  info: "border-l-border-strong",
  warn: "border-l-caution",
  danger: "border-l-destructive",
};

const SEVERITY_TAG: Record<Alert["severity"], Record<Lang, string>> = {
  info: { en: "NOTICE", hi: "सूचना", gu: "સૂચના" },
  warn: { en: "WARNING", hi: "चेतावनी", gu: "ચેતવણી" },
  danger: { en: "CRITICAL", hi: "गंभीर", gu: "ગંભીર" },
};

function AlertItem({ alert, lang }: { alert: Alert; lang: Lang }) {
  return (
    <li className={`border-l-2 bg-surface-2/60 px-3 py-2 ${SEVERITY[alert.severity]}`}>
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="num text-[11px] tracking-wide text-muted-foreground">
          {SEVERITY_TAG[alert.severity][lang]}
        </span>
        <span className="text-sm font-medium">{alert.title[lang]}</span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{alert.body[lang]}</p>
    </li>
  );
}

export function AlertsPanel() {
  const { lang, snapshot } = useApp();

  return (
    <Section
      id="alerts"
      index={8}
      title={t(lang, "secAlerts")}
      status={snapshot ? <StatusBadge status={snapshot.overallStatus} lang={lang} /> : null}
    >
      {!snapshot ? (
        <EmptyState text={t(lang, "loading")} />
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className="label-xs">{t(lang, "derivedAlerts")}</h3>
            {snapshot.alerts.derived.length ? (
              <ul className="mt-2 space-y-2">
                {snapshot.alerts.derived.map((a) => (
                  <AlertItem key={a.id} alert={a} lang={lang} />
                ))}
              </ul>
            ) : (
              <div className="mt-2">
                <EmptyState text={t(lang, "noDerivedAlerts")} />
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="label-xs">{t(lang, "officialAlerts")}</h3>
              <StatusBadge status="unavailable" lang={lang} />
            </div>
            <p className="mt-2 rounded-sm border border-dashed border-border px-3 py-2 text-xs leading-relaxed text-muted-foreground">
              {t(lang, "officialUnavailable")}
            </p>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="label-xs">{t(lang, "demoAlerts")}</h3>
              <StatusBadge status="demo" lang={lang} />
            </div>
            <ul className="mt-2 space-y-2">
              {snapshot.alerts.demo.map((a) => (
                <AlertItem key={a.id} alert={a} lang={lang} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </Section>
  );
}
