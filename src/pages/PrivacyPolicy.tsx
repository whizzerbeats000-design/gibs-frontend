import type { ReactNode } from "react";
import { PageHero } from "../components/PageHero";
import { Link, useSeo } from "../lib/router";

const TITLE = "Privacy Policy | Goshen International Business School";
const DESCRIPTION =
  "Learn what information you may enter on the GIBS website, how the local programme concierge stores conversation history, and how to ask about your data-protection rights.";

function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-line py-8 first:pt-0 last:border-0">
      <h2 className="type-h3 text-ink">{title}</h2>
      <div className="mt-4 max-w-prose space-y-4 text-[15px] leading-relaxed text-ink/80">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPolicy() {
  useSeo({ title: TITLE, description: DESCRIPTION });

  return (
    <>
      <PageHero
        eyebrow="Privacy & Data Protection"
        title="Privacy"
        italic="Policy."
        intro="This notice explains what the GIBS website does with information you choose to enter, and what the website code can and cannot confirm about later handling."
      />

      <section className="section-y">
        <div className="container-x mx-auto max-w-5xl">
          <p className="mb-8 text-sm text-muted">Last updated: 24 October 2026</p>
          <article aria-label="GIBS Privacy Policy" className="divide-y divide-line">
            <PolicySection title="Who operates this website">
              <p>
                This website is for Goshen International Business School Limited (GIBS). For a privacy
                question or request, use the <Link to="/contact" className="font-semibold text-forest-700 underline underline-offset-4">Contact & Registry page</Link> and identify it as a privacy matter. The page prepares an email for you to review; it does not send the message automatically. The website does not publish a separate privacy email address or Data Protection Officer contact.
              </p>
            </PolicySection>

            <PolicySection title="Information you may provide">
              <p>
                The contact form lets you enter your name, email address, an optional phone number,
                enquiry type and message. You may also include information in the message that you
                choose to provide. The form validates these fields in your browser and places them in
                an email draft when you choose to continue. The website does not submit that form to
                a GIBS server or store the form entries in its own application storage.
              </p>
              <p>
                The footer calendar-updates form asks for an email address. It displays instructions
                and prepares an email draft; it does not subscribe you or send your address by itself.
              </p>
              <p>
                When you use the concierge, the text you type and its conversation replies are saved
                in this browser so the conversation can be restored. Avoid entering sensitive
                information that is not needed to ask about GIBS programmes.
              </p>
            </PolicySection>

            <PolicySection title="How the concierge handles conversations">
              <p>
                The concierge currently uses rules and programme information bundled with the
                website. It is not connected in this implementation to an external AI provider or a
                GIBS server, and the conversation is not sent away by the concierge code.
              </p>
              <p>
                Conversation history is kept in your browser's local storage, which is browser
                storage rather than a cookie. The floating concierge and the dedicated concierge
                page use separate storage entries. When a conversation is loaded, the application
                removes saved history older than 24 hours; this expiry check runs on load, not as a
                continuous background timer. Use the “Clear history” control to remove the current
                conversation from that browser immediately.
                Clearing browser storage also removes it. Other people or software with access to
                this browser profile may be able to see saved history before it is cleared or expires.
              </p>
            </PolicySection>

            <PolicySection title="Cookies, analytics and other services">
              <p>
                The website application code does not read or write browser cookies, and the
                repository contains no analytics or advertising integration. The concierge does not
                make a remote AI request. The site uses font files served with the website rather
                than loading fonts from a third-party font service.
              </p>
              <p>
                Loading a website requires network requests to its hosting infrastructure. The
                hosting provider may process technical request information such as an IP address,
                requested page, browser details and request time. The repository contains deployment
                configuration but does not establish the production host's logging, retention,
                security-monitoring or transfer practices. GIBS should confirm those details.
              </p>
            </PolicySection>

            <PolicySection title="Email, recipients and later handling">
              <p>
                If you choose to send an email draft, your email application and email provider
                transmit it to the GIBS address shown in the draft. The website code does not identify
                the email providers used by you or GIBS, or how GIBS manages the message after
                receipt. GIBS should confirm who can access enquiries, any service providers involved,
                and whether information is transferred or accessed outside Nigeria.
              </p>
              <p>
                The website code does not set a retention period or deletion process for email
                enquiries. GIBS should confirm how long received enquiries are kept and how deletion
                requests are handled. The 24-hour period described above applies only to concierge
                history in the browser.
              </p>
            </PolicySection>

            <PolicySection title="Purposes and lawful basis">
              <p>
                The website presents GIBS programmes and provides ways to prepare an enquiry. The
                website code does not determine the lawful basis GIBS relies on for processing an
                email after it is received, or for any later admissions or registry activity. GIBS
                should identify the purpose and applicable lawful basis for each such activity under
                the Nigeria Data Protection Act 2023; this notice does not presume one.
              </p>
            </PolicySection>

            <PolicySection title="Your data-protection rights">
              <p>
                Subject to the Act's conditions and exceptions, data subjects may have rights to be
                informed, request access or correction, object to or restrict processing, request
                erasure, request portability, withdraw consent where processing relies on consent,
                and safeguards relating to decisions made solely by automated means. You may also
                complain to the Nigeria Data Protection Commission (NDPC).
              </p>
              <p>
                To raise a request with GIBS, use the <Link to="/contact" className="font-semibold text-forest-700 underline underline-offset-4">Contact & Registry page</Link> and explain what you are requesting. The site does not provide a dedicated privacy-request channel or specify GIBS's response process; GIBS should confirm these arrangements. Read the <a className="font-semibold text-forest-700 underline underline-offset-4" href="https://ndpc.gov.ng/wp-content/uploads/2024/03/Nigeria_Data_Protection_Act_2023.pdf">Nigeria Data Protection Act 2023</a> or visit the <a className="font-semibold text-forest-700 underline underline-offset-4" href="https://ndpc.gov.ng/">NDPC website</a> for information about the regulator.
              </p>
            </PolicySection>

            <PolicySection title="Security">
              <p>
                The website deployment configuration includes browser security response headers.
                These are technical safeguards for website delivery; they do not guarantee that
                email, hosting or other systems are free from risk. GIBS should confirm the security
                controls and incident process for information it receives outside this website.
              </p>
            </PolicySection>

            <PolicySection title="Children and young people">
              <p>
                This website does not ask for a visitor's age or provide an age-check flow. GIBS
                should confirm how it handles personal information from prospective learners who
                are children or otherwise require a representative's involvement. A parent or
                guardian with a concern can contact GIBS through the Contact & Registry page.
              </p>
            </PolicySection>

            <PolicySection title="Changes to this notice">
              <p>
                This notice may be updated when the website or GIBS's confirmed data practices
                change. The date above identifies the latest version published on this page.
              </p>
            </PolicySection>
          </article>
        </div>
      </section>
    </>
  );
}
