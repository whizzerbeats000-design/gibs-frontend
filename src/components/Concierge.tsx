import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion } from "framer-motion";
import { Link } from "../lib/router";
import { getConciergeReply, type ConciergeCard } from "../lib/concierge";
import { EASE } from "./motion";
import { useBodyScrollLock, useEscape, useFocusTrap } from "../lib/hooks";
import { ChatIcon, CloseIcon, SendIcon, ArrowUpRight } from "./icons";
import { cn } from "../utils/cn";

/* ---------------- Context ---------------- */

type ConciergeContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const ConciergeContext = createContext<ConciergeContextValue>({
  open: false,
  setOpen: () => {},
});

export function ConciergeProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);
  return <ConciergeContext.Provider value={value}>{children}</ConciergeContext.Provider>;
}

export function useConcierge() {
  return useContext(ConciergeContext);
}

/* ---------------- Conversation ---------------- */

type Message = {
  id: number;
  role: "user" | "concierge";
  text: string;
  cards?: ConciergeCard[];
};

const WELCOME: Message = {
  id: 0,
  role: "concierge",
  text: "Welcome to GIBS AI. I can help with 2026 programmes, foreign training hubs, training locations, and subscription enquiries. How can I help?",
};

const STORAGE_KEY = "gibs-concierge-v2";

function loadHistory(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [WELCOME];
    const parsed = JSON.parse(raw) as Message[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [WELCOME];
    return parsed
      .filter(
        (m) => m && Number.isInteger(m.id) && typeof m.role === "string" && typeof m.text === "string"
      )
      .slice(-30);
  } catch {
    return [WELCOME];
  }
}

