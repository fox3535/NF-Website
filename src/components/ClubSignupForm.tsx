"use client";

import Link from "next/link";
import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  startTransition,
  type FormEvent,
  type Ref,
} from "react";
import { CLUB_CONSENT_TEXT } from "@/lib/club/consent";
import {
  CLUB_INTERESTS,
  resolveClubSignupSource,
  type ClubSignupSource,
} from "@/lib/club/options";
import { clubSignupAction, type ClubSignupResult } from "@/lib/club/signup";
import { upcomingEvents } from "@/lib/events";

type Field = "firstName" | "email" | "consent" | "interests";
type FieldErrors = Partial<Record<Field, string>>;

// The form owns its wording; the server only says WHICH field failed. That
// keeps backend messages internal and the copy consistent on every surface.
const FIELD_MESSAGES: Record<Field, string> = {
  firstName: "Enter your first name (80 characters max).",
  email: "Enter a valid email address, like name@example.com.",
  consent: "Tick the box to agree to NF Club emails. We can't add you without it.",
  interests: "One of those interests isn't available right now. Refresh the page and try again.",
};

const GENERIC_ERROR = "Something went wrong on our end. Please try again in a moment.";

const FIELD_ORDER: Field[] = ["firstName", "email", "consent", "interests"];

function serverFieldErrors(state: ClubSignupResult | null): FieldErrors {
  if (state?.status !== "error" || !state.fieldErrors) return {};
  const errors: FieldErrors = {};
  for (const field of FIELD_ORDER) {
    if (state.fieldErrors[field]) errors[field] = FIELD_MESSAGES[field];
  }
  return errors;
}

/**
 * NF Club signup, reusable on any surface. All validation that matters and
 * every database write live in src/lib/club/signup-core.ts; this component
 * only collects input, runs presence checks for faster feedback, and renders
 * the result. `source` is fixed by the embedding page, never user editable.
 * With `sourceFromUrl` (the /club page only), a `?src=` param naming an
 * allow-listed slug replaces it, so a visitor who arrived from the homepage
 * or an event page is attributed to that surface. Anything else keeps
 * `source`.
 *
 * A real <form> bound to a Server Action through useActionState, so it
 * submits before hydration too. Inputs are controlled so a failed submit
 * never wipes what the person already typed.
 */
