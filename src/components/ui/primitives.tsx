import type { ReactNode } from "react";

import type { DataStatus } from "../../lib/api";
import { formatDateTime, t, type Lang } from "../../lib/i18n";

export function Section({
  id,
  title,
  index,
  status,
  meta,
  actions,
  children,
  className = "",
}: {
  id: string;
  title: string;
  index?: number;
  status?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`panel flex min-w-0 flex-col ${className}`}
    >
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-2.5">
        <h2 id={`${id}-title`} className="text-sm font-semibold tracking-tight">
          {title}
        </h2>
        {status}
        <div className="ml-auto flex items-center gap-2">
          {meta}
          {actions}
        </div>
      </header>
      <div className="min-w-0 flex-1 p-4">{children}</div>
    </section>
  );
}

const STATUS_CLASS: Record<DataStatus, string> = {
  live: "border-ok/50 text-ok",
  demo: "border-caution/50 text-caution",
  unavailable: "border-destructive/60 text-destructive",
};

export function StatusBadge({
  status,
  lang,
  at,
}: {
  status: DataStatus;
  lang: Lang;
  at?: number | string;
}) {
  return (
    <span
      className={`num inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 text-[11px] tracking-wide ${STATUS_CLASS[status]}`}
      title={at ? `${t(lang, "lastUpdated")}: ${formatDateTime(at, lang)}` : undefined}
    >
      <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {t(lang, status)}
      {at ? <span className="text-muted-foreground">{formatDateTime(at, lang)}</span> : null}
    </span>
  );
}

export function Metric({
  label,
  value,
  unit,
  sub,
}: {
  label: string;
  value: string;
  unit?: string;
  sub?: string;
}) {
  return (
    <div className="min-w-0 border-l border-border pl-3">
      <div className="label-xs truncate">{label}</div>
      <div className="num mt-0.5 text-lg leading-tight">
        {value}
        {unit ? <span className="ml-1 text-xs text-muted-foreground">{unit}</span> : null}
      </div>
      {sub ? <div className="mt-0.5 truncate text-xs text-muted-foreground">{sub}</div> : null}
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-sm border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
      {text}
    </p>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{children}</p>;
}

export function Button({
  children,
  onClick,
  type = "button",
  variant = "default",
  disabled,
  ariaLabel,
  pressed,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "default" | "primary" | "ghost";
  disabled?: boolean;
  ariaLabel?: string;
  pressed?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "primary"
      ? "bg-primary text-primary-foreground hover:bg-accent"
      : variant === "ghost"
        ? "text-muted-foreground hover:text-foreground"
        : "border border-border bg-surface-2 text-foreground hover:border-border-strong";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={pressed}
      className={`${base} ${styles} ${pressed ? "border-primary text-primary" : ""}`}
    >
      {children}
    </button>
  );
}

export function Select({
  label,
  value,
  onChange,
  options,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  id: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label htmlFor={id} className="label-xs">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-border bg-input px-2 py-1.5 text-sm text-foreground"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
