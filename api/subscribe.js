const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jcfltkuobbjqicczpsjn.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_15BDd64WYwMfW8VV9ZXDqg_Oa2ySvKc';

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { subscription } = req.body || {};
  if (!subscription?.endpoint) return res.status(400).json({ error: 'Abonnement invalide' });

  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data } = await sb.from('data_store').select('value').eq('key', 'push_subscriptions').maybeSingle();
  const subs = data?.value || [];

  // Éviter les doublons
  const exists = subs.some(s => s.endpoint === subscription.endpoint);
  if (!exists) {
    subs.push(subscription);
    await sb.from('data_store').upsert({ key: 'push_subscriptions', value: subs });
  }

  res.json({ ok: true, total: subs.length });
};
