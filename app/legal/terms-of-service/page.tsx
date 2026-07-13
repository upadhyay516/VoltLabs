import LegalLayout from "@/components/LegalLayout";

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Terms of Service"
      tag="TERMS_OF_SERVICE"
      lastUpdated="July 2026"
    >
      <p>
        These Terms of Service ("Terms") govern your use of voltlabbuilds.com
        (the "Site") and any purchase made through it. By creating an account
        or placing an order, you agree to these Terms.
      </p>

      <section>
        <h2 className="font-terminal text-xl text-[var(--accent)] mb-2">
          1. Who we are
        </h2>
        <p>
          VoltLab Builds is an electronics kit business based in Noida,
          India, selling hand-assembled Arduino and non-Arduino kits aimed at
          school, college and university students.
        </p>
      </section>

      <section>
        <h2 className="font-terminal text-xl text-[var(--accent)] mb-2">
          2. Accounts
        </h2>
        <p>
          You sign in using your Google account. You're responsible for
          keeping that account secure. We reserve the right to suspend
          accounts used for fraud, abuse, or violation of these Terms.
        </p>
      </section>

      <section>
        <h2 className="font-terminal text-xl text-[var(--accent)] mb-2">
          3. Products &amp; availability
        </h2>
        <p>
          Every kit is hand-assembled in limited batches, so stock is real
          and limited — what's shown as "in stock" reflects actual units on
          hand at the time. Occasionally a listing may be temporarily
          unavailable while we restock; we'll notify you if an item you
          ordered turns out to be unavailable and issue a refund for that
          item.
        </p>
        <p className="mt-2">
          Product photos and descriptions are provided in good faith to
          represent the actual kit, but minor variations (component brand,
          wire color, board revision) may occur between batches.
        </p>
      </section>

      <section>
        <h2 className="font-terminal text-xl text-[var(--accent)] mb-2">
          4. Pricing &amp; payment
        </h2>
        <p>
          All prices are listed in Indian Rupees (₹) and include applicable
          taxes unless stated otherwise. Payments are processed securely by
          Razorpay — we never see or store your card, UPI, or banking
          details. An order is only confirmed once payment is successfully
          verified.
        </p>
      </section>

      <section>
        <h2 className="font-terminal text-xl text-[var(--accent)] mb-2">
          5. Shipping
        </h2>
        <p>
          We ship to the address provided at checkout. Please double-check
          your address and phone number — we're not responsible for delays
          or non-delivery caused by incorrect shipping details. Estimated
          delivery timelines will be communicated via Instagram DM or the
          contact details provided at checkout.
        </p>
      </section>

      <section>
        <h2 className="font-terminal text-xl text-[var(--accent)] mb-2">
          6. Returns &amp; refunds
        </h2>
        <p>
          Damaged or defective items can be reported within 48 hours of
          delivery for a replacement or refund. Unopened, unused kits can be
          returned within 7 days of delivery (return shipping paid by the
          customer). Contact us directly via Instagram DM to arrange a
          return or refund.
        </p>
      </section>

      <section>
        <h2 className="font-terminal text-xl text-[var(--accent)] mb-2">
          7. Educational use
        </h2>
        <p>
          Our kits are intended for educational and hobbyist electronics
          projects. Basic soldering, wiring, and circuit-handling knowledge
          is assumed; younger students should build with adult or instructor
          supervision, especially for kits involving heat sources (soldering)
          or mains-adjacent components.
        </p>
      </section>

      <section>
        <h2 className="font-terminal text-xl text-[var(--accent)] mb-2">
          8. Limitation of liability
        </h2>
        <p>
          Kits are provided for learning purposes. We're not liable for
          indirect or consequential damages arising from misuse,
          incorrect wiring, or modification of a kit outside its intended
          design. Our liability for any single order is limited to the
          amount paid for that order.
        </p>
      </section>

      <section>
        <h2 className="font-terminal text-xl text-[var(--accent)] mb-2">
          9. Intellectual property
        </h2>
        <p>
          Site content, branding, product photography, and circuit
          documentation are owned by VoltLab Builds unless otherwise noted.
          You're welcome to build and learn from what you purchase — please
          don't resell our documentation or branding as your own.
        </p>
      </section>

      <section>
        <h2 className="font-terminal text-xl text-[var(--accent)] mb-2">
          10. Governing law
        </h2>
        <p>
          These Terms are governed by the laws of India. Any disputes will
          be subject to the jurisdiction of courts in Noida, Uttar Pradesh.
        </p>
      </section>

      <section>
        <h2 className="font-terminal text-xl text-[var(--accent)] mb-2">
          11. Changes to these Terms
        </h2>
        <p>
          We may update these Terms as the business grows. Continued use of
          the Site after changes means you accept the updated Terms.
        </p>
      </section>
    </LegalLayout>
  );
}
