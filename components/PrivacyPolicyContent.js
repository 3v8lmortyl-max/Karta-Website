export default function PrivacyPolicyContent() {
  return (
    <div className="policy-page container">
      <h1 className="policy-title">Privacy Policy</h1>
      <p className="policy-intro">
        This policy explains what personal information KRTA collects, why we collect it, and how we protect it.
        By using our website and placing an order, you agree to the practices described here.
      </p>

      <section className="policy-section">
        <h2>Information We Collect</h2>
        <p>To process your orders and run our store, we collect information you provide, including:</p>
        <ul className="policy-list">
          <li>Your name, email address, and phone number.</li>
          <li>Your shipping and billing address.</li>
          <li>Order and purchase history.</li>
          <li>Account details if you sign up, including via Google sign-in.</li>
        </ul>
        <p>
          We do not store your full card or banking details — payments are handled securely by our payment
          provider (see below).
        </p>
      </section>

      <section className="policy-section">
        <h2>How We Use Your Information</h2>
        <ul className="policy-list">
          <li>To process, fulfil, and deliver your orders.</li>
          <li>To communicate with you about your order and provide support.</li>
          <li>To manage your account and saved addresses.</li>
          <li>To improve our products and website experience.</li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>Sharing With Service Providers</h2>
        <p>
          We share only the information necessary with trusted third parties who help us operate the store:
        </p>
        <ul className="policy-list">
          <li>Our payment provider (Razorpay), to securely process payments.</li>
          <li>Our courier partner, to ship and deliver your order.</li>
          <li>Google, if you choose to sign in with your Google account.</li>
          <li>Our hosting and database providers, to run the website and store data securely.</li>
        </ul>
        <p>We do not sell your personal information to anyone.</p>
      </section>

      <section className="policy-section">
        <h2>Cookies</h2>
        <p>
          Our website uses cookies and similar technologies to keep you signed in, remember your cart, and
          understand how the site is used. You can control cookies through your browser settings.
        </p>
      </section>

      <section className="policy-section">
        <h2>Data Security</h2>
        <p>
          We take reasonable measures to protect your information against unauthorized access, loss, or misuse.
          However, no method of transmission over the internet is completely secure, and we cannot guarantee
          absolute security.
        </p>
      </section>

      <section className="policy-section">
        <h2>Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal information, and you may withdraw
          consent where applicable. To make a request, contact us using the details below.
        </p>
      </section>

      <section className="policy-section">
        <h2>Contact &amp; Grievances</h2>
        <p>
          For any questions about this policy or your personal data, reach us on WhatsApp at +91 90146 12268 or on
          Instagram @krta.in. We aim to respond to privacy requests within a reasonable time.
        </p>
      </section>
    </div>
  );
}