function CardView({ card, onNavigate }: { card: ConciergeCard; onNavigate?: () => void }) {
  const to = card.kind === "programme" ? `/programmes/${card.slug}` : card.to;
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className="group flex items-center justify-between gap-3 border border-forest-700/25 bg-white px-4 py-3 text-left transition-colors duration-200 hover:border-forest-600 hover:bg-forest-50"
    >
      <span>
        <span className="block text-[13.5px] font-bold text-forest-800">{card.label}</span>
        {card.detail && <span className="mt-0.5 block text-[12px] leading-snug text-muted">{card.detail}</span>}
      </span>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-forest-600 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

export function ConciergeConversation({
  compact = false,
  label = "GIBS AI conversation",
}: {
  compact?: boolean;
  /**
   * Accessible name for the transcript region. Two instances can be mounted at
   * once — the /concierge page panel and the floating dialog — so callers pass a
   * distinct label to keep the landmarks unique.
   */
  label?: string;
}) {
  const hintId = useId();
  const idRef = useRef(1);
  /*
   * Message ids must stay unique across fresh sessions, remounts, navigation
   * and localStorage restore. The initial history is loaded once and the id
   * counter is seeded past the highest persisted id so re-sending a message
   * after a reload never collides with a restored message key.
   */
  const [messages, setMessages] = useState<Message[]>(() => {
    const history = loadHistory();
    idRef.current = history.reduce((max, m) => Math.max(max, m.id), 0) + 1;
    return history;
  });
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { setOpen } = useConcierge();

  const reset = () => {
    setMessages([WELCOME]);
    setInput("");
    setTyping(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
  };

  useEffect(() => {
    const onReset = () => reset();
    window.addEventListener("gibs:concierge-reset", onReset);
    return () => window.removeEventListener("gibs:concierge-reset", onReset);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* storage unavailable — conversation continues in memory */
    }
  }, [messages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  // When the floating dialog opens, put focus straight in the composer so a
  // visitor can type without an extra tab. The focus trap still bounds Tab.
  useEffect(() => {
    if (!compact) return;
    const t = window.setTimeout(() => {
      document.getElementById("concierge-input-modal")?.focus();
    }, 140);
    return () => window.clearTimeout(t);
  }, [compact]);

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || typing) return;
      const userMsg: Message = { id: idRef.current++, role: "user", text };
      setMessages((m) => [...m, userMsg]);
      setInput("");
      setTyping(true);
      // Simulated turn latency of the deterministic frontend engine.
      // Replace with a provider request in getConciergeReply when integrating.
      window.setTimeout(() => {
        const reply = getConciergeReply(text);
        setMessages((m) => [
          ...m,
          { id: idRef.current++, role: "concierge", text: reply.text, cards: reply.cards },
        ]);
        setTyping(false);
      }, 650);
    },
    [typing]
  );

  const closePanels = () => setOpen(false);

  return (
    <div className="flex h-full flex-col bg-paper">
      {/* Transcript */}
      <div
        ref={scrollRef}
        tabIndex={0}
        role="region"
        aria-label={label}
        aria-describedby={hintId}
        className="flex-1 space-y-5 overflow-y-auto px-5 py-6 sm:px-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/30 focus-visible:ring-inset"
        aria-live="polite"
      >
        <span id={hintId} className="sr-only">
          Scrollable conversation transcript. Use arrow keys to scroll.
        </span>
        {messages.map((m) => (
          <div key={m.id} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[88%] px-4 py-3 text-[14px] leading-[1.7]",
                m.role === "user"
                  ? "rounded-panel bg-forest-600 text-ivory"
                  : "border border-line border-l-2 border-l-gold-500/80 bg-white text-ink shadow-crisp"
              )}
            >
              {m.role === "concierge" && (
                <p className="mb-1.5 eyebrow text-forest-600">
                  GIBS AI
                </p>
              )}
              <p>{m.text}</p>
              {m.cards && m.cards.length > 0 && (
                <div className="mt-3 space-y-2">
                  {m.cards.map((c, i) => (
                    <CardView key={i} card={c} onNavigate={compact ? closePanels : undefined} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 border border-line bg-white px-4 py-3.5 shadow-crisp">
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-forest-600" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-forest-600" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-forest-600" />
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        className="flex items-center gap-3 p-4 sm:p-5"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <label htmlFor={compact ? "concierge-input-modal" : "concierge-input-page"} className="sr-only">
          Ask GIBS AI
        </label>
        <input
          id={compact ? "concierge-input-modal" : "concierge-input-page"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about programmes, schedules, fees, campuses…"
          className="field-input py-3"
        />
        <button
          type="submit"
          disabled={!input.trim() || typing}
          aria-label="Send message"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-pill bg-forest-600 text-ivory transition-colors hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SendIcon className="h-4.5 w-4.5" />
        </button>
      </form>
      <p className="px-5 pb-3 text-[11px] leading-snug text-muted">
        Answers come from the GIBS programme records. For official enquiries, GIBS AI points you to the registry.
      </p>
    </div>
  );
}

/* ---------------- Launcher + dialog ---------------- */

export function ConciergeLauncher({ suppressed = false }: { suppressed?: boolean }) {
  const { open, setOpen } = useConcierge();
  const hidden = open || suppressed;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Open GIBS AI"
      aria-expanded={open}
      tabIndex={hidden ? -1 : 0}
      className={cn(
        "fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] right-4 z-[var(--z-concierge)] flex items-center gap-2.5 rounded-pill bg-forest-600 py-3.5 pl-4 pr-5 text-[13px] font-semibold text-ivory shadow-[0_8px_24px_rgba(0,32,9,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] ring-1 ring-forest-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-700 sm:bottom-8 sm:right-8 sm:py-4 sm:pl-4.5 sm:pr-5.5 sm:text-sm xl:hidden",
        hidden && "pointer-events-none opacity-0"
      )}
    >
      <span className="h-2 w-2 shrink-0 rounded-full bg-gold-300" aria-hidden="true" />
      <ChatIcon className="h-4.5 w-4.5" />
      <span className="hidden sm:inline">GIBS AI</span>
    </button>
  );
}

/** Longest exit animation below (the dialog panel), so nothing is cut short. */
const EXIT_MS = 420;

export function ConciergeDialog() {
  const { open, setOpen } = useConcierge();
  const [rendered, setRendered] = useState(open);
  // Scroll lock and focus trap follow `rendered`, not `open`, so they stay
  // engaged for the whole exit animation and are released only once the
  // aria-modal element actually unmounts. Tying them to `open` released both
  // while the fading dialog was still mounted and interactive.
  useBodyScrollLock(rendered);
  useEscape(open, () => setOpen(false));
  const ref = useFocusTrap<HTMLDivElement>(rendered);

  // Unmount on a timer rather than relying on the exit animation to signal
  // completion. AnimatePresence waits for that signal, and when the animation
  // is dropped (busy or software-rendered frame) it keeps the dialog mounted —
  // leaving a live aria-modal overlay that traps focus and locks scrolling
  // after Escape. The timer makes the teardown deterministic.
  useEffect(() => {
    if (open) {
      setRendered(true);
      return;
    }
    const t = window.setTimeout(() => setRendered(false), EXIT_MS);
    return () => window.clearTimeout(t);
  }, [open]);

  if (!rendered) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[var(--z-concierge)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: open ? 1 : 0 }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      {/* Scrim */}
      <button
        type="button"
        aria-label="Close GIBS AI"
        onClick={() => setOpen(false)}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/45 backdrop-blur-[2px]"
      />

      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="GIBS AI"
        initial={{ y: 48, opacity: 0, scale: 0.985 }}
        animate={{
          y: open ? 0 : 32,
          opacity: open ? 1 : 0,
          scale: open ? 1 : 0.99,
        }}
        transition={{ duration: 0.42, ease: EASE }}
        className="absolute inset-x-0 bottom-0 flex h-[86dvh] flex-col border-t border-line bg-paper shadow-lift sm:bottom-8 sm:left-auto sm:right-8 sm:h-[640px] sm:max-h-[85dvh] sm:w-[400px] sm:overflow-hidden sm:rounded-panel sm:border"
      >
        <div className="flex items-center justify-between gap-4 bg-forest-800 px-5 py-4 text-ivory">
          <div>
            <p className="flex items-center gap-2 font-serif text-[15px] font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-300" />
              </span>
              GIBS AI
            </p>
            <p className="mt-0.5 text-[11px] text-ivory/75">Programme and enquiry guide</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.removeItem(STORAGE_KEY);
                } catch {
                  /* storage unavailable */
                }
                window.dispatchEvent(new CustomEvent("gibs:concierge-reset"));
              }}
              className="mr-1 min-h-[40px] hidden items-center rounded-pill px-3 text-[11px] font-bold uppercase tracking-[0.12em] text-ivory/80 transition-colors hover:bg-ivory/10 hover:text-ivory sm:inline-flex"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close GIBS AI panel"
              className="flex h-11 w-11 items-center justify-center rounded-pill text-ivory/80 transition-colors hover:bg-ivory/10 hover:text-ivory"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1">
          <ConciergeConversation compact />
        </div>
      </motion.div>
    </motion.div>
  );
}
