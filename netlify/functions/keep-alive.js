// Supabase free tier 7 kun inaktivlikdan keyin pauza qiladi.
// Bu funksiya har 6 kunda bir marta avtomatik ping yuboradi.

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ijlzxkwfrzsqjerbuvcp.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqbHp4a3dmcnpzcWplcmJ1dmNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMTI1NDgsImV4cCI6MjA5MDY4ODU0OH0.6WMUAX45Ve2RB-wIKKXmrSho_p1Zy99Ib0L6WRTVixg';

exports.handler = async () => {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?select=id&limit=1`,
      {
        method: 'GET',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error(`Supabase keep-alive FAILED: ${res.status} — ${text}`);
      return { statusCode: 500, body: `ping failed: ${res.status}` };
    }

    console.log(`Supabase keep-alive OK — ${new Date().toISOString()}`);
    return { statusCode: 200, body: 'ok' };
  } catch (err) {
    console.error(`Supabase keep-alive ERROR: ${err.message}`);
    return { statusCode: 500, body: err.message };
  }
};
