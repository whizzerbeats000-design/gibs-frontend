import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cloneElement, isValidElement } from "react";
import { Link } from "../lib/router";
import { cn } from "../utils/cn";
import { ChevronRight, ChevronDown, ArrowUpRight } from "./icons";
import { Reveal } from "./motion";
import { imageSet } from "../lib/data";

/* ---------- Buttons ---------- */

type BtnVariant = "primary" | "gold" | "ink" | "outline-light" | "outline-ink";
type BtnSize = "sm" | "md" | "lg";

const variants: Record<BtnVariant, string> = {
  primary: "btn-primary",
  gold: "btn-gold",
  ink: "btn-ink",
  "outline-light": "btn-outline-light",
  "outline-ink": "btn-outline-ink",
};

const sizes: Record<BtnSize, string> = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant;
  size?: BtnSize;
};

export function Btn({ variant = "primary", size = "lg", className, ...props }: BtnProps) {
  return <button className={cn("btn", variants[variant], sizes[size], className)} {...props} />;
}

type BtnLinkProps = {
  to: string;
  children: ReactNode;
  variant?: BtnVariant;
  size?: BtnSize;
  className?: string;
  onClick?: () => void;
  "aria-label"?: string;
};

export function BtnLink({
  to,
  children,
  variant = "primary",
  size = "lg",
  className,
  ...rest
}: BtnLinkProps) {
  return (
    <Link to={to} className={cn("btn", variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}

/* ---------- Typography / structure ---------- */

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return <p className={light ? "eyebrow-light" : "eyebrow"}>{children}</p>;
}

/* ---------- Breadcrumbs ---------- */

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] font-medium uppercase tracking-[0.12em] text-muted sm:text-[12px]">
        <li>
          <Link to="/" className="text-muted transition-colors hover:text-forest-700">
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 text-muted/60" />
            {item.to ? (
              <Link to={item.to} className="text-muted transition-colors hover:text-forest-700">
                {item.label}
              </Link>
            ) : (
              <span className="text-forest-700" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- Official-data marker ---------- */

export function DataNote({
  label = "Official GIBS data required",
  children,
  light = false,
}: {
  label?: string;
  children?: ReactNode;
  light?: boolean;
}) {
  return (
    <div
      className={cn(
        "border-l-2 pl-4 text-sm leading-relaxed",
        light ? "border-gold-400/70 text-ivory/70" : "border-gold-600 text-muted"
      )}
    >
      <p>
        <span className={cn("font-semibold", light ? "text-gold-300" : "text-gold-700")}>
          {label}.
        </span>{" "}
        {children ?? "This information will be published by GIBS."}
      </p>
    </div>
  );
}

/* ---------- States: loading / empty / error / success ---------- */

export function EmptyState({
  title,
  body,
  action,
  headingLevel = 3,
}: {
  title: string;
  body: string;
  action?: ReactNode;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="flex flex-col items-center border border-line bg-ivory/55 px-6 py-16 text-center">
      <Heading className="type-h3 text-ink">{title}</Heading>
      <p className="mt-3 max-w-md type-body text-muted">{body}</p>
      {action && <div className="mt-7">{action}</div>}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  body = "An unexpected problem occurred. Please try again, and if it persists, contact GIBS directly.",
  onRetry,
}: {
  title?: string;
  body?: string;
  onRetry?: () => void;
}) {
  return (
    <div role="alert" className="border border-error/25 bg-error-bg px-6 py-10 text-center">
      <h3 className="type-h3 text-ink">{title}</h3>
      <p className="mx-auto mt-3 max-w-md type-body text-muted">{body}</p>
      {onRetry && (
        <Btn variant="outline-ink" size="md" className="mt-6" onClick={onRetry}>
          Try again
        </Btn>
      )}
    </div>
  );
}

export function SuccessPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      role="status"
      className="border-l-2 border-forest-600 bg-forest-50 px-6 py-7"
    >
      <h3 className="display-serif text-xl text-forest-800">{title}</h3>
      <div className="mt-3 type-body text-muted">{children}</div>
    </div>
  );
}

/* ---------- Form primitives ---------- */

export function Field({
  label,
  htmlFor,
  error,
  required,
  children,
  hint,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  const describedBy = error
    ? `${htmlFor}-error`
    : hint
      ? `${htmlFor}-hint`
      : undefined;
  const control =
    isValidElement<{ "aria-describedby"?: string }>(children) && describedBy
      ? cloneElement(children, {
          "aria-describedby": children.props["aria-describedby"] ?? describedBy,
        })
      : children;
  return (
    <div>
      <label htmlFor={htmlFor} className="field-label">
        {label} {required && <span className="text-gold-600" aria-hidden="true">*</span>}
      </label>
      {control}
      {hint && !error && (
        <p id={`${htmlFor}-hint`} className="mt-1.5 text-[13px] text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-[13px] font-medium text-error">
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean };
export function TextInput({ invalid, className, ...props }: InputProps) {
  return <input className={cn("field-input", invalid && "field-input-error", className)} {...props} />;
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean };
export function SelectInput({ invalid, className, children, ...props }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn("field-input appearance-none pr-10", invalid && "field-input-error", className)}
        {...props}
      >
        {children}
      </select>
      <span aria-hidden="true" className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted">
        <ChevronDown className="h-4 w-4" />
      </span>
    </div>
  );
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean };
export function TextArea({ invalid, className, ...props }: TextAreaProps) {
  return <textarea className={cn("field-input min-h-[150px] resize-y", invalid && "field-input-error", className)} {...props} />;
}

/* ---------- Row link with arrow ---------- */

export function ArrowTextLink({
  to,
  children,
  light = false,
  className,
}: {
  to: string;
  children: ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "group link-underline text-sm",
        light ? "text-ivory" : "text-forest-700",
        className
      )}
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}


/* ---------- Page closings — deliberately varied compositions ---------- */

/** Quiet, editorial close on warm paper — asymmetric, no fill. */
export function ClosingQuiet({
  eyebrow: eyebrowText,
  title,
  italic,
  body,
  actions,
  surface = "paper",
}: {
  eyebrow: string;
  title: ReactNode;
  italic?: ReactNode;
  body?: ReactNode;
  actions: ReactNode;
  surface?: "paper" | "white";
}) {
  return (
    <section className={surface === "white" ? "bg-white" : "paper-grain bg-paper"}>
      <div className="container-x section-y">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow>{eyebrowText}</Eyebrow>
              <h2 className="type-h2 mt-5 text-ink">
                {title} {italic && <em className="italic text-forest-700">{italic}</em>}
              </h2>
            </Reveal>
          </div>
          <div className="flex flex-col justify-end gap-8 lg:col-span-7">
            {body && (
              <Reveal delay={0.1}>
                <p className="max-w-xl type-body text-muted lg:ml-auto">
                  {body}
                </p>
              </Reveal>
            )}
            <Reveal delay={0.16}>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 lg:justify-end">
                {actions}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Immersive full-bleed image close — a spatial, cinematic end. */
export function ClosingImmersive({
  image,
  alt,
  eyebrow: eyebrowText,
  title,
  italic,
  body,
  actions,
}: {
  image: string;
  alt: string;
  eyebrow: string;
  title: ReactNode;
  italic?: ReactNode;
  body?: ReactNode;
  actions: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-forest-950">
      <img
        {...imageSet(image)}
        alt={alt}
        loading="lazy"
        decoding="async"
        sizes="100vw"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="film-grain" aria-hidden="true" />
      <div className="absolute inset-0 bg-[linear-gradient(92deg,rgba(0,32,9,0.92)_0%,rgba(0,38,12,0.72)_45%,rgba(0,32,9,0.45)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,32,9,0.7),transparent_55%)]" />
      <div className="container-x section-y-major relative">
        <div className="max-w-2xl text-ivory">
          <Reveal>
            <Eyebrow light>{eyebrowText}</Eyebrow>
          </Reveal>
          <Reveal delay={0.08} y={28}>
            <h2 className="type-h1 mt-6">
              {title} {italic && <em className="italic text-gold-300">{italic}</em>}
            </h2>
          </Reveal>
          {body && (
            <Reveal delay={0.16}>
              <p className="mt-5 max-w-lg type-body text-ivory/85">
                {body}
              </p>
            </Reveal>
          )}
          <Reveal delay={0.22}>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">{actions}</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Dark journal close — two-column editorial panel for research/news pages. */
export function ClosingJournal({
  eyebrow: eyebrowText,
  quote,
  body,
  actions,
}: {
  eyebrow: string;
  quote: ReactNode;
  body?: ReactNode;
  actions: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-forest-900 text-ivory">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_120%_at_12%_-20%,rgba(235,211,117,0.12),transparent_55%)]" />
      <div className="container-x section-y-major relative grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <Eyebrow light>{eyebrowText}</Eyebrow>
            <h2 className="type-h2 mt-6">
              {quote}
            </h2>
          </Reveal>
        </div>
        <div className="lg:col-span-5 lg:pl-8">
          <Reveal delay={0.12}>
            {body && <p className="type-body text-ivory/85">{body}</p>}
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">{actions}</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
