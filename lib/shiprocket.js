// Shiprocket's auth token is valid for ~10 days. We cache it in memory per warm
// serverless instance rather than re-authenticating on every request — cheap win,
// and if the instance cools down we just fetch a fresh token on the next call.
let cachedToken = null;
let cachedAt = 0;
const TOKEN_TTL_MS = 9 * 24 * 60 * 60 * 1000; // refresh a day early, just in case

async function getToken() {
  if (cachedToken && Date.now() - cachedAt < TOKEN_TTL_MS) return cachedToken;

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  if (!email || !password) throw new Error('Shiprocket credentials are not configured.');

  const res = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Could not authenticate with Shiprocket.');
  const data = await res.json();
  if (!data?.token) throw new Error('Shiprocket did not return an auth token.');

  cachedToken = data.token;
  cachedAt = Date.now();
  return cachedToken;
}

// Looks up a shipment by AWB number. Returns a simplified, UI-friendly shape rather
// than Shiprocket's full raw payload.
export async function trackByAwb(awb) {
  const token = await getToken();
  const res = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${encodeURIComponent(awb)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    // Token expired/invalid mid-cache-window — force one retry with a fresh token.
    cachedToken = null;
    const retryToken = await getToken();
    const retryRes = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${encodeURIComponent(awb)}`, {
      headers: { Authorization: `Bearer ${retryToken}` },
    });
    return parseTrackingResponse(await retryRes.json());
  }

  if (!res.ok) throw new Error('Shiprocket tracking lookup failed.');
  return parseTrackingResponse(await res.json());
}

function parseTrackingResponse(data) {
  const track = data?.tracking_data;
  const shipment = track?.shipment_track?.[0];
  if (!shipment) return null;

  return {
    status: shipment.current_status || null,
    courier: shipment.courier_name || null,
    origin: shipment.origin || null,
    destination: shipment.destination || null,
    deliveredDate: shipment.delivered_date || null,
    edd: shipment.edd || null,
    history: (track.shipment_track_activities || []).map((a) => ({
      date: a.date,
      activity: a.activity,
      location: a.location,
    })),
  };
}
