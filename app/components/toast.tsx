"use client";

/**
 * Notification chips: appear top-right, stack, auto-dismiss.
 * Hovering the stack spreads the chips (full message, wider) and holds
 * them on screen until the pointer leaves. Monochrome, icon + message +
 * optional action — the site-wide transient feedback channel.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AlertIcon, CheckIcon, CloseIcon, InfoIcon } from "./icons";

export interface ToastAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface ToastInput {
  kind?: "success" | "error" | "info";
  message: string;
  action?: ToastAction;
  /** ms before auto-dismiss; default 5000, errors keep the default too. */
  duration?: number;
}

interface ToastItem extends Required<Pick<ToastInput, "kind" | "message">> {
  id: number;
  action?: ToastAction;
  duration: number;
}

interface ToastApi {
  push: (input: ToastInput) => void;
}

const ToastContext = createContext<ToastApi>({ push: () => {} });

export function useToast(): ToastApi {
  return useContext(ToastContext);
}

const MAX_VISIBLE = 4;

const KIND_ICON = {
  success: CheckIcon,
  error: AlertIcon,
  info: InfoIcon,
} as const;

const KIND_TONE = {
  success: "text-ok",
  error: "text-danger",
  info: "text-ink2",
} as const;

function ToastChip({
  item,
  spread,
  onDismiss,
}: {
  item: ToastItem;
  spread: boolean;
  onDismiss: (id: number) => void;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const Icon = KIND_ICON[item.kind];

  useEffect(() => {
    if (spread) {
      // Held on screen while the stack is hovered.
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      return;
    }
    timer.current = setTimeout(() => onDismiss(item.id), item.duration);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [spread, item.id, item.duration, onDismiss]);

  return (
    <div
      className={`fade-in card flex w-full items-start gap-2.5 px-3.5 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.10)] transition-all duration-200 ${
        spread ? "max-w-[26rem]" : "max-w-[20rem]"
      }`}
      role="status"
    >
      <span className={`mt-0.5 shrink-0 ${KIND_TONE[item.kind]}`}>
        <Icon width={14} height={14} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className={`text-[12px] leading-snug text-ink ${spread ? "" : "line-clamp-2"}`}>
          {item.message}
        </p>
        {item.action && (
          <a
            href={item.action.href}
            onClick={(e) => {
              if (item.action?.onClick) {
                e.preventDefault();
                item.action.onClick();
              }
            }}
            className="text-[11.5px] font-medium text-ink underline-offset-2 hover:underline"
          >
            {item.action.label}
          </a>
        )}
      </div>
      <button
        type="button"
        className="shrink-0 text-ink3 transition-colors hover:text-ink"
        onClick={() => onDismiss(item.id)}
        aria-label="Dismiss notification"
      >
        <CloseIcon width={12} height={12} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const [spread, setSpread] = useState(false);
  const seq = useRef(0);

  const push = useCallback((input: ToastInput) => {
    const item: ToastItem = {
      id: ++seq.current,
      kind: input.kind ?? "info",
      message: input.message,
      action: input.action,
      duration: input.duration ?? 5000,
    };
    setItems((cur) => [...cur, item].slice(-MAX_VISIBLE));
  }, []);

  const dismiss = useCallback((id: number) => {
    setItems((cur) => cur.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      {items.length > 0 && (
        <div
          className="fixed right-4 top-20 z-[60] flex w-[min(calc(100vw-2rem),22rem)] flex-col items-end gap-2"
          onMouseEnter={() => setSpread(true)}
          onMouseLeave={() => setSpread(false)}
          onFocus={() => setSpread(true)}
          onBlur={() => setSpread(false)}
          aria-live="polite"
        >
          {items.map((item) => (
            <ToastChip key={item.id} item={item} spread={spread} onDismiss={dismiss} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}
