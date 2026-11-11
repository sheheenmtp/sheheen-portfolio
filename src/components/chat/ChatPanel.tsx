import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { ArrowUp, RotateCcw, X } from 'lucide-react';
import { track } from '@vercel/analytics';
import starters from '../../chat/starters.json';
import { sourceLinks } from '../../chat/sources';
import {
  ChatHttpError,
  MAX_QUESTION_LENGTH,
  streamChat,
  type ChatMessage,
  type ChatSource,
} from '../../chat/stream';
import { usePrefersReducedMotion, useSmoothText } from '../../chat/useSmoothText';
import { HandLine } from '../ui/HandLine';
import '../../styles/chat.css';

/** The server reads at most this many messages, the new question included. */
const HISTORY_LIMIT = 6;
const FULL_SCREEN = '(max-width: 480px)';
const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Turn =
  | { id: number; role: 'user'; text: string }
  | {
      id: number;
      role: 'assistant';
      text: string;
      status: 'pending' | 'streaming' | 'done' | 'error';
      sources: ChatSource[];
      grounded: boolean;
      error?: string;
      question: string;
    };
type AssistantTurn = Extract<Turn, { role: 'assistant' }>;

/** Completed exchanges only: a question whose answer failed is left out. */
function historyFor(turns: Turn[]): ChatMessage[] {
  const messages: ChatMessage[] = [];
  for (let i = 0; i < turns.length - 1; i++) {
    const question = turns[i];
    const answer = turns[i + 1];
    if (question.role === 'user' && answer.role === 'assistant' && answer.status === 'done' && answer.text) {
      messages.push({ role: 'user', content: question.text }, { role: 'assistant', content: answer.text });
    }
  }
  return messages.slice(-(HISTORY_LIMIT - 1));
}

function minutesUntil(time: number) {
  return Math.max(1, Math.ceil((time - Date.now()) / 60_000));
}

/** **bold** spans; anything else is plain text. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*\n]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4 ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
  );
}

/** Paragraphs and "-" bullet lists, the only formatting the model is asked to use. */
function Answer({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];
  let list: string[] = [];
  const flush = () => {
    if (paragraph.length) blocks.push(<p key={blocks.length}>{inline(paragraph.join(' '))}</p>);
    if (list.length)
      blocks.push(
        <ul key={blocks.length}>
          {list.map((item, i) => (
            <li key={i}>{inline(item)}</li>
          ))}
        </ul>,
      );
    paragraph = [];
    list = [];
  };
  for (const line of text.split('\n')) {
    const bullet = /^\s*(?:[-*•]|\d+[.)])\s+(.*)$/.exec(line);
    if (bullet) {
      if (paragraph.length) flush();
      list.push(bullet[1]);
    } else if (!line.trim()) {
      flush();
    } else {
      if (list.length) flush();
      paragraph.push(line.trim());
    }
  }
  flush();
  return <>{blocks}</>;
}

