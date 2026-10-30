import type {
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
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-muted">
        <li>
          <Link
            to="/"
            className="inline-block py-1.5 -my-1.5 text-muted transition-colors hover:text-forest-700 focus-visible:outline-2 focus-visible:outline-forest-600 focus-visible:outline-offset-2 rounded-xs"
          >
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <ChevronRight className="h-3 w-3 text-muted/60" />
            {item.to ? (
              <Link
                to={item.to}
                className="inline-block py-1.5 -my-1.5 text-muted transition-colors hover:text-forest-700 focus-visible:outline-2 focus-visible:outline-forest-600 focus-visible:outline-offset-2 rounded-xs"
              >
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
        <p id={`${htmlFor}-hint`} className="mt-1.5 text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-sm font-medium text-error">
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
