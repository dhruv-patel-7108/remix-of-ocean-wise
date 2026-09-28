import { useEffect, useRef, useState } from "react";

import {
  answerQuery,
  parseQuery,
  renderQuestion,
  resolveWhen,
  type ChatMessage,
  type ParsedQuery,
} from "../lib/chat";
import { formatTime, t } from "../lib/i18n";
import type { MarineLocation } from "../lib/locations";
import { useApp } from "../state/app-state";
import { Button, Section, StatusBadge } from "./ui/primitives";

let counter = 0;
const nextId = () => `m${++counter}`;

function suggestions(loc: MarineLocation, lang: "en" | "hi" | "gu"): string[] {
  const n = loc.name[lang];
  if (lang === "hi")
    return [
      `${n} के पास महासागर की स्थिति क्या है?`,
      `क्या कल सुबह ${n} के पास मछली पकड़ना सुरक्षित है?`,
      `${n} के पास संभावित मत्स्य क्षेत्र दिखाइए`,
      `${n} के पास समुद्री चेतावनियाँ हैं?`,
      `वेरावल और पोरबंदर की तुलना करें`,
    ];
  if (lang === "gu")
    return [
      `${n} પાસે મહાસાગરની સ્થિતિ કેવી છે?`,
      `આવતીકાલે સવારે ${n} પાસે માછીમારી સલામત છે?`,
      `${n} પાસે સંભવિત મત્સ્ય વિસ્તાર બતાવો`,
      `${n} પાસે દરિયાઈ ચેતવણી છે?`,
      `વેરાવળ અને પોરબંદરની સરખામણી કરો`,
    ];
  return [
    `What are the ocean conditions near ${n}?`,
    `Is it safe to fish near ${n} tomorrow morning?`,
    `Show potential fishing zones near ${n}`,
    `Are there marine warnings near ${n}?`,
    `Compare Veraval and Porbandar conditions`,
  ];
}