function AssistantReply({
  turn,
  smooth,
  onSettled,
  onRetry,
  retryDisabled,
  onSourceClick,
}: {
  turn: AssistantTurn;
  smooth: boolean;
  onSettled: (id: number, message: string) => void;
  onRetry: (turn: AssistantTurn) => void;
  retryDisabled: boolean;
  onSourceClick: () => void;
}) {
  const shown = useSmoothText(turn.text, smooth);
  const caughtUp = shown.length === turn.text.length;
  const settled = caughtUp && (turn.status === 'done' || turn.status === 'error');
  const plain = turn.text.replace(/\*\*/g, '');
  const announcement = turn.status === 'error' ? [plain, turn.error].filter(Boolean).join(' ') : plain;
  const links = turn.status === 'done' && turn.grounded ? sourceLinks(turn.sources) : [];

  useEffect(() => {
    if (settled) onSettled(turn.id, announcement);
  }, [settled, onSettled, turn.id, announcement]);

  return (
    <li className="chat__turn chat__turn--assistant">
      {turn.status === 'pending' || (!shown && turn.status === 'streaming') ? (
        <p className="chat__thinking">
          checking his notes<span aria-hidden="true">…</span>
        </p>
      ) : (
        <div className="chat__answer">
          <Answer text={shown} />
        </div>
      )}
      {turn.status === 'error' && caughtUp && (
        <div className="chat__error">
          <p>{turn.error}</p>
          <button type="button" className="btn btn--text" onClick={() => onRetry(turn)} disabled={retryDisabled}>
            Try again
          </button>
        </div>
      )}
      {settled && links.length > 0 && (
        <nav className="chat__sources" aria-label="Sources for this answer">
          <span className="chat__sources-label">Sources</span>
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={onSourceClick}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </li>
  );
}

export default function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [retryAt, setRetryAt] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const smooth = !usePrefersReducedMotion();

  const panelRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const nextId = useRef(1);
  const announced = useRef(new Set<number>());
  const stickToBottom = useRef(true);

  const rateLimited = retryAt !== null;

  /** Input on desktop; the panel itself on touch screens, so the keyboard stays down. */
  const focusInside = useCallback(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    (coarse ? panelRef.current : inputRef.current)?.focus();
  }, []);
  const empty = turns.length === 0;

  const updateTurn = useCallback((id: number, change: (turn: AssistantTurn) => Partial<AssistantTurn>) => {
    setTurns((current) =>
      current.map((turn) => (turn.id === id && turn.role === 'assistant' ? { ...turn, ...change(turn) } : turn)),
    );
  }, []);

  const ask = useCallback(
    async (question: string, previous: Turn[]) => {
      const text = question.trim().slice(0, MAX_QUESTION_LENGTH);
      if (!text) return;
      track('chat_question_sent');

      const messages: ChatMessage[] = [...historyFor(previous), { role: 'user', content: text }];
      const questionId = nextId.current++;
      const answerId = nextId.current++;
      setTurns([
        ...previous,
        { id: questionId, role: 'user', text },
        { id: answerId, role: 'assistant', text: '', status: 'pending', sources: [], grounded: false, question: text },
      ]);
      setInput('');
      setBusy(true);
      stickToBottom.current = true;

      const controller = new AbortController();
      controllerRef.current = controller;
      try {
        await streamChat(
          messages,
          {
            sources: (sources) => updateTurn(answerId, () => ({ sources })),
            token: (chunk) => updateTurn(answerId, (turn) => ({ text: turn.text + chunk, status: 'streaming' })),
            done: (grounded) => updateTurn(answerId, () => ({ status: 'done', grounded })),
            error: (error) => updateTurn(answerId, () => ({ status: 'error', error })),
          },
          controller.signal,
        );
      } catch (error) {
        if (controller.signal.aborted) return;
        if (error instanceof ChatHttpError && error.status === 429) {
          const until = Date.now() + (error.retryAfter ?? 3600) * 1000;
          setRetryAt(until);
          updateTurn(answerId, () => ({ status: 'error', error: `${error.message} You can ask again in about ${minutesUntil(until)} min.` }));
        } else {
          const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
          updateTurn(answerId, () => ({ status: 'error', error: message }));
        }
      } finally {
        if (controllerRef.current === controller) {
          controllerRef.current = null;
          setBusy(false);
        }
      }
    },
    [updateTurn],
  );

  const submit = (event?: FormEvent) => {
    event?.preventDefault();
    if (!busy && !rateLimited) void ask(input, turns);
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) submit(event);
  };

  const retry = (turn: AssistantTurn) => {
    if (busy || rateLimited) return;
    const index = turns.findIndex((t) => t.id === turn.id);
    void ask(turn.question, turns.slice(0, Math.max(0, index - 1)));
  };

  const reset = () => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    announced.current.clear();
    setBusy(false);
    setTurns([]);
    setInput('');
    setAnnouncement('');
    focusInside();
  };

  const onSettled = useCallback((id: number, message: string) => {
    if (announced.current.has(id)) return;
    announced.current.add(id);
    setAnnouncement(message);
  }, []);

  const onSourceClick = () => {
    if (window.matchMedia(FULL_SCREEN).matches) onClose();
  };

  // The rate limit lifts on its own once Retry-After has passed.
  useEffect(() => {
    if (retryAt === null) return;
    const timer = window.setTimeout(() => setRetryAt(null), Math.max(0, retryAt - Date.now()));
    return () => window.clearTimeout(timer);
  }, [retryAt]);

  // Focus moves into the panel on open.
  useEffect(() => {
    if (open) focusInside();
  }, [open, focusInside]);

  // Esc closes the panel even if focus has ended up outside it.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  // Full-screen on phones: stop the page behind from scrolling.
  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add('chat-open');
    return () => document.documentElement.classList.remove('chat-open');
  }, [open]);

  // Clicking outside the floating panel closes it.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || (target as Element).closest?.('.chat-launcher')) return;
      onClose();
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, onClose]);

  // Keep the newest text in view while it streams, unless the reader scrolled up.
  useEffect(() => {
    const log = logRef.current;
    const content = log?.firstElementChild;
    if (!log || !content) return;
    const onScroll = () => {
      stickToBottom.current = log.scrollHeight - log.scrollTop - log.clientHeight < 48;
    };
    const observer = new ResizeObserver(() => {
      if (stickToBottom.current) log.scrollTop = log.scrollHeight;
    });
    observer.observe(content);
    log.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      log.removeEventListener('scroll', onScroll);
    };
  }, [empty]);

  const onPanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !panelRef.current) return;
    const focusable = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (element) => element.offsetParent !== null,
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === panelRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const canSend = !busy && !rateLimited && input.trim().length > 0;

  return (
    <div
      ref={panelRef}
      id="chat-panel"
      className="chat"
      role="dialog"
      aria-modal="true"
      aria-labelledby="chat-title"
      tabIndex={-1}
      hidden={!open}
      onKeyDown={onPanelKeyDown}
    >
      <header className="chat__head">
        <div className="chat__heading">
          <h2 id="chat-title" className="chat__title">
            Ask about Sheheen
          </h2>
          <HandLine variant="underline" className="chat__underline" />
        </div>
        <div className="chat__tools">
          <button
            type="button"
            className="chat__icon-btn"
            onClick={reset}
            disabled={empty}
            aria-label="Start over"
            title="Start over"
          >
            <RotateCcw aria-hidden="true" strokeWidth={1.8} />
          </button>
          <button type="button" className="chat__icon-btn" onClick={onClose} aria-label="Close chat" title="Close (Esc)">
            <X aria-hidden="true" strokeWidth={1.8} />
          </button>
        </div>
      </header>

      <div ref={logRef} className="chat__log">
        {empty ? (
          <div className="chat__intro">
            <p>
              Ask about his projects, experience, skills or availability. Answers come from the notes behind this
              portfolio.
            </p>
            <p className="chat__note" aria-hidden="true">
              try one of these ↓
            </p>
            <ul className="chat__starters" aria-label="Suggested questions">
              {starters.map((question) => (
                <li key={question}>
                  <button
                    type="button"
                    onClick={() => {
                      // The chips unmount once the conversation starts; keep focus in the panel.
                      focusInside();
                      void ask(question, turns);
                    }}
                    disabled={busy || rateLimited}
                  >
                    {question}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <ol className="chat__turns">
            {turns.map((turn) =>
              turn.role === 'user' ? (
                <li key={turn.id} className="chat__turn chat__turn--user">
                  <span className="sr-only">You asked: </span>
                  {turn.text}
                </li>
              ) : (
                <AssistantReply
                  key={turn.id}
                  turn={turn}
                  smooth={smooth}
                  onSettled={onSettled}
                  onRetry={retry}
                  retryDisabled={busy || rateLimited}
                  onSourceClick={onSourceClick}
                />
              ),
            )}
          </ol>
        )}
      </div>

      <form className="chat__form" onSubmit={submit}>
        <label htmlFor="chat-input" className="sr-only">
          Your question
        </label>
        <div className="chat__compose">
          <textarea
            ref={inputRef}
            id="chat-input"
            className="field chat__input"
            rows={1}
            maxLength={MAX_QUESTION_LENGTH}
            placeholder={rateLimited && retryAt ? `Limit reached. Try again in about ${minutesUntil(retryAt)} min.` : 'Ask a question…'}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onInputKeyDown}
            disabled={rateLimited}
            aria-describedby="chat-privacy"
          />
          <button type="submit" className="btn btn--solid chat__send" disabled={!canSend} aria-label={busy ? 'Answering…' : 'Send question'}>
            <ArrowUp aria-hidden="true" strokeWidth={2} />
          </button>
        </div>
        <p id="chat-privacy" className="chat__privacy">
          Questions are saved anonymously to improve answers.
        </p>
      </form>

      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </div>
  );
}
