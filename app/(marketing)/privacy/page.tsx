import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Naxus",
  description: "Privacy Policy for Naxus Technology Development.",
};

const LAST_UPDATED = "March 17, 2026";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
            Legal
          </p>
          <h1 className="text-4xl font-extrabold tracking-tighter text-foreground mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">

        <Section title="1. Introduction">
          <p>
            Naxus Technology Development ("Naxus", "we", "us", or "our") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, store, and protect your data when you use our services, platforms, and websites.
          </p>
          <p>
            By using our Services, you acknowledge that you have read and understood this policy. If you do not agree, please discontinue use of our Services.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect information you provide directly to us:</p>
          <ul>
            <li><strong className="text-foreground">Account data</strong> — name, email address, password (hashed), and role</li>
            <li><strong className="text-foreground">Profile data</strong> — professional background, skills, GitHub profile, and portfolio links</li>
            <li><strong className="text-foreground">Project data</strong> — project details, milestones, approvals, and communications</li>
            <li><strong className="text-foreground">Payment data</strong> — transaction records and payment schedules (we do not store card details)</li>
            <li><strong className="text-foreground">Communication data</strong> — messages, feedback, and support requests</li>
          </ul>
          <p>We also collect information automatically:</p>
          <ul>
            <li>Browser type, device information, and IP address</li>
            <li>Pages visited and features used (via Vercel Analytics)</li>
            <li>Session data and authentication tokens stored in secure cookies</li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul>
            <li>Create and manage your account</li>
            <li>Deliver, maintain, and improve our Services</li>
            <li>Process project engagements, tasks, and payments</li>
            <li>Send you important service notifications and updates</li>
            <li>Respond to your requests and provide support</li>
            <li>Monitor platform usage and prevent fraud or abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p>
            We do not sell your personal data to third parties. We do not use your data for advertising purposes on our own platforms.
          </p>
        </Section>

        <Section title="4. Authentication and Security">
          <p>
            We use a custom JWT-based authentication system. Your session is managed through secure, httpOnly cookies that are not accessible via JavaScript. Passwords are hashed using bcrypt and are never stored in plain text.
          </p>
          <p>
            Access tokens expire after 15 minutes. Refresh tokens expire after 7 days. All sessions are stored server-side and can be revoked at any time.
          </p>
          <p>
            We use industry-standard encryption for data in transit (TLS) and implement access controls to limit who can view sensitive information.
          </p>
        </Section>

        <Section title="5. OAuth and Third-Party Sign-In">
          <p>
            If you sign in using Google or GitHub OAuth, we receive only the basic profile information those services share — your name, email, and profile picture. We do not access your private repositories, contacts, or any other personal data beyond what is required for authentication.
          </p>
          <p>
            Your use of third-party OAuth providers is also subject to their respective privacy policies.
          </p>
        </Section>

        <Section title="6. Data Sharing">
          <p>
            We do not sell, rent, or trade your personal information. We may share data in the following limited circumstances:
          </p>
          <ul>
            <li><strong className="text-foreground">Service providers</strong> — hosting, database, and analytics tools that operate under strict data processing agreements</li>
            <li><strong className="text-foreground">Legal requirements</strong> — if required by law, regulation, or court order</li>
            <li><strong className="text-foreground">Business transfers</strong> — in the event of a merger or acquisition, with appropriate notice</li>
            <li><strong className="text-foreground">With your consent</strong> — for any other purpose with your explicit permission</li>
          </ul>
        </Section>

        <Section title="7. Cookies">
          <p>We use the following types of cookies:</p>
          <ul>
            <li><strong className="text-foreground">Authentication cookies</strong> — essential for keeping you signed in securely</li>
            <li><strong className="text-foreground">Preference cookies</strong> — to remember your language, theme, and color settings</li>
            <li><strong className="text-foreground">Analytics cookies</strong> — anonymized usage data via Vercel Analytics to understand how our platform is used</li>
          </ul>
          <p>
            You can disable cookies in your browser settings, but this may affect the functionality of our Services.
          </p>
        </Section>

        <Section title="8. Data Retention">
          <p>
            We retain your personal data for as long as your account is active or as needed to provide Services. If you delete your account:
          </p>
          <ul>
            <li>Your profile data is deleted within 30 days</li>
            <li>Project records may be retained for up to 2 years for legal and accounting purposes</li>
            <li>Anonymized analytics data may be retained indefinitely</li>
          </ul>
        </Section>

        <Section title="9. Your Rights">
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul>
            <li><strong className="text-foreground">Access</strong> — request a copy of the data we hold about you</li>
            <li><strong className="text-foreground">Correction</strong> — request correction of inaccurate data</li>
            <li><strong className="text-foreground">Deletion</strong> — request deletion of your personal data</li>
            <li><strong className="text-foreground">Portability</strong> — request your data in a machine-readable format</li>
            <li><strong className="text-foreground">Objection</strong> — object to certain types of processing</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at privacy@naxus.dev. We will respond within 30 days.
          </p>
        </Section>

        <Section title="10. Children's Privacy">
          <p>
            Our Services are not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a minor has provided us with personal data, we will delete it promptly.
          </p>
        </Section>

        <Section title="11. International Transfers">
          <p>
            Naxus is based in Dubai, UAE. Your data may be processed and stored in servers located in other countries. By using our Services, you consent to the transfer of your information to countries outside your country of residence, which may have different data protection rules.
          </p>
          <p>
            We ensure that any such transfers are subject to appropriate safeguards in accordance with applicable data protection laws.
          </p>
        </Section>

        <Section title="12. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes by updating the date at the top of this page or by sending a notification to your registered email address. Your continued use of the Services after changes are posted constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section title="13. Contact">
          <p>
            For privacy-related questions, requests, or concerns, please reach out to us:
          </p>
          <div className="mt-3 p-4 rounded-xl bg-muted border text-sm space-y-1">
            <p><span className="font-medium">Company:</span> Naxus Technology Development</p>
            <p><span className="font-medium">Location:</span> Dubai, United Arab Emirates</p>
            <p><span className="font-medium">Privacy Email:</span> privacy@naxus.dev</p>
            <p><span className="font-medium">General Email:</span> legal@naxus.dev</p>
          </div>
        </Section>

      </div>

      {/* Footer nav */}
      <div className="border-t">
        <div className="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between">
          <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </a>
          <a href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Terms of Service →
          </a>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold tracking-tight text-foreground border-b pb-3">
        {title}
      </h2>
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed [&_ul]:space-y-2 [&_ul]:ms-4 [&_ul]:list-disc [&_ul]:marker:text-muted-foreground/50 [&_strong]:font-medium">
        {children}
      </div>
    </section>
  );
}