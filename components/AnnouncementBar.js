const MSGS = [
  'Free shipping across India',
  'Hand-finished — no two pieces alike',
  'New Summer ’26 drop now live',
  'Easy 7-day returns',
];

export default function AnnouncementBar() {
  const loop = [...MSGS, ...MSGS];
  return (
    <div className="announce" aria-hidden="true">
      <div className="announce-track">
        {loop.map((m, i) => <span key={i} className="announce-item">{m}</span>)}
      </div>
    </div>
  );
}
