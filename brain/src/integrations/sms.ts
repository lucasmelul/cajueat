/**
 * SPEC-013 "Guardá tu perfil": real OTP delivery via Twilio's SMS API. Deliberately narrow,
 * same pattern as googlePlaces.ts — a plain REST call (Basic Auth, x-www-form-urlencoded),
 * no SDK dependency for a single endpoint. Unconfigured (no TWILIO_* env vars) is a valid,
 * expected state for local dev: routes/identity.ts falls back to returning the code directly
 * in the response instead of pretending an SMS was sent.
 */

function credentials(): { accountSid: string; authToken: string; fromNumber: string } | null {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;
  if (!accountSid || !authToken || !fromNumber) return null;
  return { accountSid, authToken, fromNumber };
}

export function isSmsConfigured(): boolean {
  return credentials() !== null;
}

/** Returns true only if Twilio actually accepted the message — never assumed on a network/API error. */
export async function sendOtpSms(phone: string, code: string): Promise<boolean> {
  const creds = credentials();
  if (!creds) return false;

  const body = new URLSearchParams({
    To: phone,
    From: creds.fromNumber,
    Body: `Tu código Lugarcito es ${code}. Vence en 5 minutos.`,
  });

  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${creds.accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${creds.accountSid}:${creds.authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });
    if (!res.ok) {
      console.error('twilio_send_failed', res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('twilio_send_error', err);
    return false;
  }
}
