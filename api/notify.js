const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');

const VAPID_PUBLIC  = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const SUPABASE_URL  = process.env.SUPABASE_URL  || 'https://jcfltkuobbjqicczpsjn.supabase.co';
const SUPABASE_KEY  = process.env.SUPABASE_KEY  || 'sb_publishable_15BDd64WYwMfW8VV9ZXDqg_Oa2ySvKc';
const ADMIN_PWD     = process.env.ADMIN_PASSWORD || 'shindo2025';

webpush.setVapidDetails('mailto:jeremy.boitrel@gmail.com', VAPID_PUBLIC, VAPID_PRIVATE);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { title, body, password } = req.body || {};
  if (password !== ADMIN_PWD) return res.status(401).json({ error: 'Non autorisé' });
  if (!title || !body)        return res.status(400).json({ error: 'Titre et message requis' });

  const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data } = await sb.from('data_store').select('value').eq('key', 'push_subscriptions').maybeSingle();
  const subscriptions = data?.value || [];

  if (!subscriptions.length) return res.json({ sent: 0, failed: 0, total: 0 });

  const results = await Promise.allSettled(
    subscriptions.map(sub =>
      webpush.sendNotification(sub, JSON.stringify({ title, body, url: 'https://site-shindokai.vercel.app/' }))
    )
  );

  // Nettoyer les abonnements expirés (410 Gone)
  const valid = subscriptions.filter((_, i) => results[i].status === 'fulfilled');
  const failed = results.filter(r => r.status === 'rejected').length;
  if (valid.length < subscriptions.length) {
    await sb.from('data_store').upsert({ key: 'push_subscriptions', value: valid });
  }

  res.json({ sent: valid.length, failed, total: subscriptions.length });
};
