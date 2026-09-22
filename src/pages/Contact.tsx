import { useMemo, useState, type FormEvent } from "react";
import { PageHero } from "../components/PageHero";
import {
  BtnLink,
  Field,
  TextInput,
  SelectInput,
  TextArea,
  SuccessPanel,
  ErrorState,
} from "../components/ui";
import { Reveal } from "../components/motion";
import { ArrowUpRight, ChatIcon, MapPinIcon } from "../components/icons";
import { useRoute, useSeo } from "../lib/router";
import { ENQUIRY_TYPES } from "../lib/data";
import { useConcierge } from "../components/Concierge";

type Values = { name: string; email: string; phone: string; type: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Please enter a valid email address.";
  if (v.phone.trim() && v.phone.replace(/[\s+()-]/g, "").length < 7)
    e.phone = "Please enter a valid phone number, or leave this blank.";
  if (!v.type) e.type = "Please choose an enquiry type.";
  /*
   * Decision: the message rule is deliberately "ten words", not ten characters
   * (the earlier code counted characters while the copy promised words). Count
   * words so the validation and the guidance agree.
   */
  if (v.message.trim().split(/\s+/).length < 10)
    e.message = "Please write at least ten words describing your enquiry.";
  return e;
}

export default function Contact() {
  useSeo({
    title: "Contact — GIBS",
    description:
      "Reach GIBS admissions, executive education and the institutional team. The Concierge can route your enquiry.",
  });

  const { query } = useRoute();
  const preselect = query.get("type") ?? "";
  const { setOpen } = useConcierge();

  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    phone: "",
    type: ENQUIRY_TYPES.includes(preselect as never) ? preselect : "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const set = (key: keyof Values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`GIBS enquiry — ${values.type || "General"}`);
    const body = encodeURIComponent(
      `Name: ${values.name}\nEmail: ${values.email}\nPhone: ${values.phone || "—"}\n\n${values.message}`
    );
    return `mailto:admissions@gibs.example?subject=${subject}&body=${body}`;
  }, [values]);

  const onSubmit = async (e: FormEvent) => {
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
    setStatus("submitting");
    /*
     * FRONTEND ONLY — there is no submission backend yet.
     * The validated payload is handed to the visitor's email client via the
     * mailto action on the success panel. Replace this block with a POST to
     * the official endpoint when provisioned; keep the same Status contract.
     */
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Write to the"
        italic="institution."
        intro="Tell us where you are heading and the right team will respond. Prefer a guided route? The Concierge can answer immediately."
        breadcrumbs={[{ label: "Contact" }]}
      />

      <section className="bg-white">
        <div className="container-x grid min-w-0 gap-14 py-16 sm:py-24 lg:grid-cols-12 lg:gap-16">
          {/* Form */}
          <div className="min-w-0 lg:col-span-7">
            {status === "success" ? (
              <SuccessPanel title="Your enquiry is ready to send.">
                <p>
                  This form has not sent anything on its own. Open your email
                  client to deliver it to <span className="font-semibold text-forest-700">admissions@gibs.example</span>.
                  The details are pre-filled. If your email client does not open, copy the address and send manually.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href={mailtoHref} className="btn btn-primary btn-md">
                    Open in email
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    className="btn btn-outline-ink btn-md"
                    onClick={() => {
                      setStatus("idle");
                      setValues({ name: "", email: "", phone: "", type: "", message: "" });
                    }}
                  >
                    Send another enquiry
                  </button>
                </div>
              </SuccessPanel>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-7">
                <div className="grid gap-7 sm:grid-cols-2">
                  <Field label="Full name" htmlFor="name" required error={errors.name}>
                    <TextInput
                      id="name"
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

                <Field label="Phone (optional)" htmlFor="phone" error={errors.phone}>
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
                    placeholder="+234 …"
                  />
                </Field>

                <Field label="Enquiry type" htmlFor="enquiry-type" required error={errors.type}>
                  <SelectInput
                    id="enquiry-type"
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
                    name="message"
                    invalid={!!errors.message}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    value={values.message}
                    onChange={set("message")}
                    placeholder="Tell us about your interest, stage and questions…"
                  />
                </Field>

                {status === "error" && (
                  <ErrorState
                    title="The form could not be prepared"
                    body="An unexpected problem occurred while validating your enquiry. Please try again, or write directly via the Concierge."
                    onRetry={() => setStatus("idle")}
                  />
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn btn-primary btn-lg w-full sm:w-auto"
                >
                  {status === "submitting" ? (
                    <>
                      <span
                        className="h-4 w-4 animate-spin rounded-full border-2 border-ivory/40 border-t-ivory"
                        aria-hidden="true"
                      />
                      Preparing enquiry…
                    </>
                  ) : (
                    <>
                      Send Enquiry
                      <ArrowUpRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                <p className="text-[12.5px] leading-relaxed text-muted">
                  This form validates your details and hands them to your email
                  client. No data is transmitted to a server yet.
                </p>
              </form>
            )}
          </div>

          {/* Side rail */}
          <div className="min-w-0 lg:col-span-5">
            <Reveal y={32}>
              <div className="space-y-4">
                <div className="border border-line bg-paper p-7">
                  <p className="eyebrow">Prefer to ask first?</p>
                  <p className="mt-4 type-body">
                    The GIBS Concierge answers immediately and can route your
                    question to the right person.
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="btn btn-ink btn-md mt-6"
                  >
                    <ChatIcon className="h-4 w-4" />
                    Open the Concierge
                  </button>
                </div>

                <div className="border border-line bg-paper p-7">
                  <p className="eyebrow">Find us</p>
                  <p className="mt-4 flex items-start gap-3 text-[14px] text-muted">
                    <MapPinIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-forest-600" />
                    <span className="italic">To be published. Official campus address and postal details.</span>
                  </p>
                  <p className="mt-4 type-body">
                    Admissions inbox, phone lines and office hours are
                    published by the registrar.
                  </p>
                  <BtnLink to="/concierge" variant="outline-ink" size="md" className="mt-6">
                    Concierge page
                  </BtnLink>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
