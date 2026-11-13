import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { PageHero } from "../components/PageHero";
import {
  Field,
  TextInput,
  SelectInput,
  TextArea,
  SuccessPanel,
} from "../components/ui";
import { Reveal } from "../components/motion";
import { ArrowUpRight, ChatIcon, MapPinIcon, PhoneIcon, MailIcon } from "../components/icons";
import { useRoute, useSeo } from "../lib/router";
import { ENQUIRY_TYPES, INSTITUTIONAL_DATA, CAMPUSES, getProgramme } from "../lib/data";
import { activePhoneNumbers } from "../lib/phones";
import { suppressExpiredSchedule } from "../lib/suppressExpiredDates";
import { useConcierge } from "../components/Concierge";

/* Render-layer transform for INSTITUTIONAL_DATA.phoneNumbers. data.ts is
   byte-locked (SHA-256 910ff4d7…), so the retired numbers it still lists are
   filtered out and the current official number is appended. The policy lives
   in src/lib/phones.ts so the Contact page, the concierge and the SEO shell
   generator cannot drift apart. The Contact page then renders this list with
   tel: links, so callers always reach the active desk. */
const PHONE_LINES: string[] = activePhoneNumbers(INSTITUTIONAL_DATA.phoneNumbers);

type Values = { name: string; email: string; phone: string; type: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "ready";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (v.phone.trim() && v.phone.replace(/[\s+()-]/g, "").length < 7)
    e.phone = "Please enter a valid phone number, or leave this blank.";
  if (!v.type) e.type = "Please choose an enquiry type.";
  if (v.message.trim().split(/\s+/).length < 5)
    e.message = "Please write a message describing your enquiry.";
  return e;
}