export default function ClubSignupForm({
  source,
  sourceFromUrl = false,
}: {
  source: ClubSignupSource;
  sourceFromUrl?: boolean;
}) {
  const [state, formAction, pending] = useActionState(clubSignupAction, null);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [consent, setConsent] = useState(false);
  const [clientErrors, setClientErrors] = useState<FieldErrors | null>(null);

  const id = useId();
  const renderedAtRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const interestsRef = useRef<HTMLFieldSetElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const formErrorRef = useRef<HTMLParagraphElement>(null);

  const errors = clientErrors ?? serverFieldErrors(state);
  const formError =
    state?.status === "error" && !clientErrors && Object.keys(errors).length === 0
      ? GENERIC_ERROR
      : null;

  // Stamped after mount rather than at render: the page is prerendered, so a
  // render-time value would be the build time and defeat the server's
  // minimum-time-to-submit check. Written to the DOM directly so no extra
  // render is needed.
  useEffect(() => {
    if (renderedAtRef.current) renderedAtRef.current.value = String(Date.now());
  }, []);

  // Read on the client only (the server snapshot is empty), so /club stays a
  // static page and the prerendered HTML carries the fallback source.
  const search = useSyncExternalStore(subscribeToNothing, readSearch, readNoSearch);
  const resolvedSource = sourceFromUrl
    ? resolveClubSignupSource(new URLSearchParams(search).get("src"), source)
    : source;

  // Move focus to whatever the server just told us about.
  useEffect(() => {
    if (!state) return;
    if (state.status === "success") {
      successRef.current?.focus();
      return;
    }
    const fields = serverFieldErrors(state);
    const first = FIELD_ORDER.find((field) => fields[field]);
    if (first) focusField(first);
    else formErrorRef.current?.focus();
  }, [state]);

  function focusField(field: Field) {
    const target = {
      firstName: firstNameRef.current,
      email: emailRef.current,
      consent: consentRef.current,
      interests: interestsRef.current?.querySelector("input"),
    }[field];
    target?.focus();
  }

  // Once hydrated, submission is dispatched by hand instead of through the
  // form's action prop. React resets a form after an action-prop submit,
  // which unticks checkboxes even though their state still says ticked, so
  // a failed submit would silently drop consent and interests. The action
  // prop stays in place as the pre-hydration fallback.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const next: FieldErrors = {};
    if (!firstName.trim()) next.firstName = FIELD_MESSAGES.firstName;
    if (!email.trim() || emailRef.current?.validity.typeMismatch) {
      next.email = FIELD_MESSAGES.email;
    }
    if (!consent) next.consent = FIELD_MESSAGES.consent;

    const first = FIELD_ORDER.find((field) => next[field]);
    if (first) {
      setClientErrors(next);
      focusField(first);
      return;
    }
    setClientErrors(null);
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  // Editing a field clears its pending client-side error, so a message never
  // lingers over input that is already fixed.
  function clearError(field: Field) {
    setClientErrors((current) => {
      if (!current?.[field]) return current;
      const rest = { ...current };
      delete rest[field];
      return rest;
    });
  }

  function toggleInterest(slug: string, checked: boolean) {
    setInterests((current) =>
      checked ? [...current, slug] : current.filter((value) => value !== slug)
    );
  }

  if (state?.status === "success") {
    return (
      <ClubSignupSuccess
        headingRef={successRef}
        firstName={firstName.trim()}
        interestLabels={CLUB_INTERESTS.filter((option) =>
          interests.includes(option.slug)
        ).map((option) => option.label)}
      />
    );
  }

  const describedBy = (field: Field) => (errors[field] ? `${id}-${field}-error` : undefined);

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      aria-busy={pending}
      className="flex flex-col gap-5"
    >
      <input type="hidden" name="source" value={resolvedSource} />
      <input ref={renderedAtRef} type="hidden" name="renderedAt" defaultValue="" />

      {/* Honeypot. Off screen, out of the tab order and hidden from assistive
          tech, so only an automated form filler ever sees it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input id={`${id}-company`} type="text" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          ref={firstNameRef}
          id={`${id}-firstName`}
          label="First name"
          name="firstName"
          autoComplete="given-name"
          value={firstName}
          onChange={(value) => {
            setFirstName(value);
            clearError("firstName");
          }}
          maxLength={80}
          error={errors.firstName}
          describedBy={describedBy("firstName")}
        />
        <TextField
          ref={emailRef}
          id={`${id}-email`}
          label="Email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(value) => {
            setEmail(value);
            clearError("email");
          }}
          maxLength={254}
          error={errors.email}
          describedBy={describedBy("email")}
        />
      </div>

      <fieldset
        ref={interestsRef}
        aria-describedby={[`${id}-interests-hint`, describedBy("interests")]
          .filter(Boolean)
          .join(" ")}
      >
        <legend className="nf-eyebrow text-xs text-text">What are you into?</legend>
        <p id={`${id}-interests-hint`} className="mt-1 text-sm text-text-secondary">
          Optional. Tag as many as you like.
        </p>
        <div className="mt-3 flex flex-wrap gap-x-2 gap-y-2.5">
          {CLUB_INTERESTS.map((option) => {
            const checked = interests.includes(option.slug);
            return (
              <label
                key={option.slug}
                className="relative inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border-2 border-dashed border-ink/60 bg-paper py-2 pr-3.5 pl-2 text-sm font-semibold text-text transition-[background-color,border-color,box-shadow,transform] duration-150 select-none hover:border-ink hover:bg-paper-strong has-checked:rotate-[-1.5deg] has-checked:border-solid has-checked:border-ink has-checked:bg-gold-bright has-checked:shadow-[3px_3px_0_var(--color-brand-deep)] has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-ink motion-reduce:has-checked:rotate-0"
              >
                <input
                  type="checkbox"
                  name="interests"
                  value={option.slug}
                  checked={checked}
                  onChange={(event) => toggleInterest(option.slug, event.target.checked)}
                  className="sr-only"
                />
                {/* A hang tag: the punched hole reads "+" until the tag is
                    picked, then fills in with a tick. Selection also swaps
                    the dashed outline for a solid, stuck-down sticker, so
                    state never rests on colour alone. */}
                <span
                  aria-hidden="true"
                  className={`grid size-5 shrink-0 place-items-center rounded-full border-2 border-ink text-[11px] leading-none font-bold ${
                    checked ? "bg-ink text-gold-bright" : "text-ink"
                  }`}
                >
                  {checked ? "✓" : "+"}
                </span>
                {option.label}
              </label>
            );
          })}
        </div>
        <FieldError id={`${id}-interests-error`} message={errors.interests} />
      </fieldset>

      <div className="border-t-2 border-dashed border-border pt-4">
        <div
          className={`flex items-start gap-3 rounded-lg ${
            errors.consent ? "bg-danger-soft p-3 ring-2 ring-danger" : ""
          }`}
        >
          <input
            ref={consentRef}
            id={`${id}-consent`}
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(event) => {
              setConsent(event.target.checked);
              clearError("consent");
            }}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={describedBy("consent")}
            className="mt-px size-5 shrink-0 cursor-pointer accent-brand"
          />
          <label
            htmlFor={`${id}-consent`}
            className="cursor-pointer text-[13px] leading-snug text-text-secondary"
          >
            <span className="font-semibold text-text">Required.</span> {CLUB_CONSENT_TEXT}
          </label>
        </div>
        <FieldError id={`${id}-consent-error`} message={errors.consent} />
      </div>

      {formError ? (
        <p
          ref={formErrorRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border-2 border-danger bg-danger-soft px-4 py-3 text-sm font-semibold text-danger"
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
          {pending ? "Joining NF Club…" : "Join NF Club"}
        </button>
        <p role="status" className="sr-only">
          {pending ? "Submitting your signup." : ""}
        </p>
        <p className="text-xs leading-relaxed text-text-secondary">
          Free, no account, no password. See how we handle your information in our{" "}
          <Link href="/privacy" className="font-semibold text-text underline underline-offset-2 hover:text-brand">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="font-semibold text-text underline underline-offset-2 hover:text-brand">
            Terms
          </Link>
          .
        </p>
      </div>
    </form>
  );
}

// Entry points link to /club from other pages, so the query string is fixed
// for the life of the form and there is nothing to subscribe to.
function subscribeToNothing() {
  return () => {};
}
function readSearch() {
  return window.location.search;
}
function readNoSearch() {
  return "";
}

function TextField({
  ref,
  id,
  label,
  name,
  type = "text",
  inputMode,
  autoComplete,
  value,
  onChange,
  maxLength,
  error,
  describedBy,
}: {
  ref: Ref<HTMLInputElement>;
  id: string;
  label: string;
  name: string;
  type?: "text" | "email";
  inputMode?: "email";
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  error?: string;
  describedBy?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="nf-eyebrow text-xs text-text">
        {label}
      </label>
      <input
        ref={ref}
        id={id}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        autoCapitalize={type === "email" ? "none" : "words"}
        spellCheck={false}
        maxLength={maxLength}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`min-h-12 w-full rounded-md border-2 bg-white/70 px-3.5 text-base text-text shadow-[inset_2px_2px_0_rgb(36_26_51/7%)] placeholder:text-text-secondary ${
          error ? "border-danger" : "border-ink"
        }`}
      />
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm font-semibold text-danger">
      <span aria-hidden="true">!</span>
      {message}
    </p>
  );
}

