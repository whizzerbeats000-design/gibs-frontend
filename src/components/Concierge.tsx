import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, navigate } from "../lib/router";
import {
  CONCIERGE_SUGGESTIONS,
  getConciergeReply,
  type ConciergeCard,
} from "../lib/concierge";
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
  text: "Welcome to GIBS Concierge. I can help with programmes, admissions, executive education, the campus and our faculty. How can I help you find your way?",
};

const STORAGE_KEY = "gibs-concierge-v1";

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
  controls = false,
}: {
  compact?: boolean;
  controls?: boolean;
}) {
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
        aria-label="Concierge conversation"
        aria-describedby="concierge-transcript-hint"
        className="flex-1 space-y-5 overflow-y-auto px-5 py-6 sm:px-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/30 focus-visible:ring-inset"
        aria-live="polite"
      >
        <span id="concierge-transcript-hint" className="sr-only">
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
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-forest-600">
                  GIBS Concierge
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

      {/* Suggestions */}
      <div className="border-t border-line px-4 pt-3">
        {controls && (
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
              Suggested questions
            </p>
            <button
              type="button"
              onClick={reset}
              className="min-h-[40px] items-center rounded-pill px-2 text-[11px] font-bold uppercase tracking-[0.14em] text-forest-700 underline-offset-2 transition-colors hover:text-forest-800 hover:underline"
            >
              Reset conversation
            </button>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {CONCIERGE_SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="min-h-[40px] rounded-pill border border-forest-700/25 px-4 py-2 text-[12px] font-semibold text-forest-700 transition-colors duration-200 hover:border-forest-600 hover:bg-forest-50"
            >
              {s}
            </button>
          ))}
        </div>
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
          Ask the GIBS Concierge
        </label>
        <input
          id={compact ? "concierge-input-modal" : "concierge-input-page"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about programmes, admissions…"
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
        Guided rule-based assistant, not an AI service. For official answers, the Concierge routes you to the GIBS team.
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
      aria-label="Open GIBS Concierge"
      aria-expanded={open}
      tabIndex={hidden ? -1 : 0}
      className={cn(
        "fixed bottom-5 right-4 z-[var(--z-concierge)] flex items-center gap-2.5 rounded-pill bg-forest-600 py-3.5 pl-4 pr-5 text-sm font-semibold text-ivory shadow-lift ring-1 ring-forest-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-700 sm:bottom-7 sm:right-8",
        hidden && "pointer-events-none opacity-0"
      )}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="concierge-ping absolute inline-flex h-full w-full rounded-full bg-gold-300" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold-300" />
      </span>
      <ChatIcon className="h-4.5 w-4.5" />
      <span className="hidden sm:inline">GIBS Concierge</span>
    </button>
  );
}

export function ConciergeDialog() {
  const { open, setOpen } = useConcierge();
  useBodyScrollLock(open);
  useEscape(open, () => setOpen(false));
  const ref = useFocusTrap<HTMLDivElement>(open);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[var(--z-concierge)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          {/* Scrim */}
          <button
            type="button"
            aria-label="Close Concierge"
            onClick={() => setOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default bg-ink/45 backdrop-blur-[2px]"
          />

          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="GIBS Concierge"
            initial={{ y: 48, opacity: 0, scale: 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 32, opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.42, ease: EASE }}
            className="absolute inset-x-0 bottom-0 flex h-[86dvh] flex-col border-t border-line bg-paper shadow-lift sm:bottom-8 sm:left-auto sm:right-8 sm:h-[640px] sm:max-h-[85vh] sm:w-[400px] sm:overflow-hidden sm:rounded-panel sm:border"
          >
            <div className="flex items-center justify-between gap-4 bg-forest-800 px-5 py-4 text-ivory">
              <div>
                <p className="flex items-center gap-2 font-serif text-[15px] font-semibold">
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-300" />
                  </span>
                  GIBS Concierge
                </p>
                <p className="mt-0.5 text-[11px] text-ivory/75">Guided assistance · typically replies instantly</p>
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
                  className="mr-1 min-h-[40px] hidden items-center rounded-pill px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ivory/80 transition-colors hover:bg-ivory/10 hover:text-ivory sm:inline-flex"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close Concierge panel"
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
      )}
    </AnimatePresence>
  );
}

export function openConciergeRoute() {
  navigate("/concierge");
}
