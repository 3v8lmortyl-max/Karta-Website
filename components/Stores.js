import Link from 'next/link';

const STORES = [
  { city: 'Hyderabad', status: 'Flagship studio',  addr: 'Road No. 12, Banjara Hills, Hyderabad, Telangana 500034', phone: '+91 90000 00010', bg: 'linear-gradient(150deg,#e7e2da,#b59b78)' },
  { city: 'Bengaluru', status: 'By appointment',   addr: '100ft Road, Indiranagar, Bengaluru, Karnataka 560038',    phone: '+91 90000 00011', bg: 'linear-gradient(150deg,#cdd3dc,#9aa6b6)' },
  { city: 'Mumbai',    status: 'By appointment',   addr: 'Linking Road, Khar West, Mumbai, Maharashtra 400052',     phone: '+91 90000 00012', bg: 'linear-gradient(150deg,#f0c98a,#d68b3c)' },
  { city: 'Delhi',     status: 'Opening soon',     addr: 'M Block Market, Greater Kailash II, New Delhi 110048',    phone: '+91 90000 00013', bg: 'linear-gradient(150deg,#aeb9d6,#5f6f9e)' },
];

export default function Stores() {
  return (
    <section className="section">
      <div className="container">
        <div className="sec-head"><h2 className="sec-title">Find us across India</h2></div>
        <div className="stores-track">
          {STORES.map((s) => (
            <div className="store-card" key={s.city}>
              <div className="store-img" style={{ background: s.bg }} />
              <span className="store-status">{s.status}</span>
              <h3 className="store-city">{s.city}</h3>
              <Link href="/about" className="store-dir">Get direction</Link>
              <p className="store-addr">{s.addr}</p>
              <a className="store-phone" href={`tel:${s.phone.replace(/\s/g, '')}`}>{s.phone}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