export default function Contact() {
  useSeo({
    title: "Contact — Goshen International Business School (GIBS)",
    description:
      "Reach GIBS headquarters in Ilorin, Abuja & Ibafo study centers and make an enquiry for any programme, in-plant workshop, or executive education question.",
  });

  const { query } = useRoute();
  const preselect = query.get("type") ?? "";
  const progParam = query.get("programme") ?? "";
  const matchedProgramme = useMemo(() => (progParam ? getProgramme(progParam) : undefined), [progParam]);
  const { setOpen } = useConcierge();

  const resolvedInitialType = useMemo(() => {
    if (ENQUIRY_TYPES.includes(preselect as never)) return preselect;
    if (matchedProgramme) {
      return matchedProgramme.destination === "Local"
        ? "Local Open Training Registration"
        : "Foreign Training Programmes (Kigali, Dubai, London, Houston)";
    }
    return "";
  }, [preselect, matchedProgramme]);

  const resolvedInitialMessage = useMemo(() => {
    if (matchedProgramme) {
      return `I would like to make an enquiry regarding "${matchedProgramme.title}" (${matchedProgramme.code}). Please provide details on programme schedule dates, venue logistics, and nomination/registration requirements.`;
    }
    return "";
  }, [matchedProgramme]);

  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    phone: "",
    type: resolvedInitialType,
    message: resolvedInitialMessage,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const currentTypeRef = useRef(values.type);
  currentTypeRef.current = values.type;

  /* The enquiry type is pre-selected from the ?type= query parameter, which
     the concierge replies and the programme/admissions CTAs link to. Re-applying
     the parameter whenever it changes ensures that deep links or in-app route
     transitions keep the form synchronised. */
  useEffect(() => {
    if (matchedProgramme) {
      const targetType = ENQUIRY_TYPES.includes(preselect as never)
        ? preselect
        : matchedProgramme.destination === "Local"
        ? "Local Open Training Registration"
        : "Foreign Training Programmes (Kigali, Dubai, London, Houston)";
      setValues((v) => ({
        ...v,
        type: targetType,
        message: v.message || resolvedInitialMessage,
      }));
      setStatus("idle");
    } else if (ENQUIRY_TYPES.includes(preselect as never)) {
      const typeChanged = currentTypeRef.current !== preselect;
      setValues((v) => (v.type === preselect ? v : { ...v, type: preselect }));
      if (typeChanged) setStatus("idle");
    }
  }, [preselect, matchedProgramme, resolvedInitialMessage]);

  const primaryEmail = INSTITUTIONAL_DATA.emails?.[0] ?? "gibsilorin@gmail.com";

  const set = (key: keyof Values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const mailtoHref = useMemo(() => {
    const programmeTag = matchedProgramme ? ` [${matchedProgramme.code}]` : "";
    const subject = encodeURIComponent(`GIBS Enquiry — ${values.type || "General"}${programmeTag}`);
    const programmeHeader = matchedProgramme
      ? `Programme: ${matchedProgramme.title} (${matchedProgramme.code})\nDestination: ${matchedProgramme.destination}\nFee: ${matchedProgramme.fees}\n`
      : "";
    const body = encodeURIComponent(
      `Name: ${values.name}\nEmail: ${values.email}\nPhone: ${values.phone || "—"}\nEnquiry Type: ${values.type}\n${programmeHeader}\nMessage:\n${values.message}`
    );
    return `mailto:${primaryEmail}?subject=${subject}&body=${body}`;
  }, [values, primaryEmail, matchedProgramme]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = document.getElementById(
        Object.keys(found)[0] === "type" ? "enquiry-type" : Object.keys(found)[0]
      );
      first?.focus();
      return;
    }
    setStatus("ready");
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Email address copied to clipboard!");
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      alert("Failed to copy email address.");
    }
  };

  const handleEmailFallback = () => {
    copyToClipboard(primaryEmail);
  };


  return (
    <>
      <PageHero
        eyebrow="Contact & Locations"
        title="Connect with"
        italic="GIBS."
        intro="Reach our headquarters in Ilorin, Abuja and Ibafo training centers, or make an enquiry below for any programme, in-plant workshop, or executive education question. GIBS AI is also available to help."
        breadcrumbs={[{ label: "Contact" }]}
      />

      <section className="bg-white">
        <div className="container-x section-y grid min-w-0 gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Form */}
          <div className="min-w-0 lg:col-span-7">
            {status === "ready" ? (
              <SuccessPanel title="Your enquiry is ready to send.">
                <p className="max-w-prose">
                  Your details have been validated. Click below to open your email client
                  with your message pre-formatted and addressed to{" "}
                  <span className="font-semibold text-forest-700">{primaryEmail}</span>.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href={mailtoHref} className="btn btn-primary btn-md">
                    Open in email client
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    className="btn btn-outline-ink btn-md"
                    onClick={handleEmailFallback}
                  >
                    Copy email address
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-ink btn-md"
                    onClick={() => {
                      setStatus("idle");
                      setValues({ name: "", email: "", phone: "", type: "", message: "" });
                    }}
                  >
                    Start over
                  </button>
                </div>
              </SuccessPanel>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-7 max-w-editorial">
                {matchedProgramme && (
                  <div className="rounded border border-forest-200 bg-forest-50/70 p-4 text-ink">
                    <span className="meta text-xs font-semibold uppercase tracking-wider text-forest-800">
                      Programme Enquiry
                    </span>
                    <h3 className="display-serif mt-1 text-base font-semibold text-ink sm:text-lg">
                      {matchedProgramme.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted">
                      Code: <strong className="text-ink">{matchedProgramme.code}</strong> · Destination: {matchedProgramme.destination} · Official Fee: {matchedProgramme.fees} · Schedule: {suppressExpiredSchedule(matchedProgramme.schedule)}
                    </p>
                  </div>
                )}
                <div className="grid gap-7 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="name" required error={errors.name}>
                    <TextInput
                      id="name"
                      required
                      name="name"
                      autoComplete="name"
                      invalid={!!errors.name}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      value={values.name}
                      onChange={set("name")}
                    />
                  </Field>
                  <Field label="Email" htmlFor="email" required error={errors.email}>
                    <TextInput
                      id="email"
                      required
                      name="email"
                      type="email"
                      autoComplete="email"
                      invalid={!!errors.email}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      value={values.email}
                      onChange={set("email")}
                    />
                  </Field>
                </div>

                <Field label="Phone number" htmlFor="phone" error={errors.phone}>
                  <TextInput
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    invalid={!!errors.phone}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    value={values.phone}
                    onChange={set("phone")}
                    placeholder={`${PHONE_LINES[0]} or +234 …`}
                  />
                </Field>

                <Field label="Enquiry type" htmlFor="enquiry-type" required error={errors.type}>
                  <SelectInput
                    id="enquiry-type"
                    required
                    name="type"
                    invalid={!!errors.type}
                    aria-invalid={!!errors.type}
                    aria-describedby={errors.type ? "enquiry-type-error" : undefined}
                    value={values.type}
                    onChange={set("type")}
                  >
                    <option value="">Select an enquiry type…</option>
                    {ENQUIRY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </SelectInput>
                </Field>

                <Field label="Your message" htmlFor="message" required error={errors.message}>
                  <TextArea
                    id="message"
                    required
                    name="message"
                    invalid={!!errors.message}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    value={values.message}
                    onChange={set("message")}
                    placeholder="Provide details of your programme interest, staff training enquiry, or institutional collaboration…"
                  />
                </Field>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-full sm:w-auto"
                >
                  Make an Enquiry
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

          {/* Side rail with Official Institutional Contact Information */}
          <div className="min-w-0 lg:col-span-5">
            <Reveal y={32}>
              <div className="space-y-6">
                <div className="rounded-panel border border-line bg-paper p-7 shadow-crisp max-w-card">
                  <div className="flex items-center justify-between gap-3">
                    <p className="eyebrow">Interactive Advisory</p>
                    <span className="font-mono text-[11px] font-medium text-muted uppercase tracking-wider">
                      Executive Guide
                    </span>
                  </div>
                  <p className="mt-3 type-body max-w-prose">
                    GIBS AI is available to help guide you through programme selection, overseas hub schedules, and fee breakdowns.
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="btn btn-ink btn-md mt-5 w-full sm:w-auto"
                  >
                    <ChatIcon className="h-4 w-4" />
                    Open GIBS AI
                  </button>
                </div>

                <div className="rounded-panel border border-line bg-paper p-7 shadow-crisp space-y-5 max-w-card">
                  <div>
                    <p className="eyebrow">Headquarters (Ilorin)</p>
                    <p className="mt-2 flex items-start gap-2.5 text-[14px] text-ink max-w-prose">
                      <MapPinIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-forest-600" />
                      <span>{CAMPUSES[0]?.address ?? ""}</span>
                    </p>
                  </div>

                  <div className="border-t border-line/60 pt-4">
                    <p className="eyebrow">Postal Address</p>
                    <p className="mt-1 text-sm text-muted max-w-prose">
                      {INSTITUTIONAL_DATA.postalAddress}
                    </p>
                  </div>

                  <div className="border-t border-line/60 pt-4">
                    <p className="eyebrow">Official Emails</p>
                    <ul className="mt-2 space-y-1">
                      {INSTITUTIONAL_DATA.emails.map((em) => (
                        <li key={em}>
                          <a
                            href={`mailto:${em}`}
                            className="flex min-h-6 items-center gap-2 text-sm font-medium text-forest-700 hover:underline"
                          >
                            <MailIcon className="h-3.5 w-3.5" />
                            {em}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-line/60 pt-4">
                    <p className="eyebrow">Official Phone Lines</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {PHONE_LINES.map((phone) => (
                        <a
                          key={phone}
                          href={`tel:${phone}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-forest-200 bg-forest-50/60 px-3 py-1 text-[12.5px] font-medium text-forest-800 hover:bg-forest-100"
                        >
                          <PhoneIcon className="h-3 w-3 text-forest-600" />
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
