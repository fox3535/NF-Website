"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import {
  requestVendorSignInLink,
  type VendorLoginResult,
} from "@/lib/vendors/auth";

const EMAIL_ERROR = "Enter a valid email address, like name@example.com.";
const GENERIC_ERROR = "Something went wrong on our end. Please try again in a moment.";

/**
 * Vendor Network sign-in.
 *
 * The success wording is the security boundary, not a nicety. "If this email
 * is eligible" is true for every well-formed address, so the screen cannot be
 * used to find out who vends at NF. Never change it to confirm that a link
 * was sent, that an account exists, or that an address was not recognised.
 *
 * A real <form> bound to a Server Action, so it works before hydration. The
 * input is controlled so a rejected submit never wipes what was typed.
 */
export default function VendorLoginForm() {
  const [state, formAction, pending] = useActionState(
    requestVendorSignInLink,
    null as VendorLoginResult | null
  );
  const [email, setEmail] = useState("");
  const [dismissedError, setDismissedError] = useState(false);

  const id = useId();
  const emailRef = useRef<HTMLInputElement>(null);
  const sentRef = useRef<HTMLParagraphElement>(null);
  const alertRef = useRef<HTMLParagraphElement>(null);

  const emailError = !dismissedError && state?.status === "invalid-email" ? EMAIL_ERROR : null;
  const formError = !dismissedError && state?.status === "error" ? GENERIC_ERROR : null;

  // Move focus to whatever the server just said, so a screen reader user is
  // not left at a submit button with the answer somewhere above them.
  useEffect(() => {
    if (!state) return;
    if (state.status === "sent") sentRef.current?.focus();
    else if (state.status === "invalid-email") emailRef.current?.focus();
    else alertRef.current?.focus();
  }, [state]);

  if (state?.status === "sent") {
    return (
      <div className="flex flex-col gap-4">
        <span className="nf-stamp w-fit text-brand">
          <span aria-hidden="true">✦</span> Check your email
        </span>
        <p
          ref={sentRef}
          tabIndex={-1}
          role="status"
          className="text-base leading-relaxed text-text outline-none"
        >
          If this email is eligible for NF Vendor Network access, a sign in
          link is on its way. The link works once and expires, so open it on
          this device.
        </p>
        <p className="text-sm leading-relaxed text-text-secondary">
          Nothing arrived? Check your spam folder, then request another link.
          If you vend with Nostalgia Fest and still cannot get in, reply to
          your usual NF contact.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5" aria-busy={pending}>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${id}-email`} className="nf-eyebrow text-xs text-text">
          Email
        </label>
        <input
          ref={emailRef}
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          maxLength={254}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setDismissedError(true);
          }}
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? `${id}-email-error` : `${id}-email-hint`}
          className={`min-h-12 w-full rounded-md border-2 bg-white/70 px-3.5 text-base text-text shadow-[inset_2px_2px_0_rgb(36_26_51/7%)] placeholder:text-text-secondary ${
            emailError ? "border-danger" : "border-ink"
          }`}
        />
        {emailError ? (
          <p
            id={`${id}-email-error`}
            className="mt-1.5 flex items-start gap-1.5 text-sm font-semibold text-danger"
          >
            <span aria-hidden="true">!</span>
            {emailError}
          </p>
        ) : (
          <p id={`${id}-email-hint`} className="mt-1 text-sm text-text-secondary">
            Use the address Nostalgia Fest already has on file for you.
          </p>
        )}
      </div>

      {formError ? (
        <p
          ref={alertRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border-2 border-danger bg-danger-soft px-4 py-3 text-sm font-semibold text-danger outline-none"
        >
          {formError}
        </p>
      ) : null}

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={pending}
          className="nf-action nf-action-filled min-h-13 w-full px-6 text-lg disabled:cursor-progress disabled:opacity-80"
        >
          {pending ? "Sending your link…" : "Email me a sign in link"}
        </button>
        <p role="status" className="sr-only">
          {pending ? "Requesting your sign in link." : ""}
        </p>
        <p className="text-xs leading-relaxed text-text-secondary">
          No password. Nostalgia Fest emails you a link that signs you in.
        </p>
      </div>
    </form>
  );
}