function ClubSignupSuccess({
  headingRef,
  firstName,
  interestLabels,
}: {
  headingRef: Ref<HTMLHeadingElement>;
  firstName: string;
  interestLabels: string[];
}) {
  const nextEvent = upcomingEvents.find((event) => event.isNext) ?? upcomingEvents[0];

  return (
    <div className="flex flex-col gap-5">
      <span className="nf-stamp w-fit text-brand">
        <span aria-hidden="true">✦</span> Member
      </span>
      <h2
        ref={headingRef}
        tabIndex={-1}
        className="nf-display text-4xl text-text outline-none md:text-5xl"
      >
        You&apos;re in{firstName ? `, ${firstName}` : ""}.
      </h2>
      <p className="text-base leading-relaxed text-text-secondary">
        Welcome to NF Club. Nostalgia Fest will email you about upcoming shows,
        announcements and what&apos;s happening on the floor.
      </p>

      {interestLabels.length > 0 ? (
        <div>
          <p className="text-sm font-semibold text-text">You told us you&apos;re into</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {interestLabels.map((label) => (
              <li
                key={label}
                className="rounded-lg border-2 border-ink bg-brand-soft px-3 py-1.5 text-sm font-semibold text-text"
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {nextEvent ? (
        <div className="rounded-xl bg-ink p-5 text-text-inverse">
          <p className="nf-eyebrow text-xs text-gold-bright">Next up</p>
          <p className="nf-display mt-2 text-3xl">{nextEvent.name}</p>
          <p className="tabular-nums mt-2 text-sm text-text-inverse-secondary">
            {nextEvent.dateRange} · {nextEvent.venue}
          </p>
          <p className="mt-1 text-sm font-semibold text-gold-bright">{nextEvent.admissionLabel}</p>
          <Link
            href={nextEvent.href}
            className="nf-action nf-action-gold mt-4 min-h-12 w-full px-5 text-base sm:w-auto"
          >
            See the event details
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
