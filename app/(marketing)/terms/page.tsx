import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Naxus",
  description: "Terms of Service for Naxus Technology Development.",
};

const LAST_UPDATED = "March 17, 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3">
            Legal
          </p>
          <h1 className="text-4xl font-extrabold tracking-tighter text-foreground mb-3">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">

        <Section title="1. Agreement to Terms">
          <p>
            By accessing or using Naxus services, platforms, or websites ("Services"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Services.
          </p>
          <p>
            These Terms apply to all visitors, users, clients, and team members who access or use our Services.
          </p>
        </Section>

        <Section title="2. Use of Services">
          <p>
            You agree to use Naxus Services only for lawful purposes and in accordance with these Terms. You must not:
          </p>
          <ul>
            <li>Use the Services in any way that violates applicable laws or regulations</li>
            <li>Transmit any unsolicited or unauthorized advertising or promotional material</li>
            <li>Attempt to gain unauthorized access to any part of the Services</li>
            <li>Interfere with or disrupt the integrity or performance of the Services</li>
            <li>Reproduce, duplicate, copy, sell, or exploit any portion of the Services without express written permission</li>
          </ul>
        </Section>

        <Section title="3. Accounts and Access">
          <p>
            When you create an account with Naxus, you must provide accurate, complete, and current information. You are responsible for:
          </p>
          <ul>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use of your account</li>
          </ul>
          <p>
            We reserve the right to terminate accounts, remove content, or cancel services at our sole discretion.
          </p>
        </Section>

        <Section title="4. Client Projects and Deliverables">
          <p>
            When engaging Naxus for project development or technology services:
          </p>
          <ul>
            <li>Project scope, timelines, and pricing are defined in separate project agreements</li>
            <li>Milestone approvals and payment schedules are binding once confirmed by both parties</li>
            <li>Intellectual property rights for custom-developed work transfer to the client upon full payment</li>
            <li>Naxus retains the right to showcase completed work in its portfolio unless otherwise agreed in writing</li>
          </ul>
        </Section>

        <Section title="5. Talent Platform">
          <p>
            For individuals applying to join the Naxus talent network:
          </p>
          <ul>
            <li>Applications do not guarantee employment or engagement</li>
            <li>All work performed through the platform is subject to separate contractor or employment agreements</li>
            <li>Task assignments, performance reviews, and compensation are governed by individual agreements</li>
            <li>Naxus reserves the right to remove any talent from the platform for violations of conduct standards</li>
          </ul>
        </Section>

        <Section title="6. Payments and Refunds">
          <p>
            All payments made through Naxus platforms are subject to the following:
          </p>
          <ul>
            <li>Payments are processed according to the schedule agreed upon in the project contract</li>
            <li>Refund eligibility is determined on a case-by-case basis per the project agreement</li>
            <li>Disputed payments must be raised within 14 days of the transaction</li>
            <li>Currency and payment method details are specified at the time of engagement</li>
          </ul>
        </Section>

        <Section title="7. Intellectual Property">
          <p>
            The Naxus name, logo, platform design, and all original content are the exclusive property of Naxus and are protected by applicable intellectual property laws. You may not use our branding or content without prior written consent.
          </p>
          <p>
            Content you submit through our Services remains yours. By submitting content, you grant Naxus a limited license to use, display, and process it solely for providing the Services.
          </p>
        </Section>

        <Section title="8. Confidentiality">
          <p>
            Both parties agree to maintain the confidentiality of any proprietary or sensitive information shared during engagements. This includes but is not limited to:
          </p>
          <ul>
            <li>Business strategies and roadmaps</li>
            <li>Technical architecture and source code</li>
            <li>Client lists and financial data</li>
          </ul>
          <p>
            Confidentiality obligations survive the termination of any agreement between the parties.
          </p>
        </Section>

        <Section title="9. Disclaimer of Warranties">
          <p>
            The Services are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. Naxus does not warrant that the Services will be uninterrupted, error-free, or free of harmful components.
          </p>
        </Section>

        <Section title="10. Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, Naxus shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Services, even if Naxus has been advised of the possibility of such damages.
          </p>
        </Section>

        <Section title="11. Governing Law">
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the United Arab Emirates, specifically the Emirate of Dubai. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Dubai.
          </p>
        </Section>

        <Section title="12. Changes to Terms">
          <p>
            We reserve the right to modify these Terms at any time. We will notify users of significant changes by updating the date at the top of this page. Your continued use of the Services after any changes constitutes acceptance of the new Terms.
          </p>
        </Section>

        <Section title="13. Contact">
          <p>
            If you have questions about these Terms, please contact us at:
          </p>
          <div className="mt-3 p-4 rounded-xl bg-muted border text-sm space-y-1">
            <p><span className="font-medium">Company:</span> Naxus Technology Development</p>
            <p><span className="font-medium">Location:</span> Dubai, United Arab Emirates</p>
            <p><span className="font-medium">Email:</span> legal@naxus.dev</p>
          </div>
        </Section>

      </div>

      {/* Footer nav */}
      <div className="border-t">
        <div className="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between">
          <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </a>
          <a href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Privacy Policy →
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
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed [&_ul]:space-y-2 [&_ul]:ms-4 [&_ul]:list-disc [&_ul]:marker:text-muted-foreground/50">
        {children}
      </div>
    </section>
  );
}