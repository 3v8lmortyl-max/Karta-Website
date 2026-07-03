export default function RefundPolicyContent() {
  return (
    <div className="policy-page container">
      <h1 className="policy-title">Refund Policy</h1>
      <p className="policy-intro">
        At KRTA, every product is crafted with care. Please read our refund policy before placing your order.
      </p>

      <section className="policy-section">
        <h2>Customized Orders</h2>
        <p>
          All customized and personalized products are non-refundable and non-returnable.
        </p>
        <p>
          Before production begins, we confirm all customization details such as design, size, color, and
          specifications. Once approved and production starts, the order cannot be cancelled, changed, returned,
          or refunded.
        </p>
      </section>

      <section className="policy-section">
        <h2>Ready-to-Wear Products</h2>
        <p>Refunds or replacements are available only if:</p>
        <ul className="policy-list">
          <li>You receive a damaged, defective, or incorrect product.</li>
          <li>The issue is reported within 5 days of delivery.</li>
          <li>The item is unused, unwashed, and returned with its original tags and packaging.</li>
        </ul>
        <p>
          Once the returned product is inspected and approved, the refund will be processed to the original
          payment method.
        </p>
      </section>

      <section className="policy-section">
        <h2>Refunds Are Not Available For</h2>
        <ul className="policy-list">
          <li>Customized or personalized products.</li>
          <li>Incorrect size selected after order confirmation.</li>
          <li>Minor variations in handmade artwork, as each KRTA piece is unique.</li>
          <li>Damage caused after delivery.</li>
          <li>Requests made more than 5 days after delivery.</li>
        </ul>
      </section>

      <section className="policy-section">
        <h2>Order Delays</h2>
        <p>
          Some KRTA products are handmade and may require additional production time.
        </p>
        <p>
          Delays caused by the handcrafted process, courier partners, or unforeseen circumstances do not qualify
          for refunds or cancellations after production has started.
        </p>
      </section>

      <section className="policy-section">
        <h2>Need Help?</h2>
        <p>
          If you have any questions before placing an order, please contact our support team. We're happy to
          assist you.
        </p>
      </section>
    </div>
  );
}
