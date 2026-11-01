/**
 * Transactional email transport. Primary: the Cloudflare Email Routing
 * `send_email` service binding (free, zero external services). If the binding
 * is not attached, sending is a no-op that reports failure — callers keep the
 * milestone claimed state consistent either way.
 */
import type { AgniEnv } from "./env";

export interface OutgoingEmail {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export function canSendEmail(env: AgniEnv): boolean {
  return typeof env.SEND_EMAIL?.send === "function";
}

/** Send one message. Returns false on any transport failure (never throws). */
export async function sendEmail(env: AgniEnv, mail: OutgoingEmail): Promise<boolean> {
  const binding = env.SEND_EMAIL;
  if (!binding) return false;
  try {
    // The binding's builder overload takes {from, to, subject, text, html}
    // and composes MIME itself (no EmailMessage construction needed).
    await binding.send({
      from: mail.from,
      to: mail.to,
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    return true;
  } catch {
    return false;
  }
}
