import LegalLayout from "@/components/LegalLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      tag="PRIVACY_POLICY"
      lastUpdated="July 2026"
    >
      <p>
        VoltLab Builds ("we," "us," "our") builds and sells hand-assembled
        Arduino and non-Arduino electronics kits to students. This page
        explains what information we collect through voltlabbuilds.com (the
        "Site"), why we collect it, and what you can do about it.
      </p>

      <section>
        <h2 className="font-terminal text-xl text-[var(--accent)] mb-2">
          1. Information we collect
        </h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Account information:</strong> when you sign in with
            Google, we receive your name, email address, and profile picture
            from Google. We don't see or store your Google password.
          </li>
          <li>
            <strong>Order information:</strong> shipping name, address, and
            phone number you enter at checkout, plus what you bought and when.
          </li>
          <li>
            <strong>Payment information:</strong> payments are processed
            entirely by Razorpay. We never see or store your card number, UPI
            PIN, or bank details — Razorpay only sends us a confirmation that
            a payment succeeded.
          </li>
          <li>
            <strong>Cart and theme preferences:</strong> stored in your
            browser (localStorage) and, if signed in, your chosen theme is
            also saved to your account so it follows you across devices.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-terminal text-xl text-[var(--accent)] mb-2">
          2. How we use it
        </h2>
        <p>We use your information only to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Create and manage your account</li>
          <li>Process and ship your orders</li>
          <li>Contact you about an order (delays, delivery, issues)</li>
          <li>Improve the Site and catalog based on what's ordered</li>
        </ul>
        <p className="mt-2">
          We do not sell your personal information to anyone, and we do not
          use it for advertising.
        </p>
      </section>

      <section>
        <h2 className="font-terminal text-xl text-[var(--accent)] mb-2">
          3. Where your data lives
        </h2>
        <p>We use the following third-party services to run the Site:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Supabase</strong> — hosts our database (accounts, orders,
            product catalog) and handles sign-in
          </li>
          <li>
            <strong>Google</strong> — provides sign-in (OAuth); we never
            receive your Google password
          </li>
          <li>
            <strong>Razorpay</strong> — processes payments; card/UPI details
            go directly to Razorpay, not through our servers
          </li>
          <li>
            <strong>Vercel</strong> — hosts the website itself
          </li>
        </ul>
        <p className="mt-2">
          Each of these providers has its own privacy policy governing how
          they handle data on their end.
        </p>
      </section>

      <section>
        <h2 className="font-terminal text-xl text-[var(--accent)] mb-2">
          4. Your rights
        </h2>
        <p>You can, at any time:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>View or update your username and account details in Account settings</li>
          <li>Request a copy of the data we hold about you</li>
          <li>Request that we delete your account and associated data</li>
        </ul>
        <p className="mt-2">
          To request a data export or deletion, DM us on Instagram — we'll
          action it within a reasonable time, though order records may be
          retained briefly for accounting/legal purposes even after account
          deletion.
        </p>
      </section>

      <section>
        <h2 className="font-terminal text-xl text-[var(--accent)] mb-2">
          5. Cookies &amp; local storage
        </h2>
        <p>
          We use your browser's local storage (not tracking cookies) to
          remember your cart and theme choice between visits. This data stays
          on your device and isn't shared with advertisers.
        </p>
      </section>

      <section>
        <h2 className="font-terminal text-xl text-[var(--accent)] mb-2">
          6. Children's privacy
        </h2>
        <p>
          Our products are marketed to students, including school-age users.
          We don't knowingly collect personal information from children
          beyond what's needed to fulfill an order, and we recommend a
          parent/guardian's involvement for purchases made by minors.
        </p>
      </section>

      <section>
        <h2 className="font-terminal text-xl text-[var(--accent)] mb-2">
          7. Changes to this policy
        </h2>
        <p>
          We may update this policy as the Site grows. Material changes will
          be reflected by updating the "Last updated" date above.
        </p>
      </section>
    </LegalLayout>
  );
}
