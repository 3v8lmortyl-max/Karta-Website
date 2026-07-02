export default function AccountCountsSkeleton() {
  return (
    <>
      <div className="account-card account-card-skeleton">
        <h3>Order History</h3>
        <p className="skeleton-line" />
      </div>
      <div className="account-card account-card-skeleton">
        <h3>Saved Addresses</h3>
        <p className="skeleton-line" />
      </div>
    </>
  );
}