export function ChatPanel() {
  const { lang, location, snapshot } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Conversation memory: what the last resolved question was about. */
  const contextRef = useRef<{ locations: MarineLocation[]; parsed: ParsedQuery } | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages, busy]);

  const submit = async (raw: string) => {
    const text = raw.trim();
    if (!text) {
      setError(t(lang, "emptyQuestion"));
      return;
    }
    setError(null);
    setBusy(true);

    const parsed = parseQuery(text);
    const prev = contextRef.current;

    // Location resolution: explicit mention wins, else carry conversation
    // context, else fall back to the dashboard's selected location.
    let locations = parsed.locations;
    if (!locations.length) {
      locations = prev && !parsed.explicitLocation ? prev.locations : [location];
    }
    if (parsed.intent === "route" && locations.length === 1 && prev) {
      locations = [...new Set([...locations, ...prev.locations])];
    }
    if (!locations.length) locations = [location];

    const time = parsed.explicitTime ? parsed.time : (prev?.parsed.time ?? parsed.time);
    // A follow-up such as "what about tomorrow morning?" keeps the previous
    // intent and metric instead of being treated as an unsupported question.
    const inherited =
      parsed.intent === "unknown" && prev
        ? { intent: prev.parsed.intent, metric: prev.parsed.metric }
        : { intent: parsed.intent, metric: parsed.metric };
    const effective: ParsedQuery = { ...parsed, ...inherited, time, locations };

    const userMessage: ChatMessage = {
      id: nextId(),
      role: "user",
      text: {
        en: renderQuestion(effective, locations, "en"),
        hi: renderQuestion(effective, locations, "hi"),
        gu: renderQuestion(effective, locations, "gu"),
      },
      original: text,
      at: Date.now(),
    };
    setMessages((m) => [...m, userMessage]);
    setInput("");

    try {
      const answer = await answerQuery(effective, locations, resolveWhen(time));
      setMessages((m) => [
        ...m,
        {
          id: nextId(),
          role: "assistant",
          text: answer.text,
          evidence: answer.evidence,
          at: Date.now(),
        },
      ]);
      contextRef.current = { locations, parsed: effective };
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: nextId(),
          role: "assistant",
          text: {
            en: "ORCA could not complete that request. The data service did not respond; try again in a moment.",
            hi: "ORCA यह अनुरोध पूरा नहीं कर सका। डेटा सेवा ने उत्तर नहीं दिया; कुछ देर बाद पुनः प्रयास करें।",
            gu: "ORCA આ વિનંતી પૂરી કરી શક્યું નથી. ડેટા સેવાએ જવાબ આપ્યો નથી; થોડી વારે ફરી પ્રયાસ કરો.",
          },
          at: Date.now(),
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Section
      id="chat"
      index={1}
      title={t(lang, "secChat")}
      status={snapshot ? <StatusBadge status={snapshot.overallStatus} lang={lang} /> : null}
      actions={
        messages.length ? (
          <Button
            variant="ghost"
            onClick={() => {
              setMessages([]);
              contextRef.current = null;
            }}
          >
            {t(lang, "clearChat")}
          </Button>
        ) : null
      }
      className={messages.length ? "xl:h-[44rem]" : ""}
    >
      <div className={messages.length ? "flex h-full flex-col" : "flex flex-col"}>
        <div
          ref={logRef}
          role="log"
          aria-live="polite"
          aria-label={t(lang, "secChat")}
          className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1"
        >
          {!messages.length ? (
            <p className="rounded-sm border border-dashed border-border px-3 py-2 text-sm text-muted-foreground">
              {t(lang, "chatIntro")}
            </p>
          ) : null}

          {messages.map((m) => (
            <article
              key={m.id}
              className={
                m.role === "user"
                  ? "ml-auto max-w-[92%] rounded-sm border border-border-strong bg-surface-2 px-3 py-2"
                  : "max-w-full rounded-sm border-l-2 border-primary/70 bg-surface-2/40 px-3 py-2"
              }
            >
              <div className="flex items-baseline gap-2">
                <span className="label-xs">{m.role === "user" ? t(lang, "youLabel") : "ORCA"}</span>
                <span className="num text-[11px] text-muted-foreground">
                  {formatTime(m.at, lang)}
                </span>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{m.text[lang]}</p>
              {m.original && m.original !== m.text[lang] ? (
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {t(lang, "originalText")}: {m.original}
                </p>
              ) : null}
              {m.evidence?.length ? (
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {m.evidence
                    .filter((e, i, arr) => arr.findIndex((x) => x.source === e.source) === i)
                    .map((e) => (
                      <li key={e.source} className="num text-[11px] text-muted-foreground">
                        <span className="rounded-sm border border-border px-1.5 py-0.5">
                          {e.source} · {t(lang, e.status)}
                        </span>
                      </li>
                    ))}
                </ul>
              ) : null}
            </article>
          ))}

          {busy ? <p className="num text-xs text-muted-foreground">{t(lang, "thinking")}</p> : null}
        </div>

        <div className="mt-3">
          <h3 className="label-xs">{t(lang, "suggested")}</h3>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {suggestions(location, lang).map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => void submit(s)}
                  disabled={busy}
                  className="rounded-sm border border-border bg-surface-2 px-2 py-1 text-left text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground disabled:opacity-50"
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void submit(input);
          }}
        >
          <label htmlFor="chat-input" className="sr-only">
            {t(lang, "chatPlaceholder")}
          </label>
          <input
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t(lang, "chatPlaceholder")}
            className="min-w-0 flex-1 rounded-sm border border-border bg-input px-3 py-2 text-sm"
            autoComplete="off"
          />
          <Button type="submit" variant="primary" disabled={busy}>
            {t(lang, "send")}
          </Button>
        </form>
        {error ? (
          <p role="alert" className="mt-2 text-xs text-destructive">
            {error}
          </p>
        ) : null}
      </div>
    </Section>
  );
}
