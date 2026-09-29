import { useMemo, useState, type FormEvent } from "react";
import { PageHero } from "../components/PageHero";
import {
  Field,
  TextInput,
  SelectInput,
  TextArea,
  SuccessPanel,
  ErrorState,
} from "../components/ui";
import { Reveal } from "../components/motion";
import { ArrowUpRight, ChatIcon, MapPinIcon, PhoneIcon, MailIcon } from "../components/icons";
import { useRoute, useSeo } from "../lib/router";
import { ENQUIRY_TYPES, INSTITUTIONAL_DATA, CAMPUSES } from "../lib/data";
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
  if (v.message.trim().split(/\s+/).length < 5)
    e.message = "Please write a message describing your enquiry.";
  return e;
}

export default function Contact() {
  useSeo({
    title: "Contact — Goshen International Business School (GIBS)",
    description:
      "Reach GIBS headquarters in Ilorin, Abuja & Ibafo study centers, executive training enquiries, and programme subscriptions.",
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

  const primaryEmail = INSTITUTIONAL_DATA.emails?.[0] ?? "gibsilorin@gmail.com";

  const set = (key: keyof Values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`GIBS Enquiry — ${values.type || "General"}`);
    const body = encodeURIComponent(
      `Name: ${values.name}\nEmail: ${values.email}\nPhone: ${values.phone || "—"}\nEnquiry Type: ${values.type}\n\nMessage:\n${values.message}`
    );
    return `mailto:${primaryEmail}?subject=${subject}&body=${body}`;
  }, [values, primaryEmail]);

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
    await new Promise((r) => setTimeout(r, 600));
    setStatus("success");
  };

  return (
    <>
      <PageHero
        eyebrow="Contact & Locations"
        title="Connect with"
        italic="GIBS."
        intro="Reach our headquarters in Ilorin, Abuja and Ibafo training centers, or submit an enquiry for programme subscriptions, in-plant workshops, and executive education."
        breadcrumbs={[{ label: "Contact" }]}
      />

      <section className="bg-white">
        <div className="container-x section-y grid min-w-0 gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Form */}
          <div className="min-w-0 lg:col-span-7">
            {status === "success" ? (
              <SuccessPanel title="Your enquiry is ready to deliver.">
                <p>
                  Click below to open your email client and deliver directly to{" "}
                  <span className="font-semibold text-forest-700">{primaryEmail}</span>.
                  Your message and details are pre-formatted.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a href={mailtoHref} className="btn btn-primary btn-md">
                    Open in email client
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
                    placeholder="08160010401 or +234 …"
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
                    placeholder="Provide details of your programme interest, nomination request, or institutional collaboration…"
                  />
                </Field>

                {status === "error" && (
                  <ErrorState
                    title="The form could not be prepared"
                    body="An unexpected problem occurred while validating your enquiry. Please write directly to gibsilorin@gmail.com."
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
                      Submit Enquiry
                      <ArrowUpRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Side rail with Official Institutional Contact Information */}
          <div className="min-w-0 lg:col-span-5">
            <Reveal y={32}>
              <div className="space-y-6">
                <div className="border border-line bg-paper p-7">
                  <p className="eyebrow">Interactive Assistance</p>
                  <p className="mt-3 type-body">
                    GIBS AI is available to help guide you through course selection, overseas hub schedules, and fee breakdowns.
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="btn btn-ink btn-md mt-5"
                  >
                    <ChatIcon className="h-4 w-4" />
                    Open GIBS AI
                  </button>
                </div>

                <div className="border border-line bg-paper p-7 space-y-5">
                  <div>
                    <p className="eyebrow">Headquarters (Ilorin)</p>
                    <p className="mt-2 flex items-start gap-2.5 text-[14px] text-ink">
                      <MapPinIcon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-forest-600" />
                      <span>{CAMPUSES[0]?.address ?? ""}</span>
                    </p>
                  </div>

                  <div className="border-t border-line/60 pt-4">
                    <p className="eyebrow">Postal Address</p>
                    <p className="mt-1 text-[13.5px] text-muted">
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
                            className="flex min-h-6 items-center gap-2 text-[13.5px] font-medium text-forest-700 hover:underline"
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
                      {INSTITUTIONAL_DATA.phoneNumbers.map((phone) => (
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
