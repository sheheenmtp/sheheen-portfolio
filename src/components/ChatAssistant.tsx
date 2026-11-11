import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { MessageCircle } from 'lucide-react';
import { track } from '@vercel/analytics';

/**
 * "Ask about Sheheen" launcher. Only this button ships in the main bundle; the panel
 * (components/chat/ChatPanel.tsx and styles/chat.css) is a separate chunk, fetched
 * on hover or focus and rendered on first open. It stays mounted after that, so the
 * conversation survives closing and reopening.
 */
const loadPanel = () => import('./chat/ChatPanel');

class PanelBoundary extends Component<{ onClose: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="chat-launcher__status" role="alert">
        The chat could not load. Check your connection and try again.
        <button type="button" className="btn btn--text" onClick={this.props.onClose}>
          Close
        </button>
      </div>
    );
  }
}

export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // A fresh lazy component (and boundary key) lets a failed chunk load be retried.
  const [attempt, setAttempt] = useState(0);
  const [Panel, setPanel] = useState(() => lazy(loadPanel));
  const launcherRef = useRef<HTMLButtonElement>(null);
  const prefetched = useRef(false);
  const wasOpen = useRef(false);

  const prefetch = () => {
    if (prefetched.current) return;
    prefetched.current = true;
    loadPanel().catch(() => {
      prefetched.current = false;
    });
  };

  const openPanel = () => {
    setMounted(true);
    setOpen(true);
    track('chat_open');
  };

  const close = useCallback(() => setOpen(false), []);

  const closeFailed = () => {
    setOpen(false);
    setMounted(false);
    setAttempt((n) => n + 1);
    setPanel(() => lazy(loadPanel));
  };

  // Focus returns to the launcher when the panel closes.
  useEffect(() => {
    if (wasOpen.current && !open) launcherRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className="chat-launcher"
        aria-haspopup="dialog"
        aria-controls={mounted ? 'chat-panel' : undefined}
        aria-expanded={open}
        aria-label="Ask about Sheheen"
        hidden={open}
        onClick={openPanel}
        onPointerEnter={prefetch}
        onFocus={prefetch}
      >
        <MessageCircle aria-hidden="true" strokeWidth={1.8} />
        <span className="chat-launcher__label" aria-hidden="true">
          Ask about Sheheen
        </span>
      </button>
      {mounted && (
        <PanelBoundary key={attempt} onClose={closeFailed}>
          <Suspense
            fallback={
              open && (
                <p className="chat-launcher__status" role="status">
                  Opening the chat…
                </p>
              )
            }
          >
            <Panel open={open} onClose={close} />
          </Suspense>
        </PanelBoundary>
      )}
    </>
  );
}
